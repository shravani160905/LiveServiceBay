"""
event_logger.py  —  MVP v4
--------------------------
Bay Event Logger — single bay, single camera

Architecture:
- YOLO runs every N frames on ROI → presence trigger AND plate detector
- Rolling pre-buffer (full frames) → used for clip writing
- Rolling OCR buffer (ROI crops)  → used for plate reading
- EDSR 4x upscale → CLAHE → Otsu → EasyOCR with allowlist
- Positional correction + state code validation for Indian plates
- Stable frame capture — waits for car to stop before OCR
- OCR runs in background thread (preview never freezes)
- Entry clip: 3 sec before entry confirmed + 2 sec after
- Exit clip:  3 sec before exit confirmed + 2 sec after
- MP4 / H264 format — plays on any device
- Full frame saved in clips (ROI drawn as overlay)
- ENTRY + EXIT logged to MySQL bay_events with clip_path and plate_image_path

Usage:
    python event_logger.py
    python event_logger.py --source rtsp://192.168.1.64/stream
"""

import cv2
import easyocr
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
# CONFIGURATION — edit before running
# ─────────────────────────────────────────────

VIDEO_SOURCE = str(BASE_DIR / "new_sample.mp4")
MODEL_PATH   = str(BASE_DIR / "plate_model.pt")
ROI_CONFIG   = str(BASE_DIR / "roi_config.json")
CROPS_DIR    = str(BASE_DIR / "event_crops")
CLIPS_DIR    = str(BASE_DIR / "event_clips")

# EDSR super resolution model path
# Download EDSR_x4.pb (~38MB):
#   https://github.com/Saafke/EDSR_TensorFlow/raw/master/models/EDSR_x4.pb
EDSR_MODEL = str(BASE_DIR / "EDSR_x4.pb")

from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("DATABASE_URL")

db_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=5,
    dsn=SUPABASE_URL
)

# Detection
YOLO_CONFIDENCE      = 0.4
DETECT_EVERY_N       = 5
CONFIRM_FRAMES       = 4
ABSENT_FRAMES        = 6

# Stable frame detection
STABLE_FRAMES_NEEDED = 10    # consecutive stable frames before OCR fires
STABLE_THRESHOLD     = 300   # max changed pixels to consider frame stable

# Buffers
FPS              = 30   # fallback only — used if src_fps can't be read
PRE_BUFFER_SECS  = 3
POST_BUFFER_SECS = 2
OCR_BUFFER_SECS  = 2    # replaces OCR_BUFFER_SIZE — computed at runtime

# Plate validation
INDIAN_PLATE_REGEX = r'^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{3,4}$'

# ─────────────────────────────────────────────
# SETUP
# ─────────────────────────────────────────────

os.makedirs(CROPS_DIR, exist_ok=True)
os.makedirs(CLIPS_DIR, exist_ok=True)

logger.info("Loading YOLO model...")
model = YOLO(MODEL_PATH)

logger.info("Loading EasyOCR...")
reader      = easyocr.Reader(['en'], gpu=False)  # gpu=True in university lab
reader_lock = threading.Lock()

# Load EDSR
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

# Load ROI config
roi_rel = None
if ROI_CONFIG and os.path.exists(ROI_CONFIG):
    import json
    with open(ROI_CONFIG) as f:
        roi_data = json.load(f)
    r       = roi_data["roi"]
    saved_w = roi_data.get("frame_width",  1280)
    saved_h = roi_data.get("frame_height", 720)
    roi_rel = {
        "x1": r["x1"] / saved_w,
        "y1": r["y1"] / saved_h,
        "x2": r["x2"] / saved_w,
        "y2": r["y2"] / saved_h,
    }
    logger.info(f"ROI loaded (relative): "
        f"x1={roi_rel['x1']:.3f}, y1={roi_rel['y1']:.3f}, "
        f"x2={roi_rel['x2']:.3f}, y2={roi_rel['y2']:.3f}")
else:
    logger.info("No ROI config — using full frame")

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────

def get_db():
    return db_pool.getconn()

def release_db(conn):
    db_pool.putconn(conn)
