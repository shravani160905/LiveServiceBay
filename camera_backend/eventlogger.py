"""
event_logger.py  —  MVP v6
--------------------------
Bay Event Logger — single bay, single camera

Architecture:
- ROI setup built in — runs interactively on first launch if roi_config.json missing
- Pipeline is NOW triggered by frontend "Start Service" button, not YOLO presence
- Polling thread checks Supabase every 5s for In Progress jobs
- YOLO + OCR run after pipeline is triggered — cross-verifies plate vs vehicleNumber
- Plate mismatch → writes ocrWarning to Job row → frontend shows alert to technician
- EXIT triggered by frontend marking job Completed (not YOLO absence)
- YOLO still runs for OCR crop detection only
- EDSR 4x upscale → CLAHE → Otsu → EasyOCR with allowlist
- Positional correction + state code validation for Indian plates
- Stable frame capture — waits for car to stop before OCR
- OCR runs in background thread (preview never freezes)
- Entry clip: 3 sec before entry confirmed + 2 sec after
- Exit clip:  3 sec before exit confirmed + 2 sec after
- MP4 / H264 format — plays on any device
- ENTRY + EXIT logged to Supabase PostgreSQL bay_events

Usage:
    python event_logger.py
    python event_logger.py --source rtsp://192.168.1.64/stream
"""

import cv2
import easyocr
import json
import logging
import numpy as np
import os
import re
import uuid
import argparse
import queue
import threading
import time
from collections import deque, Counter
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
import sqlite3
import psycopg2
import psycopg2.pool
from ultralytics import YOLO
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"
# ─────────────────────────────────────────────
# LOGGING SETUP
# ─────────────────────────────────────────────

log_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s",
                                   datefmt="%Y-%m-%d %H:%M:%S")

file_handler = RotatingFileHandler(
    "event_logger.log",
    maxBytes=5 * 1024 * 1024,
    backupCount=3
)
file_handler.setFormatter(log_formatter)

console_handler = logging.StreamHandler()
console_handler.setFormatter(log_formatter)

logger = logging.getLogger("BayLogger")
logger.setLevel(logging.DEBUG)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

BASE_DIR = Path(__file__).parent

# ─────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────

VIDEO_SOURCE = str(BASE_DIR / "new_sample_sample.mp4")
MODEL_PATH   = str(BASE_DIR / "plate_model.pt")
ROI_CONFIG   = str(BASE_DIR / "roi_config.json")
CROPS_DIR    = str(BASE_DIR / "event_crops")
CLIPS_DIR    = str(BASE_DIR / "event_clips")
EDSR_MODEL   = str(BASE_DIR / "EDSR_x4.pb")

POLL_INTERVAL = 5   # seconds between Supabase polls

# ─────────────────────────────────────────────
# DATABASE CONNECTION INITIALIZATION
# ─────────────────────────────────────────────

from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("DATABASE_URL")

# 🩹 PRISMA TO PSYCOPG2 COMPATIBILITY FIX:
# If the connection string contains Node.js/Prisma options like connection_limit,
# clean them out so psycopg2's parser doesn't crash.
if SUPABASE_URL and "?" in SUPABASE_URL:
    base_url, query_params = SUPABASE_URL.split("?", 1)
    # Rebuild the query string filtering out "connection_limit" or "pool_timeout"
    clean_params = [p for p in query_params.split("&") if not p.startswith("connection_limit") and not p.startswith("pool_timeout")]
    if clean_params:
        SUPABASE_URL = base_url + "?" + "&".join(clean_params)
    else:
        SUPABASE_URL = base_url

# Initialize the connection pool using the cleaned database URL string
db_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=5,
    dsn=SUPABASE_URL
)

# Detection
YOLO_CONFIDENCE      = 0.4
DETECT_EVERY_N       = 5

# Stable frame detection
STABLE_FRAMES_NEEDED = 10
STABLE_THRESHOLD     = 300

# Buffers
FPS              = 30
PRE_BUFFER_SECS  = 3
POST_BUFFER_SECS = 2
OCR_BUFFER_SECS  = 2

# Plate validation
INDIAN_PLATE_REGEX = r'^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{3,4}$'

# ─────────────────────────────────────────────
# SETUP DIRS
# ─────────────────────────────────────────────

