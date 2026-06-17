# ============================================================
# SETUP ROI — Interactive Region of Interest Selector
# ============================================================
# Run this ONCE before running the main event logger.
# It shows the video/camera feed and lets you draw a box
# around the service bay area with your mouse.
# The coordinates are saved to roi_config.json.
#
# HOW TO RUN:
#   python setup_roi.py
#
# CONTROLS:
#   - Click and drag to draw the ROI box
#   - Press S to save and exit
#   - Press R to reset and redraw
#   - Press Q to quit without saving
# ============================================================

import cv2
import json
import os
from pathlib import Path

# ──────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────

BASE_DIR = Path(__file__).parent

# Change this to your video file path for now
# Later replace with RTSP URL e.g. "rtsp://192.168.1.64/stream"
VIDEO_SOURCE = str(BASE_DIR / "new_sample.mp4")

# Where the ROI coordinates will be saved
# The event logger will read from this file
CONFIG_FILE  = str(BASE_DIR / "roi_config.json")

# ──────────────────────────────────────────────
# GLOBAL VARIABLES for mouse drawing
# ──────────────────────────────────────────────

drawing     = False   # True while mouse button is held down
roi_start   = (-1, -1)
roi_end     = (-1, -1)
roi_final   = None    # stores the confirmed ROI box
base_frame  = None    # the frame we draw on top of

# ──────────────────────────────────────────────
# MOUSE CALLBACK — handles click and drag
# ──────────────────────────────────────────────

def mouse_callback(event, x, y, flags, param):
    global drawing, roi_start, roi_end, roi_final

    if event == cv2.EVENT_LBUTTONDOWN:
        # Mouse button pressed — start drawing
        drawing   = True
        roi_start = (x, y)
        roi_end   = (x, y)

    elif event == cv2.EVENT_MOUSEMOVE:
        # Mouse moving while held down — update box
        if drawing:
            roi_end = (x, y)

    elif event == cv2.EVENT_LBUTTONUP:
        # Mouse button released — finish drawing
        drawing   = False
        roi_end   = (x, y)
        roi_final = (roi_start, roi_end)
        print(f"[INFO] ROI drawn: top-left {roi_start} → bottom-right {roi_end}")

# ──────────────────────────────────────────────
# OPEN VIDEO SOURCE
# ──────────────────────────────────────────────

print("=" * 60)
print("  SETUP ROI — Service Bay Region Selector")
print("=" * 60)
print(f"Source : {VIDEO_SOURCE}\n")
print("INSTRUCTIONS:")
print("  1. A window will open showing the video frame")
print("  2. Click and drag to draw a box around the service bay")
print("  3. Press S to save the ROI and exit")
print("  4. Press R to reset and redraw if not happy")
print("  5. Press Q to quit without saving\n")

cap = cv2.VideoCapture(VIDEO_SOURCE)

if not cap.isOpened():
    print("[ERROR] Could not open video source.")
    print("[ERROR] Check VIDEO_SOURCE path is correct.")
    exit()

# Read first frame to use as background for drawing
ret, base_frame = cap.read()
if not ret:
    print("[ERROR] Could not read frame from video.")
    exit()

# Resize frame if too large for screen
h, w = base_frame.shape[:2]
max_w, max_h = 1280, 720
scale = min(max_w / w, max_h / h, 1.0)
if scale < 1.0:
    base_frame = cv2.resize(base_frame, (int(w * scale), int(h * scale)))
    h, w       = base_frame.shape[:2]
print(f"[INFO] Frame size: {w}x{h}")
print(f"[INFO] Draw your ROI box on the window that opens.\n")

cap.release()

# ──────────────────────────────────────────────
# INTERACTIVE WINDOW
# ──────────────────────────────────────────────

window_name = "ROI Selector — Draw box around service bay"
cv2.namedWindow(window_name)
cv2.setMouseCallback(window_name, mouse_callback)

while True:
    # Start with a fresh copy of the base frame each loop
    display = base_frame.copy()

    # Draw instruction text on frame
    cv2.putText(display, "Click and drag to draw ROI box",
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
    cv2.putText(display, "S = Save  |  R = Reset  |  Q = Quit",
                (10, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

    # Draw the ROI box while dragging or after release
    if roi_start != (-1, -1) and roi_end != (-1, -1):
        # Draw semi-transparent fill inside the box
        overlay = display.copy()
        cv2.rectangle(overlay, roi_start, roi_end, (0, 255, 0), -1)
        cv2.addWeighted(overlay, 0.2, display, 0.8, 0, display)

        # Draw the border
        cv2.rectangle(display, roi_start, roi_end, (0, 255, 0), 2)

        # Show coordinates on screen
        x1 = min(roi_start[0], roi_end[0])
        y1 = min(roi_start[1], roi_end[1])
        x2 = max(roi_start[0], roi_end[0])
        y2 = max(roi_start[1], roi_end[1])
        w_roi = x2 - x1
        h_roi = y2 - y1

        cv2.putText(display, f"ROI: ({x1},{y1}) to ({x2},{y2})  Size: {w_roi}x{h_roi}",
                    (10, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow(window_name, display)

    key = cv2.waitKey(1) & 0xFF

    # ── S = Save ──
    if key == ord('s') or key == ord('S'):
        if roi_final is None:
            print("[WARNING] No ROI drawn yet. Draw a box first then press S.")
        else:
            # Normalise coordinates (handle case where user drew right-to-left)
            x1 = min(roi_final[0][0], roi_final[1][0])
            y1 = min(roi_final[0][1], roi_final[1][1])
            x2 = max(roi_final[0][0], roi_final[1][0])
            y2 = max(roi_final[0][1], roi_final[1][1])

            if (x2 - x1) < 50 or (y2 - y1) < 50:
                print("[WARNING] ROI is too small. Draw a larger box.")
            else:
                # Save to JSON config file
                config = {
                    "roi": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    },
                    "frame_width":  w,
                    "frame_height": h,
                    "video_source": VIDEO_SOURCE,
                    "notes": "ROI coordinates for service bay. Edit video_source to switch to RTSP URL."
                }

                with open(CONFIG_FILE, 'w') as f:
                    json.dump(config, f, indent=4)

                print(f"\n[SUCCESS] ROI saved to: {CONFIG_FILE}")
                print(f"[SUCCESS] Coordinates: x1={x1}, y1={y1}, x2={x2}, y2={y2}")
                print(f"[SUCCESS] ROI size: {x2-x1}x{y2-y1} pixels")
                print(f"\nYou can now run the event logger.")
                break

    # ── R = Reset ──
    elif key == ord('r') or key == ord('R'):
        roi_start = (-1, -1)
        roi_end   = (-1, -1)
        roi_final = None
        print("[INFO] ROI reset. Draw a new box.")

    # ── Q = Quit ──
    elif key == ord('q') or key == ord('Q'):
        print("[INFO] Quit without saving.")
        break

cv2.destroyAllWindows()

# ──────────────────────────────────────────────
# PREVIEW SAVED ROI
# ──────────────────────────────────────────────

if os.path.exists(CONFIG_FILE):
    print("\n" + "=" * 60)
    print("  SAVED ROI CONFIG")
    print("=" * 60)
    with open(CONFIG_FILE, 'r') as f:
        saved = json.load(f)
    print(json.dumps(saved, indent=4))
    print("=" * 60)
    print("\nTo change the ROI later, just run this script again.")
    print("To switch to RTSP camera, edit video_source in roi_config.json")
    print("or update VIDEO_SOURCE at the top of this script.")