def get_job_by_plate(plate_number):
    """Look up a Job in Phase 1 DB by vehicle number. Returns job dict or None."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT id, "customerName", "phoneNumber", "customerEmail", "bayId", status
               FROM "Job"
               WHERE "vehicleNumber" = %s
               AND status NOT IN ('Completed', 'Cancelled')
               ORDER BY "createdAt" DESC
               LIMIT 1""",
            (plate_number,)
        )
        row = cursor.fetchone()
        cursor.close()
        if row:
            return {
                "job_id":         row[0],
                "customer_name":  row[1],
                "phone_number":   row[2],
                "customer_email": row[3],
                "bay_id":         row[4],
                "status":         row[5],
            }
        return None
    except Exception as e:
        logger.error(f"Job lookup failed for plate {plate_number}: {e}")
        return None
    finally:
        if conn:
            release_db(conn)

def update_job_status(job_id, status, completed_at=None):
    """Update Job status in Phase 1 DB."""
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
            (event_id, job_id, plate_number, plate_image, event_type, event_time, clip_path)
            VALUES (%s, %s, %s, %s, 'ENTRY', %s, %s)""",
            (event_id, job_id, plate_number, plate_image_path, event_dt, clip_path)
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
    event_id = str(uuid.uuid4())
    try:
        event_dt      = event_time or datetime.now()
        delta         = event_dt - entry_time
        duration_mins = round(delta.total_seconds() / 60, 1)
        conn          = get_db()
        cursor        = conn.cursor()
        cursor.execute(
            """INSERT INTO bay_events
            (event_id, job_id, plate_number, plate_image, event_type, event_time, duration_mins, clip_path, full_clip_path)
            VALUES (%s, %s, %s, %s, 'EXIT', %s, %s, %s, %s)""",
            (event_id, job_id, plate_number, plate_image_path, event_dt, duration_mins, clip_path, full_clip_path)
        )
        conn.commit()
        cursor.close()
        release_db(conn)
        logger.info(f"DB EXIT logged -> {plate_number}  duration: {duration_mins} mins  event_id: {event_id}")
        return event_id
    except Exception as e:
        logger.error(f"DB EXIT log failed: {e}")
        if not _retry:
            queue_failed_event("EXIT", plate_number, plate_image_path, clip_path, event_time or datetime.now(), entry_time, full_clip_path, job_id=job_id)
        if _retry:
            raise
    return None

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
# ROI HELPER
# ─────────────────────────────────────────────

def get_roi_abs(frame_w, frame_h):
    if roi_rel is None:
        return None
    x1 = int(roi_rel["x1"] * frame_w)
    y1 = int(roi_rel["y1"] * frame_h)
    x2 = int(roi_rel["x2"] * frame_w)
    y2 = int(roi_rel["y2"] * frame_h)
    return (x1, y1, x2 - x1, y2 - y1)

def get_roi_frame(frame):
    h, w = frame.shape[:2]
    roi  = get_roi_abs(w, h)
    if roi is None:
        return frame, 0, 0
    x, y, rw, rh = roi
    return frame[y:y+rh, x:x+rw], x, y

# ─────────────────────────────────────────────
# STABLE FRAME DETECTION
# ─────────────────────────────────────────────

def is_roi_stable(frame1, frame2):
    """
    Compare ROI regions of two consecutive frames.
    Returns True if pixel difference is below threshold — car has stopped.
    """
    roi1 = get_roi_frame(frame1)[0]
    roi2 = get_roi_frame(frame2)[0]
    if roi1.shape != roi2.shape:
        return False
    diff = cv2.absdiff(roi1, roi2)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    changed = np.sum(gray > 25)
    return int(changed) < STABLE_THRESHOLD

# ─────────────────────────────────────────────
# MAJORITY VOTE OCR
# ─────────────────────────────────────────────

def majority_vote_ocr(ocr_buffer_snapshot, result_dict, result_lock):
    try:
        reads = []
        crops = {}
        upscale_cache = {}   # cache EDSR result by object id — avoids redundant upscaling

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
            result_dict["done"]   = True
    except Exception as e:
        logger.error(f"OCR Thread crashed: {e}")
    finally:
        with result_lock:
            if not result_dict.get("done"):
                result_dict["plate"] = None
                result_dict["crop"]  = None
                result_dict["done"]   = True

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
    ts       = datetime.now().strftime("%Y%m%d_%H%M%S")
    path     = os.path.join(CROPS_DIR, f"{plate_number}_{event_type}_{ts}.jpg")
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

RETRY_DB = str(BASE_DIR / "retry_queue.db")
RETRY_MAX = 5
RETRY_INTERVAL = 30  # seconds

def init_retry_queue():
    conn = sqlite3.connect(RETRY_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS failed_events (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type  TEXT,
            plate       TEXT,
            image_path  TEXT,
            clip_path   TEXT,
            full_clip_path TEXT,
            event_time  TEXT,
            entry_time  TEXT,
            retries     INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def queue_failed_event(event_type, plate, image_path, clip_path, event_time, entry_time=None, full_clip_path=None):
    try:
        conn = sqlite3.connect(RETRY_DB)
        conn.execute("""
            INSERT INTO failed_events (event_type, plate, image_path, clip_path, full_clip_path, event_time, entry_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            event_type,
            plate,
            image_path,
            clip_path,
            full_clip_path,
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
                "SELECT id, event_type, plate, image_path, clip_path, full_clip_path, event_time, entry_time, retries "
                "FROM failed_events WHERE retries < ? ORDER BY id ASC",
                (RETRY_MAX,)
            ).fetchall()

            for row_id, event_type, plate, image_path, clip_path, full_clip_path, event_time, entry_time, retries in rows:
                event_dt = _parse_retry_time(event_time) or datetime.now()
                entry_dt = _parse_retry_time(entry_time)

                try:
                    if event_type == "ENTRY":
                        log_entry(plate, image_path, clip_path, event_time=event_dt, _retry=True)
                    elif event_type == "EXIT":
                        log_exit(
                            plate,
                            image_path,
                            clip_path,
                            entry_dt or event_dt,
                            full_clip_path=full_clip_path,
                            event_time=event_dt,
                            _retry=True,
                        )
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
                        conn.execute(
                            "UPDATE failed_events SET retries = ? WHERE id = ?",
                            (new_retries, row_id)
                        )
                        logger.warning(
                            f"RETRY QUEUE Replay failed ({new_retries}/{RETRY_MAX}): "
                            f"{event_type} {plate} ({e})"
                        )
                    conn.commit()
        except Exception as e:
            logger.error(f"RETRY QUEUE worker error: {e}")
        finally:
            if conn is not None:
                conn.close()

