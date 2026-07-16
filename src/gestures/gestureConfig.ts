// Tuning constants for the gesture recognition pipeline.

// How many frames a raw gesture must persist before it's accepted as
// "current" — prevents flicker between adjacent frames from MediaPipe.
export const GESTURE_DEBOUNCE_FRAMES = 4;

// Minimum normalized-coordinate distance (0-1 range, relative to video
// frame) the index fingertip must travel between samples to count as an
// intentional swipe rather than accidental jitter.
export const SWIPE_MIN_DISTANCE = 0.055;

// Swipe must be meaningfully more horizontal-than-vertical (or vice versa)
// to assign a clean direction rather than a diagonal ambiguous one.
export const SWIPE_AXIS_DOMINANCE_RATIO = 1.4;

// How often (ms) we re-evaluate a potential swipe once ONE_FINGER is held,
// resetting the tracked reference point after each accepted swipe.
export const SWIPE_SAMPLE_COOLDOWN_MS = 220;

// MediaPipe model asset locations (loaded from CDN — no local model file
// needed, matches the WASM+task-file pattern MediaPipe Tasks Vision uses).
export const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
export const HAND_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
