import type { GestureType } from "../utils/types";

// MediaPipe HandLandmarker landmark indices (21-point hand model).
const WRIST = 0;
const THUMB_TIP = 4;
const THUMB_MCP = 2;
const INDEX_TIP = 8;
const INDEX_PIP = 6;
const MIDDLE_TIP = 12;
const MIDDLE_PIP = 10;
const RING_TIP = 16;
const RING_PIP = 14;
const PINKY_TIP = 20;
const PINKY_PIP = 18;

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

/**
 * A finger counts as "extended" if its tip is farther from the wrist than
 * its PIP joint is (simple, robust, and orientation-tolerant enough for
 * a front-facing webcam use case — no need for full 3D angle math here).
 */
function isExtended(landmarks: Landmark[], tipIdx: number, pipIdx: number): boolean {
  const wrist = landmarks[WRIST];
  const tip = landmarks[tipIdx];
  const pip = landmarks[pipIdx];

  const distTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
  const distPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);

  return distTip > distPip * 1.15;
}

function isThumbExtended(landmarks: Landmark[]): boolean {
  // Thumb doesn't fold the same way; compare tip distance from the palm
  // (index MCP as a palm-center-ish reference) against thumb MCP distance.
  // Loosened vs. the original version: the previous ratio (ipDist >
  // mcpDist * 0.9) was too strict and frequently misread a tucked thumb
  // as "extended" depending on hand rotation, which silently broke
  // OPEN_PALM / ONE_FINGER / PEACE classification below (since those all
  // required thumb === false). This version only checks that the tip is
  // clearly farther out than the base knuckle, which is more forgiving of
  // rotation while still telling a truly extended thumb from a tucked one.
  const indexMcp = landmarks[5];
  const tip = landmarks[THUMB_TIP];
  const mcp = landmarks[THUMB_MCP];

  const tipDist = Math.hypot(tip.x - indexMcp.x, tip.y - indexMcp.y);
  const mcpDist = Math.hypot(mcp.x - indexMcp.x, mcp.y - indexMcp.y);

  return tipDist > mcpDist * 1.3;
}

function getFingerState(landmarks: Landmark[]): FingerState {
  return {
    thumb: isThumbExtended(landmarks),
    index: isExtended(landmarks, INDEX_TIP, INDEX_PIP),
    middle: isExtended(landmarks, MIDDLE_TIP, MIDDLE_PIP),
    ring: isExtended(landmarks, RING_TIP, RING_PIP),
    pinky: isExtended(landmarks, PINKY_TIP, PINKY_PIP),
  };
}

/**
 * Classifies a single frame's hand landmarks into one of the app's static
 * gesture categories. Swipe direction for ONE_FINGER is NOT determined
 * here — that requires tracking fingertip position across frames, done by
 * `SwipeTracker` (see swipeTracker.ts). This function only answers "which
 * hand shape is this".
 *
 * NOTE on thumb tolerance: OPEN_PALM, ONE_FINGER, and PEACE below no
 * longer hard-require `!f.thumb`. Thumb extension is the least reliable
 * signal from a front-facing webcam (it reads differently depending on
 * hand rotation), so requiring it to be exactly false caused frequent
 * silent drops to "NONE" — which is what made OPEN_PALM feel like it
 * "sometimes doesn't work". Instead we classify primarily off the other
 * four fingers, which are much more reliable, and only use the thumb to
 * disambiguate the cases that actually need it (fist vs. not, thumbs
 * up/down vs. everything else).
 */
export function classifyGesture(landmarks: Landmark[]): GestureType {
  const f = getFingerState(landmarks);
  const otherFingersCount = [f.index, f.middle, f.ring, f.pinky].filter(Boolean).length;

  // Fist: nothing extended at all, including the thumb. Requiring the
  // thumb to ALSO be tucked (not just the four fingers) avoids classifying
  // a fast/blurred downward one-finger swipe as a fist — a swiping index
  // finger can momentarily look "curled" in 2D, but the thumb staying out
  // to the side is what distinguishes that from a genuine fist.
  if (otherFingersCount === 0 && !f.thumb) return "FIST";

  // Open palm: all four fingers extended (thumb optional/ignored — see
  // note above; a rotated hand can misread the thumb either way).
  if (f.index && f.middle && f.ring && f.pinky) return "OPEN_PALM";

  // One finger: only index extended among the four fingers.
  if (f.index && !f.middle && !f.ring && !f.pinky) return "ONE_FINGER";

  // Peace: index + middle extended, ring/pinky not.
  if (f.index && f.middle && !f.ring && !f.pinky) return "PEACE";

  // Thumbs up/down: thumb extended, no other fingers extended at all.
  // Distinguished by vertical orientation of the thumb tip vs. the wrist.
  if (f.thumb && otherFingersCount === 0) {
    const wrist = landmarks[WRIST];
    const tip = landmarks[THUMB_TIP];
    return tip.y < wrist.y ? "THUMBS_UP" : "THUMBS_DOWN";
  }

  return "NONE";
}