init_retry_queue()
threading.Thread(target=retry_worker, daemon=True).start()

# ─────────────────────────────────────────────
# DRAW PREVIEW OVERLAYS
# ─────────────────────────────────────────────

def draw_overlay(frame, state, plate, presence_ctr, absent_ctr, ocr_running, stable_ctr, overlay_msgs):
    preview = frame.copy()
    fh, fw  = frame.shape[:2]

    # ROI box
    roi_abs = get_roi_abs(fw, fh)
    if roi_abs:
        x, y, w, h = roi_abs
        cv2.rectangle(preview, (x, y), (x + w, y + h), (0, 255, 255), 2)
        cv2.putText(preview, "BAY ROI", (x, y - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 1)

    # State
    color = (0, 255, 0) if state == "IDLE" else (0, 0, 255)
    cv2.putText(preview, f"State: {state}", (10, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    # Counters
    cv2.putText(preview, f"Present: {presence_ctr}/{CONFIRM_FRAMES}  Absent: {absent_ctr}/{ABSENT_FRAMES}",
                (10, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 200), 1)

    # Current plate
    if plate:
        cv2.putText(preview, f"Plate: {plate}", (10, 95),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 128, 0), 2)

    # Stable frame indicator
    if state == "OCCUPIED":
        stable_color = (0, 255, 0) if stable_ctr >= STABLE_FRAMES_NEEDED else (0, 165, 255)
        cv2.putText(preview, f"Stable: {min(stable_ctr, STABLE_FRAMES_NEEDED)}/{STABLE_FRAMES_NEEDED}",
                    (10, 125), cv2.FONT_HERSHEY_SIMPLEX, 0.55, stable_color, 1)

    # OCR running indicator
    if ocr_running:
        cv2.putText(preview, "OCR running...", (10, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)

    # Timed event messages (top right)
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

    presence_counter = 0
    absent_counter   = 0
    current_plate    = None
    entry_time        = None
    actual_entry_time = None
    current_job_id = None

    # Stable frame tracking
    stable_frame   = None   # best ROI crop from a stable frame
    stable_counter = 0      # consecutive stable frames seen
    prev_frame     = None   # previous frame for stability comparison

    post_recording      = False
    post_record_frames  = []
    post_record_target  = int(src_fps * POST_BUFFER_SECS)
    pending_clip_type   = None
    pending_clip_frames = []
    pending_clip_path   = None
    bay_writer          = None      # VideoWriter for full bay clip
    bay_clip_path       = None      # final path of full bay clip
    bay_temp_path       = None      # temp path while recording

    ocr_queue         = queue.Queue()
    ocr_result        = {"plate": None, "crop": None, "done": False}
    ocr_lock          = threading.Lock()
    ocr_running       = False
    pending_ocr_event = None
    pending_exit      = False

    worker_thread = threading.Thread(target=ocr_worker, args=(ocr_queue,), daemon=True)
    worker_thread.start()

    overlay_msgs = []
    frame_num    = 0

    logger.info("LOOP Running... Press Q to quit")

    while True:
        ret, frame = cap.read()
        if not ret:
            logger.info("END Stream ended.")
            break

        # Resize preserving aspect ratio
        raw_h, raw_w = frame.shape[:2]
        scale = min(1280 / raw_w, 720 / raw_h, 1.0)
        if scale < 1.0:
            frame = cv2.resize(frame, (int(raw_w * scale), int(raw_h * scale)))

        frame_num += 1
        roi_frame, roi_x, roi_y = get_roi_frame(frame)

        # Step 1: pre-buffer
        pre_buffer.append(frame.copy())

        # Step 2: post-buffer recording
        if post_recording:
            post_record_frames.append(frame.copy())
            if len(post_record_frames) >= post_record_target:
                post_recording = False
                clip_frames = list(pending_clip_frames) + post_record_frames
                clip_type   = pending_clip_type
                ts          = datetime.now().strftime("%Y%m%d_%H%M%S")
                clip_path   = os.path.join(CLIPS_DIR, f"{clip_type}_{ts}.mp4")
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

        # Step 3: YOLO detection every N frames
        plate_detected  = False
        best_plate_crop = None

        if frame_num % DETECT_EVERY_N == 0:
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
                            plate_detected  = True
            if best_plate_crop is not None:
                ocr_buffer.append(best_plate_crop.copy())

        # Step 4: State machine — only update counters on YOLO frames
        yolo_ran = (frame_num % DETECT_EVERY_N == 0)

        if state == IDLE:
            if yolo_ran:
                if plate_detected:
                    presence_counter += 1
                    absent_counter    = 0
                else:
                    presence_counter  = max(0, presence_counter - 1)

            if presence_counter >= CONFIRM_FRAMES:
                logger.info(f"STATE IDLE -> OCCUPIED (frame {frame_num})")
                state            = OCCUPIED
                actual_entry_time = datetime.now()
                presence_counter = 0
                absent_counter   = 0
                stable_frame     = None
                stable_counter   = 0
                pending_clip_frames = list(pre_buffer)
                pending_clip_type   = "ENTRY"
                post_recording      = True
                post_record_frames  = []
                # Start full bay clip recording
                bay_ts        = datetime.now().strftime("%Y%m%d_%H%M%S")
                bay_temp_path = os.path.join(CLIPS_DIR, f"BAY_TEMP_{bay_ts}.mp4")
                bay_clip_path = os.path.join(CLIPS_DIR, f"BAY_{bay_ts}.mp4")
                fh, fw        = frame.shape[:2]
                bay_writer    = get_video_writer(bay_temp_path, fw, fh, int(src_fps))
                bay_writer    = get_video_writer(bay_temp_path, fw, fh, int(src_fps))
                if bay_writer:
                    logger.info(f"BAY CLIP Recording started: {bay_temp_path}")
                    # Write pre-buffer frames so bay clip starts from approach, not just confirmed entry
                    for pre_frame in list(pre_buffer):
                        bay_writer.write(pre_frame)
                    logger.info(f"BAY CLIP Pre-buffer written ({len(pre_buffer)} frames)")
                else:
                    logger.error("BAY CLIP Failed to open VideoWriter for full bay clip")
                # Don't fire OCR immediately — wait for stable frame
                logger.info("STABLE Waiting for car to stop before firing OCR...")

        elif state == OCCUPIED:
            # Write frame to full bay clip
            if bay_writer is not None:
                bay_writer.write(frame)

            if yolo_ran:
                if not plate_detected:
                    absent_counter   += 1
                    presence_counter  = max(0, presence_counter - 1)
                else:
                    absent_counter    = max(0, absent_counter - 1)
                    presence_counter += 1

            # Track frame stability — wait for car to stop
            if prev_frame is not None and not ocr_running:
                if is_roi_stable(prev_frame, frame):
                    stable_counter += 1
                    if stable_counter == STABLE_FRAMES_NEEDED:
                        # Car has stopped — grab best crop and fire OCR
                        roi_crop = get_roi_frame(frame)[0]
                        if roi_crop.size > 0:
                            stable_frame = roi_crop.copy()
                            logger.info(f"STABLE Car stationary — stable frame captured (frame {frame_num})")
                        # Fire entry OCR now with stable frame
                        ocr_snapshot      = [stable_frame] * 10 if stable_frame is not None else list(ocr_buffer)
                        pending_ocr_event = "ENTRY"
                        with ocr_lock:
                            ocr_result["plate"]    = None
                            ocr_result["crop"]     = None
                            ocr_result["done"]     = False
                            ocr_result["clip_path"] = None
                            
                        ocr_running = True
                        ocr_queue.put((ocr_snapshot, ocr_result, ocr_lock))
                        logger.info("OCR Background thread started for ENTRY (stable frame)...")
                else:
                    stable_counter = 0

            if absent_counter >= ABSENT_FRAMES:
                logger.info(f"STATE OCCUPIED -> IDLE (frame {frame_num})")
                # Finalize full bay clip
                if bay_writer is not None:
                    bay_writer.release()
                    bay_writer = None
                    try:
                        os.rename(bay_temp_path, bay_clip_path)
                        logger.info(f"BAY CLIP Saved: {bay_clip_path}")
                    except Exception as e:
                        logger.error(f"BAY CLIP Rename failed: {e}")
                        bay_clip_path = bay_temp_path  # fallback — keep temp path
                state            = IDLE
                absent_counter   = 0
                presence_counter = 0
                stable_frame     = None
                stable_counter   = 0
                pending_clip_frames = list(pre_buffer)
                pending_clip_type   = "EXIT"
                post_recording      = True
                post_record_frames  = []

                if not ocr_running:
                    # Use last stable frame for exit OCR if available
                    ocr_snapshot      = [stable_frame] * 10 if stable_frame is not None else list(ocr_buffer)
                    pending_ocr_event = "EXIT"
                    with ocr_lock:
                        ocr_result["plate"]    = None
                        ocr_result["crop"]     = None
                        ocr_result["done"]     = False
                        ocr_result["clip_path"] = None
                    ocr_running = True
                    ocr_queue.put((ocr_snapshot, ocr_result, ocr_lock))
                    logger.info("OCR Background thread started for EXIT...")
                else:
                    # ENTRY OCR still running — flag the exit, handle it when OCR completes
                    pending_exit = True
                    logger.info("STATE Exit detected while OCR running — will process after OCR completes")

        # Step 5: Check OCR thread result
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
                    threading.Thread(
                        target=log_entry,
                        args=(plate, image_path, clip_path),
                        daemon=True
                    ).start()
                    overlay_msgs.append((f"ENTRY: {plate}", time.time() + 4))

                    # If exit already happened while OCR was running, fire it now
                    if pending_exit:
                        pending_exit = False
                        threading.Thread(
                            target=log_exit,
                            args=(plate, None, None, entry_time or datetime.now()),
                            kwargs={"full_clip_path": bay_clip_path},
                            daemon=True
                        ).start()
                        bay_clip_path = None
                        bay_temp_path = None
                        overlay_msgs.append((f"EXIT: {plate}", time.time() + 4))
                        current_plate = None
                        entry_time    = None

                elif event == "EXIT":
                    threading.Thread(
                        target=log_exit,
                        args=(plate, image_path, clip_path, entry_time or datetime.now()),
                        kwargs={"full_clip_path": bay_clip_path},
                        daemon=True
                    ).start()
                    bay_clip_path = None
                    bay_temp_path = None
                    overlay_msgs.append((f"EXIT: {plate}", time.time() + 4))
                    current_plate = None
                    entry_time    = None

            pending_ocr_event = None

        # Step 6: Update prev_frame for stability detection
        prev_frame = frame.copy()

        # Step 7: Draw preview
        preview = draw_overlay(
            frame, state, current_plate,
            presence_counter, absent_counter,
            ocr_running, stable_counter, overlay_msgs
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
    args = parser.parse_args()
    run(args.source)