os.makedirs(CROPS_DIR, exist_ok=True)
os.makedirs(CLIPS_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# ROI SETUP
# ─────────────────────────────────────────────

def run_roi_setup(video_source, config_file):
    print("=" * 60)
    print("  SETUP ROI — Service Bay Region Selector")
    print("=" * 60)
    print(f"Source : {video_source}\n")
    print("INSTRUCTIONS:")
    print("  1. A window will open showing the video frame")
    print("  2. Click and drag to draw a box around the service bay")
    print("  3. Press S to save the ROI and exit")
    print("  4. Press R to reset and redraw if not happy")
    print("  5. Press Q to quit without saving\n")

    cap = cv2.VideoCapture(video_source)
    if not cap.isOpened():
        logger.error(f"ROI SETUP: Could not open video source: {video_source}")
        return False

    ret, base_frame = cap.read()
    cap.release()

    if not ret:
        logger.error("ROI SETUP: Could not read frame from video.")
        return False

    h, w   = base_frame.shape[:2]
    scale  = min(1280 / w, 720 / h, 1.0)
    if scale < 1.0:
        base_frame = cv2.resize(base_frame, (int(w * scale), int(h * scale)))
        h, w       = base_frame.shape[:2]

    logger.info(f"ROI SETUP: Frame size {w}x{h}")

    drawing   = False
    roi_start = [-1, -1]
    roi_end   = [-1, -1]
    roi_final = [None]

    def mouse_callback(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            drawing        = True
            roi_start[:]   = [x, y]
            roi_end[:]     = [x, y]
        elif event == cv2.EVENT_MOUSEMOVE:
            if flags & cv2.EVENT_FLAG_LBUTTON:
                roi_end[:] = [x, y]
        elif event == cv2.EVENT_LBUTTONUP:
            roi_end[:]     = [x, y]
            roi_final[0]   = (tuple(roi_start), tuple(roi_end))
            print(f"[INFO] ROI drawn: top-left {tuple(roi_start)} → bottom-right {tuple(roi_end)}")

    window_name = "ROI Selector - Draw box then press S to save"
    cv2.namedWindow(window_name)
    cv2.setMouseCallback(window_name, mouse_callback)

    saved = False
    while True:
        display = base_frame.copy()

        cv2.putText(display, "Click and drag to draw ROI box",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
        cv2.putText(display, "S = Save  |  R = Reset  |  Q = Quit",
                    (10, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

        if roi_start[0] != -1 and roi_end[0] != -1:
            pt1 = tuple(roi_start)
            pt2 = tuple(roi_end)
            overlay = display.copy()
            cv2.rectangle(overlay, pt1, pt2, (0, 255, 0), -1)
            cv2.addWeighted(overlay, 0.2, display, 0.8, 0, display)
            cv2.rectangle(display, pt1, pt2, (0, 255, 0), 2)
            x1 = min(roi_start[0], roi_end[0])
            y1 = min(roi_start[1], roi_end[1])
            x2 = max(roi_start[0], roi_end[0])
            y2 = max(roi_start[1], roi_end[1])
            cv2.putText(display, f"ROI: ({x1},{y1}) to ({x2},{y2})",
                        (10, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow(window_name, display)
        key = cv2.waitKey(1) & 0xFF

        if key in (ord('s'), ord('S')):
            if roi_final[0] is None:
                print("[WARNING] No ROI drawn yet. Draw a box first.")
            else:
                x1 = min(roi_final[0][0][0], roi_final[0][1][0])
                y1 = min(roi_final[0][0][1], roi_final[0][1][1])
                x2 = max(roi_final[0][0][0], roi_final[0][1][0])
                y2 = max(roi_final[0][0][1], roi_final[0][1][1])
                if (x2 - x1) < 50 or (y2 - y1) < 50:
                    print("[WARNING] ROI too small. Draw a larger box.")
                else:
                    config = {
                        "roi": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                        "frame_width":  w,
                        "frame_height": h,
                        "video_source": video_source,
                        "notes": "ROI coordinates for service bay."
                    }
                    with open(config_file, 'w') as f:
                        json.dump(config, f, indent=4)
                    logger.info(f"ROI SETUP: Saved to {config_file} — x1={x1}, y1={y1}, x2={x2}, y2={y2}")
                    saved = True
                    break

        elif key in (ord('r'), ord('R')):
            roi_start[:] = [-1, -1]
            roi_end[:]   = [-1, -1]
            roi_final[0] = None
            print("[INFO] ROI reset.")

        elif key in (ord('q'), ord('Q')):
            print("[INFO] Quit without saving.")
            break

    cv2.destroyAllWindows()
    return saved


def load_roi_config(config_file):
    if not os.path.exists(config_file):
        return None
    with open(config_file) as f:
        roi_data = json.load(f)
    r       = roi_data["roi"]
    saved_w = roi_data.get("frame_width",  1280)
    saved_h = roi_data.get("frame_height", 720)
    rel = {
        "x1": r["x1"] / saved_w,
        "y1": r["y1"] / saved_h,
        "x2": r["x2"] / saved_w,
        "y2": r["y2"] / saved_h,
    }
    logger.info(f"ROI loaded (relative): "
        f"x1={rel['x1']:.3f}, y1={rel['y1']:.3f}, "
        f"x2={rel['x2']:.3f}, y2={rel['y2']:.3f}")
    return rel

# ─────────────────────────────────────────────
# LOAD MODELS
# ─────────────────────────────────────────────

logger.info("Loading YOLO model...")
model = YOLO(MODEL_PATH)

logger.info("Loading EasyOCR...")
reader      = easyocr.Reader(['en'], gpu=False)
reader_lock = threading.Lock()

sr = None
if os.path.exists(EDSR_MODEL):
    try:
        from cv2 import dnn_superres
        sr = dnn_superres.DnnSuperResImpl_create()
        sr.readModel(EDSR_MODEL)
        sr.setModel("edsr", 4)
        logger.info("EDSR super resolution loaded — 4x upscaling enabled")
    except Exception as e:
        logger.warning(f"EDSR failed to load ({e}) — falling back to INTER_CUBIC 4x")
        sr = None
else:
    logger.warning("EDSR_x4.pb not found — falling back to INTER_CUBIC upscaling")

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────

def get_db():
    return db_pool.getconn()

def release_db(conn):
    db_pool.putconn(conn)

def poll_active_jobs():
    """
    Returns list of jobs where status = 'In Progress' AND startedAt IS NOT NULL.
    Each row returned as a dict with job details.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT id, "vehicleNumber", "phoneNumber", "customerEmail", "assignedBay", "startedAt"
               FROM "Job"
               WHERE status = 'In Progress'
               AND "startedAt" IS NOT NULL
               ORDER BY "startedAt" ASC"""
        )
        rows = cursor.fetchall()
        cursor.close()
        jobs = []
        for row in rows:
            jobs.append({
                "job_id":         row[0],
                "vehicle_number": row[1],
                "phone_number":   row[2],
                "customer_email": row[3],
                "assigned_bay":   row[4],
                "started_at":     row[5],
            })
        return jobs
    except Exception as e:
        logger.error(f"POLL Job poll failed: {e}")
        return []
    finally:
        if conn:
            release_db(conn)

def poll_job_completed(job_id):
    """
    Returns True if job with job_id has status = 'Completed'.
    Used to detect frontend-triggered EXIT.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT status FROM "Job" WHERE id = %s""",
            (job_id,)
        )
        row = cursor.fetchone()
        cursor.close()
        if row and row[0] == "Completed":
            return True
        return False
    except Exception as e:
        logger.error(f"POLL Job completion check failed for {job_id}: {e}")
        return False
    finally:
        if conn:
            release_db(conn)

def write_ocr_warning(job_id, ocr_plate, expected_plate):
    """Writes mismatch warning to Job row so frontend can display alert."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        warning_msg = f"MISMATCH: Camera read {ocr_plate}, job has {expected_plate}"
        cursor.execute(
            """UPDATE "Job" SET "ocrWarning" = %s, "updatedAt" = NOW() WHERE id = %s""",
            (warning_msg, job_id)
        )
        conn.commit()
        cursor.close()
        logger.warning(f"OCR MISMATCH written to DB — job {job_id}: {warning_msg}")
    except Exception as e:
        logger.error(f"Failed to write OCR warning for job {job_id}: {e}")
    finally:
        if conn:
            release_db(conn)

def clear_ocr_warning(job_id):
    """Clears ocrWarning once plate is verified OK."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE "Job" SET "ocrWarning" = NULL, "updatedAt" = NOW() WHERE id = %s""",
            (job_id,)
        )
        conn.commit()
        cursor.close()
        logger.info(f"OCR warning cleared for job {job_id}")
    except Exception as e:
        logger.error(f"Failed to clear OCR warning for job {job_id}: {e}")
    finally:
        if conn:
            release_db(conn)

def update_job_status(job_id, status, completed_at=None):
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        if completed_at:
            cursor.execute(
                """UPDATE "Job" SET status = %s, "completedAt" = %s, "updatedAt" = NOW()
                   WHERE id = %s""",
                (status, completed_at, job_id)
            )
        else:
            cursor.execute(
                """UPDATE "Job" SET status = %s, "updatedAt" = NOW()
                   WHERE id = %s""",
                (status, job_id)
            )
        conn.commit()
        cursor.close()
        logger.info(f"Job {job_id} status updated to {status}")
    except Exception as e:
        logger.error(f"Job status update failed for {job_id}: {e}")
    finally:
        if conn:
            release_db(conn)

def log_entry(plate_number, plate_image_path, clip_path, job_id=None, event_time=None, _retry=False):
    event_id = str(uuid.uuid4())
    try:
        event_dt = event_time or datetime.now()
        conn     = get_db()
        cursor   = conn.cursor()
        cursor.execute(
            """INSERT INTO bay_events
            (event_id, job_id, plate_number, entry_image, entry_clip, entry_time)
            VALUES (%s, %s, %s, %s, %s, %s)""",
            (event_id, job_id, plate_number, plate_image_path, clip_path, event_dt)
        )
        conn.commit()
        cursor.close()
        release_db(conn)
        logger.info(f"DB ENTRY logged -> {plate_number}  job_id: {job_id}  event_id: {event_id}")
        return event_id
    except Exception as e:
        logger.error(f"DB ENTRY log failed: {e}")
        if not _retry:
            queue_failed_event("ENTRY", plate_number, plate_image_path, clip_path, event_time or datetime.now(), job_id=job_id)
        if _retry:
            raise
    return None

def log_exit(plate_number, plate_image_path, clip_path, entry_time, full_clip_path=None, job_id=None, event_time=None, _retry=False):
    try:
        event_dt      = event_time or datetime.now()
        delta         = event_dt - entry_time
        duration_mins = round(delta.total_seconds() / 60, 1)
        conn          = get_db()
        cursor        = conn.cursor()
        cursor.execute(
            """UPDATE bay_events
               SET exit_image = %s,
                   exit_clip = %s,
                   exit_time = %s,
                   duration_mins = %s,
                   full_clip_path = %s
               WHERE job_id = %s""",
            (plate_image_path, clip_path, event_dt, duration_mins, full_clip_path, job_id)
        )
        conn.commit()
        cursor.close()
        release_db(conn)
        logger.info(f"DB EXIT updated -> {plate_number}  duration: {duration_mins} mins  job_id: {job_id}")
    except Exception as e:
        logger.error(f"DB EXIT update failed: {e}")
        if not _retry:
            queue_failed_event("EXIT", plate_number, plate_image_path, clip_path, event_time or datetime.now(), entry_time, full_clip_path, job_id=job_id)
        if _retry:
            raise

# ─────────────────────────────────────────────
# VIDEO CLIP WRITER
# ─────────────────────────────────────────────

def get_video_writer(filepath, frame_width, frame_height, fps=30):
    for codec in ['avc1', 'H264', 'mp4v']:
        fourcc = cv2.VideoWriter_fourcc(*codec)
        writer = cv2.VideoWriter(filepath, fourcc, fps, (frame_width, frame_height))
        if writer.isOpened():
            logger.info(f"CLIP Using codec: {codec}")
            return writer
        writer.release()
    logger.error("CLIP No working codec found")
    return None

def write_clip(frames, filepath, frame_width, frame_height, fps=30):
    if not frames:
        logger.info("CLIP No frames to write")
        return False
    writer = get_video_writer(filepath, frame_width, frame_height, fps)
    if writer is None:
        return False
    for f in frames:
        writer.write(f)
    writer.release()
    logger.info(f"CLIP Saved: {filepath} ({len(frames)} frames)")
    return True

# ─────────────────────────────────────────────
# OCR + PREPROCESSING
# ─────────────────────────────────────────────

def upscale_crop(crop):
    if sr is not None:
        try:
            return sr.upsample(crop)
        except Exception as e:
            logger.warning(f"EDSR upsample failed: {e} — using INTER_CUBIC")
    return cv2.resize(crop, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)

def preprocess_for_ocr(upscaled):
    gray      = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
    clahe     = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced  = clahe.apply(gray)
    _, thresh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    thresh    = cv2.copyMakeBorder(thresh, 10, 10, 10, 10,
                                cv2.BORDER_CONSTANT, value=255)
    return thresh

def clean_plate_text(raw):
    return re.sub(r'[^A-Z0-9]', '', raw.upper())

def validate_plate(text):
    return bool(re.match(INDIAN_PLATE_REGEX, text))

# ─────────────────────────────────────────────
# POSITIONAL CORRECTION
# ─────────────────────────────────────────────

LETTER_TO_NUM = {
    'O': '0', 'I': '1', 'S': '5', 'B': '8',
    'G': '6', 'Z': '2', 'T': '1', 'D': '0',
    'L': '1', 'Q': '0',
}

NUM_TO_LETTER = {
    '0': 'O', '1': 'I', '5': 'S', '8': 'B',
    '6': 'G', '2': 'Z',
}

VALID_STATE_CODES = [
    'MH', 'DL', 'GJ', 'KA', 'TN', 'UP', 'RJ', 'WB',
    'MP', 'AP', 'TS', 'KL', 'HR', 'PB', 'BR', 'OD',
    'JK', 'HP', 'UK', 'GA', 'MN', 'ML', 'MZ', 'NL',
    'SK', 'TR', 'AR', 'AS', 'CH', 'DN', 'DD', 'LD',
    'PY', 'AN', 'JH', 'CG'
]

def closest_state_code(raw):
    if len(raw) != 2:
        logger.warning(f"State code correction skipped — input not 2 chars: '{raw}'")
        return raw
    if raw in VALID_STATE_CODES:
        return raw
    best       = raw
    best_score = -1
    for code in VALID_STATE_CODES:
        score = sum(1 for a, b in zip(raw, code) if a == b)
        if score > best_score:
            best_score = score
            best       = code
    if best != raw:
        logger.info(f"State code correction: {raw} -> {best}")
    return best

def positional_correction(text):
    if not text or len(text) < 6:
        return text
    pattern = re.match(r'^([A-Z0-9]{2})([A-Z0-9]{1,2})([A-Z0-9]{1,3}?)([A-Z0-9]{3,4})$', text)
    if not pattern:
        return text
    seg1 = pattern.group(1)
    seg2 = pattern.group(2)
    seg3 = pattern.group(3)
    seg4 = pattern.group(4)

    def fix_letters(seg):
        return ''.join(NUM_TO_LETTER.get(c, c) for c in seg)

    def fix_numbers(seg):
        return ''.join(LETTER_TO_NUM.get(c, c) for c in seg)

    state_code = closest_state_code(fix_letters(seg1))
    corrected  = state_code + fix_numbers(seg2) + fix_letters(seg3) + fix_numbers(seg4)
    if corrected != text:
        logger.info(f"OCR Positional correction: {text} -> {corrected}")
    return corrected

# ─────────────────────────────────────────────
# ROI HELPERS
# ─────────────────────────────────────────────

def get_roi_abs(roi_rel, frame_w, frame_h):
    if roi_rel is None:
        return None
    x1 = int(roi_rel["x1"] * frame_w)
    y1 = int(roi_rel["y1"] * frame_h)
    x2 = int(roi_rel["x2"] * frame_w)
    y2 = int(roi_rel["y2"] * frame_h)
    return (x1, y1, x2 - x1, y2 - y1)

def get_roi_frame(frame, roi_rel):
    h, w = frame.shape[:2]
    roi  = get_roi_abs(roi_rel, w, h)
    if roi is None:
        return frame, 0, 0
    x, y, rw, rh = roi
    return frame[y:y+rh, x:x+rw], x, y

# ─────────────────────────────────────────────
# STABLE FRAME DETECTION
# ─────────────────────────────────────────────

def is_roi_stable(frame1, frame2, roi_rel):
    roi1 = get_roi_frame(frame1, roi_rel)[0]
    roi2 = get_roi_frame(frame2, roi_rel)[0]
    if roi1.shape != roi2.shape:
        return False
    diff    = cv2.absdiff(roi1, roi2)
    gray    = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    changed = np.sum(gray > 25)
    return int(changed) < STABLE_THRESHOLD

# ─────────────────────────────────────────────
# MAJORITY VOTE OCR
# ─────────────────────────────────────────────

def majority_vote_ocr(ocr_buffer_snapshot, result_dict, result_lock):
    try:
        reads         = []
        crops         = {}
        upscale_cache = {}

        for crop_img in ocr_buffer_snapshot:
            if crop_img is None or crop_img.size == 0:
                continue
            text, upscaled = read_plate_from_crop(crop_img, upscale_cache)
            if text and len(text) >= 4:
                reads.append(text)
                if text not in crops:
                    crops[text] = upscaled

        if not reads:
            with result_lock:
                result_dict["plate"] = None
                result_dict["crop"]  = None
                result_dict["done"]  = True
            logger.warning("OCR THREAD No readable plate found")
            return

        valid  = [t for t in reads if validate_plate(t)]
        pool   = valid if valid else reads
        winner, count = Counter(pool).most_common(1)[0]
        logger.info(f"OCR THREAD Votes: {Counter(pool).most_common(3)} -> {winner} ({count}/{len(reads)})")

        with result_lock:
            result_dict["plate"] = winner
            result_dict["crop"]  = crops.get(winner)
            result_dict["done"]  = True
    except Exception as e:
        logger.error(f"OCR Thread crashed: {e}")
    finally:
        with result_lock:
            if not result_dict.get("done"):
                result_dict["plate"] = None
                result_dict["crop"]  = None
                result_dict["done"]  = True

def read_plate_from_crop(crop_img, upscale_cache=None):
    crop_id = id(crop_img)
    if upscale_cache is not None and crop_id in upscale_cache:
        upscaled = upscale_cache[crop_id]
    else:
        upscaled = upscale_crop(crop_img)
        if upscale_cache is not None:
            upscale_cache[crop_id] = upscaled
    thresh   = preprocess_for_ocr(upscaled)
    with reader_lock:
        results = reader.readtext(
            thresh, detail=1, paragraph=False,
            allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        )
    raw       = " ".join([r[1] for r in results])
    cleaned   = clean_plate_text(raw)
    corrected = positional_correction(cleaned)
    return corrected, upscaled

def save_plate_crop(upscaled_crop, plate_number, event_type):
    if upscaled_crop is None:
        return None
    ts   = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(CROPS_DIR, f"{plate_number}_{event_type}_{ts}.jpg")
    cv2.imwrite(path, upscaled_crop, [cv2.IMWRITE_JPEG_QUALITY, 95])
    logger.info(f"CROP Saved: {path}")
    return path

def ocr_worker(ocr_queue):
    while True:
        job = ocr_queue.get()
        if job is None:
            ocr_queue.task_done()
            break
        snapshot, result_dict, result_lock = job
        majority_vote_ocr(snapshot, result_dict, result_lock)
        ocr_queue.task_done()

# ─────────────────────────────────────────────
# DB RETRY QUEUE (SQLite fallback)
# ─────────────────────────────────────────────

RETRY_DB       = str(BASE_DIR / "retry_queue.db")
RETRY_MAX      = 5
RETRY_INTERVAL = 30

def init_retry_queue():
    conn = sqlite3.connect(RETRY_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS failed_events (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type     TEXT,
            plate          TEXT,
            image_path     TEXT,
            clip_path      TEXT,
            full_clip_path TEXT,
            event_time     TEXT,
            entry_time     TEXT,
            retries        INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def queue_failed_event(event_type, plate, image_path, clip_path, event_time,
                        entry_time=None, full_clip_path=None, job_id=None):
    try:
        conn = sqlite3.connect(RETRY_DB)
        conn.execute("""
            INSERT INTO failed_events
            (event_type, plate, image_path, clip_path, full_clip_path, event_time, entry_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            event_type, plate, image_path, clip_path, full_clip_path,
            event_time.isoformat() if event_time else None,
            entry_time.isoformat() if entry_time else None,
        ))
        conn.commit()
        conn.close()
        logger.warning(f"RETRY QUEUE Event queued for retry: {event_type} {plate}")
    except Exception as e:
        logger.error(f"Retry queue write failed: {e}")

def _parse_retry_time(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None

def retry_worker():
    while True:
        time.sleep(RETRY_INTERVAL)
        conn = None
        try:
            conn = sqlite3.connect(RETRY_DB)
            rows = conn.execute(
                "SELECT id, event_type, plate, image_path, clip_path, full_clip_path, "
                "event_time, entry_time, retries FROM failed_events WHERE retries < ? ORDER BY id ASC",
                (RETRY_MAX,)
            ).fetchall()

            for row_id, event_type, plate, image_path, clip_path, full_clip_path, \
                    event_time, entry_time, retries in rows:
                event_dt = _parse_retry_time(event_time) or datetime.now()
                entry_dt = _parse_retry_time(entry_time)
                try:
                    if event_type == "ENTRY":
                        log_entry(plate, image_path, clip_path, event_time=event_dt, _retry=True)
                    elif event_type == "EXIT":
                        log_exit(plate, image_path, clip_path, entry_dt or event_dt,
                                 full_clip_path=full_clip_path, event_time=event_dt, _retry=True)
                    else:
                        raise ValueError(f"Unknown event_type: {event_type}")
                    conn.execute("DELETE FROM failed_events WHERE id = ?", (row_id,))
                    conn.commit()
                    logger.info(f"RETRY QUEUE Replayed and cleared: {event_type} {plate}")
                except Exception as e:
                    new_retries = retries + 1
                    if new_retries >= RETRY_MAX:
                        conn.execute("DELETE FROM failed_events WHERE id = ?", (row_id,))
                        logger.warning(f"RETRY QUEUE Dropped after max retries: {event_type} {plate}")
                    else:
                        conn.execute("UPDATE failed_events SET retries = ? WHERE id = ?",
                                     (new_retries, row_id))
                        logger.warning(f"RETRY QUEUE Replay failed ({new_retries}/{RETRY_MAX}): "
                                       f"{event_type} {plate} ({e})")
                    conn.commit()
        except Exception as e:
            logger.error(f"RETRY QUEUE worker error: {e}")
        finally:
            if conn is not None:
                conn.close()

init_retry_queue()
threading.Thread(target=retry_worker, daemon=True).start()

# ─────────────────────────────────────────────
# POLLING THREAD
# ─────────────────────────────────────────────
#
# Shared state between polling thread and main loop.
# Main loop reads these; polling thread writes them.
# Protected by poll_lock.
#
# poll_state["trigger"]     — set to job dict when a new In Progress job is found
# poll_state["exit_signal"] — set to True when active job is marked Completed on frontend

poll_state = {
    "trigger":     None,   # job dict → tells main loop to start pipeline
    "exit_signal": False,  # True → tells main loop to trigger EXIT
}
poll_lock = threading.Lock()


def polling_thread(active_job_id_ref):
    """
    Runs every POLL_INTERVAL seconds.
    - active_job_id_ref is a list[str|None] so we can mutate it from this thread.
    - Checks for new In Progress jobs → sets poll_state["trigger"]
    - Checks if active job is now Completed → sets poll_state["exit_signal"]
    """
    seen_job_ids = set()  # jobs we've already triggered pipeline for

    while True:
        time.sleep(POLL_INTERVAL)
        try:
            with poll_lock:
                current_active_id = active_job_id_ref[0]

            # ── Check if active job completed on frontend ──
            if current_active_id:
                completed = poll_job_completed(current_active_id)
                if completed:
                    logger.info(f"POLL Job {current_active_id} marked Completed on frontend — signalling EXIT")
                    with poll_lock:
                        poll_state["exit_signal"] = True

            # ── Check for new In Progress jobs ──
            jobs = poll_active_jobs()
            for job in jobs:
                jid = job["job_id"]
                if jid not in seen_job_ids and jid != current_active_id:
                    logger.info(f"POLL New In Progress job found: {jid} — vehicle: {job['vehicle_number']}")
                    seen_job_ids.add(jid)
                    with poll_lock:
                        # Only set trigger if no pipeline is currently active
                        if poll_state["trigger"] is None and current_active_id is None:
                            poll_state["trigger"] = job

        except Exception as e:
            logger.error(f"POLL Thread error: {e}")

# ─────────────────────────────────────────────
# DRAW PREVIEW OVERLAYS
# ─────────────────────────────────────────────

def draw_overlay(frame, roi_rel, state, plate, expected_plate,
                 ocr_running, stable_ctr, overlay_msgs, mismatch_warning=None):
    preview = frame.copy()
    fh, fw  = frame.shape[:2]

    roi_abs = get_roi_abs(roi_rel, fw, fh)
    if roi_abs:
        x, y, w, h = roi_abs
        cv2.rectangle(preview, (x, y), (x + w, y + h), (0, 255, 255), 2)
        cv2.putText(preview, "BAY ROI", (x, y - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 1)

    color = (0, 255, 0) if state == "IDLE" else (0, 0, 255)
    cv2.putText(preview, f"State: {state}", (10, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    if expected_plate:
        cv2.putText(preview, f"Expected: {expected_plate}", (10, 65),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

    if plate:
        plate_color = (0, 255, 0) if plate == expected_plate else (0, 80, 255)
        cv2.putText(preview, f"OCR Read: {plate}", (10, 95),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, plate_color, 2)

    if state == "OCCUPIED":
        stable_color = (0, 255, 0) if stable_ctr >= STABLE_FRAMES_NEEDED else (0, 165, 255)
        cv2.putText(preview, f"Stable: {min(stable_ctr, STABLE_FRAMES_NEEDED)}/{STABLE_FRAMES_NEEDED}",
                    (10, 125), cv2.FONT_HERSHEY_SIMPLEX, 0.55, stable_color, 1)

    if ocr_running:
        cv2.putText(preview, "OCR running...", (10, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)

    # Mismatch warning banner
    if mismatch_warning:
        cv2.rectangle(preview, (0, fh - 60), (fw, fh), (0, 0, 180), -1)
        cv2.putText(preview, f"MISMATCH WARNING: {mismatch_warning}",
                    (10, fh - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

    now    = time.time()
    active = [(msg, exp) for msg, exp in overlay_msgs if exp > now]
    overlay_msgs[:] = active
    for i, (msg, _) in enumerate(active[-4:]):
        c = (0, 220, 0) if "ENTRY" in msg else (0, 80, 255)
        cv2.putText(preview, msg, (frame.shape[1] - 450, 35 + i * 38),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.75, c, 2)

    return preview

# ─────────────────────────────────────────────
# MAIN LOOP
# ─────────────────────────────────────────────

def run(source):
    # ── ROI: setup if missing, load if exists ──
    if not os.path.exists(ROI_CONFIG):
        logger.info("ROI config not found — launching ROI setup...")
        saved = run_roi_setup(source, ROI_CONFIG)
        if not saved:
            logger.error("ROI setup cancelled — cannot start event logger without ROI.")
            return

    roi_rel = load_roi_config(ROI_CONFIG)

    logger.info(f"START Opening: {source}")
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        logger.error(f"Cannot open: {source}")
        return

    frame_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 30
    logger.info(f"Source: {frame_w}x{frame_h} @ {src_fps:.1f}fps")

    pre_buffer = deque(maxlen=int(src_fps * PRE_BUFFER_SECS))
    ocr_buffer = deque(maxlen=int(src_fps * OCR_BUFFER_SECS))

    IDLE     = "IDLE"
    OCCUPIED = "OCCUPIED"
    state    = IDLE

    # Active job tracking — shared with polling thread via list reference
    active_job_id_ref    = [None]   # active_job_id_ref[0] = current job_id or None
    active_vehicle_number = None    # vehicleNumber from Job — used for cross-verification
    entry_ocr_done = False

    current_plate     = None
    entry_time        = None
    actual_entry_time = None
    mismatch_warning  = None        # shown as overlay banner on preview

    stable_frame   = None
    stable_counter = 0
    prev_frame     = None

    post_recording      = False
    post_record_frames  = []
    post_record_target  = int(src_fps * POST_BUFFER_SECS)
    pending_clip_type   = None
    pending_clip_frames = []
    pending_clip_path   = None
    bay_writer          = None
    bay_clip_path       = None
    bay_temp_path       = None

    ocr_queue         = queue.Queue()
    ocr_result        = {"plate": None, "crop": None, "done": False}
    ocr_lock          = threading.Lock()
    ocr_running       = False
    pending_ocr_event = None

    worker_thread = threading.Thread(target=ocr_worker, args=(ocr_queue,), daemon=True)
    worker_thread.start()

    # ── Start polling thread ──
    poll_thread = threading.Thread(
        target=polling_thread,
        args=(active_job_id_ref,),
        daemon=True
    )
    poll_thread.start()
    logger.info(f"POLL Polling thread started — checking every {POLL_INTERVAL}s")

    overlay_msgs = []
    frame_num    = 0

    logger.info("LOOP Running... Press Q to quit")
    logger.info("LOOP Waiting for frontend 'Start Service' trigger...")

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        raw_h, raw_w = frame.shape[:2]
        scale = min(1280 / raw_w, 720 / raw_h, 1.0)
        if scale < 1.0:
            frame = cv2.resize(frame, (int(raw_w * scale), int(raw_h * scale)))

        frame_num += 1
        roi_frame, roi_x, roi_y = get_roi_frame(frame, roi_rel)

        pre_buffer.append(frame.copy())

        # ── Check for polling thread signals ──
        with poll_lock:
            trigger_job   = poll_state["trigger"]
            exit_signaled = poll_state["exit_signal"]

            if trigger_job is not None:
                poll_state["trigger"] = None   # consume trigger

            if exit_signaled:
                poll_state["exit_signal"] = False   # consume signal

        # ── Handle frontend START trigger → begin pipeline ──
        if trigger_job is not None and state == IDLE:
            entry_ocr_done = False
            job = trigger_job
            logger.info(f"TRIGGER Frontend Start Service received — job: {job['job_id']} "
                        f"vehicle: {job['vehicle_number']}")

            active_job_id_ref[0]  = job["job_id"]
            active_vehicle_number = job["vehicle_number"]
            actual_entry_time     = job["started_at"] or datetime.now()
            state                 = OCCUPIED
            stable_frame          = None
            stable_counter        = 0
            mismatch_warning      = None

            pending_clip_frames = list(pre_buffer)
            pending_clip_type   = "ENTRY"
            post_recording      = True
            post_record_frames  = []

            bay_ts        = datetime.now().strftime("%Y%m%d_%H%M%S")
            bay_temp_path = os.path.join(CLIPS_DIR, f"BAY_TEMP_{bay_ts}.mp4")
            bay_clip_path = os.path.join(CLIPS_DIR, f"BAY_{bay_ts}.mp4")
            fh, fw        = frame.shape[:2]
            bay_writer    = get_video_writer(bay_temp_path, fw, fh, int(src_fps))
            if bay_writer:
                logger.info(f"BAY CLIP Recording started: {bay_temp_path}")
                for pre_frame in list(pre_buffer):
                    bay_writer.write(pre_frame)
            else:
                logger.error("BAY CLIP Failed to open VideoWriter for full bay clip")

            overlay_msgs.append((f"STARTED: {active_vehicle_number}", time.time() + 5))
            logger.info("STABLE Waiting for car to stop before firing OCR...")

        # ── Handle frontend EXIT signal ──
        if exit_signaled and state == OCCUPIED:
            logger.info(f"TRIGGER Frontend job completion detected — triggering EXIT")

            if bay_writer is not None:
                bay_writer.release()
                bay_writer = None
                try:
                    os.rename(bay_temp_path, bay_clip_path)
                    logger.info(f"BAY CLIP Saved: {bay_clip_path}")
                except Exception as e:
                    logger.error(f"BAY CLIP Rename failed: {e}")
                    bay_clip_path = bay_temp_path

            pending_clip_frames = list(pre_buffer)
            pending_clip_type   = "EXIT"
            post_recording      = True
            post_record_frames  = []

            if not ocr_running:
                ocr_snapshot      = [stable_frame] * 10 if stable_frame is not None else list(ocr_buffer)
                pending_ocr_event = "EXIT"
                with ocr_lock:
                    ocr_result["plate"] = None
                    ocr_result["crop"]  = None
                    ocr_result["done"]  = False
                ocr_running = True
                ocr_queue.put((ocr_snapshot, ocr_result, ocr_lock))
                logger.info("OCR Background thread started for EXIT...")

            state = IDLE

        # ── Post-buffer recording ──
        if post_recording:
            post_record_frames.append(frame.copy())
            if len(post_record_frames) >= post_record_target:
                post_recording = False
                clip_frames    = list(pending_clip_frames) + post_record_frames
                clip_type      = pending_clip_type
                ts             = datetime.now().strftime("%Y%m%d_%H%M%S")
                clip_path      = os.path.join(CLIPS_DIR, f"{clip_type}_{ts}.mp4")
                pending_clip_path = clip_path
                if clip_frames:
                    ch, cw = clip_frames[0].shape[:2]
                else:
                    cw, ch = 1280, 720
                threading.Thread(
                    target=write_clip,
                    args=(clip_frames, clip_path, cw, ch, int(src_fps)),
                    daemon=True
                ).start()
                post_record_frames  = []
                pending_clip_frames = []

        # ── YOLO detection — only runs when OCCUPIED (for OCR crops) ──
        best_plate_crop = None

        if state == OCCUPIED and frame_num % DETECT_EVERY_N == 0:
            results   = model(roi_frame, conf=YOLO_CONFIDENCE, verbose=False)
            best_conf = 0
            for result in results:
                for box in result.boxes:
                    conf = float(box.conf[0])
                    if conf > best_conf:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        x1, y1 = max(0, x1), max(0, y1)
                        x2, y2 = min(roi_frame.shape[1], x2), min(roi_frame.shape[0], y2)
                        crop = roi_frame[y1:y2, x1:x2]
                        if crop.size > 0:
                            best_plate_crop = crop
                            best_conf       = conf
            if best_plate_crop is not None:
                ocr_buffer.append(best_plate_crop.copy())

        # ── Stable frame detection + OCR trigger ──
        if state == OCCUPIED:
            if bay_writer is not None:
                bay_writer.write(frame)

            if prev_frame is not None and not ocr_running and not entry_ocr_done:
                if is_roi_stable(prev_frame, frame, roi_rel):
                    stable_counter += 1
                    if stable_counter == STABLE_FRAMES_NEEDED:
                        roi_crop = get_roi_frame(frame, roi_rel)[0]
                        if roi_crop.size > 0:
                            stable_frame = roi_crop.copy()
                            logger.info(f"STABLE Car stationary — stable frame captured (frame {frame_num})")
                        ocr_snapshot      = [stable_frame] * 10 if stable_frame is not None else list(ocr_buffer)
                        pending_ocr_event = "ENTRY"
                        with ocr_lock:
                            ocr_result["plate"] = None
                            ocr_result["crop"]  = None
                            ocr_result["done"]  = False
                        ocr_running    = True
                        entry_ocr_done = True
                        ocr_queue.put((ocr_snapshot, ocr_result, ocr_lock))
                        logger.info("OCR Background thread started for ENTRY (stable frame)...")
                else:
                    stable_counter = 0

        # ── OCR result handler ──
        with ocr_lock:
            ocr_done = ocr_result.get("done", False)

        if ocr_done and ocr_running:
            ocr_running = False
            with ocr_lock:
                plate     = ocr_result.get("plate")
                crop      = ocr_result.get("crop")
                clip_path = pending_clip_path
                pending_clip_path = None
                event     = pending_ocr_event

            if not plate:
                logger.warning(f"OCR returned no plate for {event} event — skipping DB log")
                pending_ocr_event = None
            else:
                image_path = save_plate_crop(crop, plate, event)

                if event == "ENTRY":
                    current_plate = plate
                    entry_time    = actual_entry_time

                    # ── Cross-verify plate vs vehicleNumber from Job ──
                    if active_vehicle_number:
                        if plate == active_vehicle_number:
                            logger.info(f"OCR VERIFY Match — OCR: {plate} == Job: {active_vehicle_number}")
                            mismatch_warning = None
                            clear_ocr_warning(active_job_id_ref[0])
                        else:
                            logger.warning(f"OCR VERIFY Mismatch — OCR: {plate} | Job: {active_vehicle_number}")
                            mismatch_warning = f"OCR: {plate} | Expected: {active_vehicle_number}"
                            write_ocr_warning(active_job_id_ref[0], plate, active_vehicle_number)
                            overlay_msgs.append((f"MISMATCH! {plate} vs {active_vehicle_number}", time.time() + 8))

                    threading.Thread(
                        target=log_entry,
                        args=(plate, image_path, clip_path),
                        kwargs={"job_id": active_job_id_ref[0], "event_time": entry_time},
                        daemon=True
                    ).start()
                    overlay_msgs.append((f"ENTRY: {plate}", time.time() + 4))

                elif event == "EXIT":
                    threading.Thread(
                        target=log_exit,
                        args=(plate, image_path, clip_path, entry_time or datetime.now()),
                        kwargs={"full_clip_path": bay_clip_path, "job_id": active_job_id_ref[0]},
                        daemon=True
                    ).start()
                    overlay_msgs.append((f"EXIT: {plate}", time.time() + 4))

                    # Reset active job
                    bay_clip_path         = None
                    bay_temp_path         = None
                    current_plate         = None
                    entry_time            = None
                    active_job_id_ref[0]  = None
                    active_vehicle_number = None
                    mismatch_warning      = None

            pending_ocr_event = None

        prev_frame = frame.copy()

        preview = draw_overlay(
            frame, roi_rel, state, current_plate, active_vehicle_number,
            ocr_running, stable_counter, overlay_msgs, mismatch_warning
        )
        cv2.imshow("Bay Event Logger", preview)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            logger.info("QUIT Q pressed.")
            break

    ocr_queue.put(None)
    worker_thread.join(timeout=30)
    cap.release()
    cv2.destroyAllWindows()
    logger.info("DONE Event logger stopped.")

# ─────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bay Event Logger MVP")
    parser.add_argument("--source", default=VIDEO_SOURCE, help="Video file or RTSP URL")
    parser.add_argument("--reset-roi", action="store_true",
                        help="Force ROI re-setup even if config already exists")
    args = parser.parse_args()

    if args.reset_roi and os.path.exists(ROI_CONFIG):
        os.remove(ROI_CONFIG)
        logger.info("ROI config deleted — will re-run setup")

    run(args.source)

    