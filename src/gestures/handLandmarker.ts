import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { MEDIAPIPE_WASM_URL, HAND_LANDMARKER_MODEL_URL } from "./gestureConfig";
import type { Landmark } from "./gestureClassifier";

let landmarkerPromise: Promise<HandLandmarker> | null = null;

/**
 * Lazily creates (and caches) a single HandLandmarker instance for the
 * whole app session — loading the WASM runtime + model is expensive
 * (network + init), so we don't want to redo it on every component mount.
 */
function getLandmarker(): Promise<HandLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      return HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_LANDMARKER_MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
    })();
  }
  return landmarkerPromise;
}

export interface DetectionResult {
  landmarks: Landmark[] | null;
}

/**
 * Runs detection on a single video frame. Must be called with
 * monotonically increasing timestamps per MediaPipe's VIDEO mode
 * requirement (we use `performance.now()` from the caller's render loop).
 */
export async function detectHands(
  video: HTMLVideoElement,
  timestampMs: number
): Promise<DetectionResult> {
  const landmarker = await getLandmarker();
  const result = landmarker.detectForVideo(video, timestampMs);

  if (result.landmarks && result.landmarks.length > 0) {
    return { landmarks: result.landmarks[0] as Landmark[] };
  }
  return { landmarks: null };
}

export { getLandmarker };
