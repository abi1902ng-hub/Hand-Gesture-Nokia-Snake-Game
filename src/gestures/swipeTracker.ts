import type { Direction } from "../utils/types";
import type { Landmark } from "./gestureClassifier";
import {
  SWIPE_MIN_DISTANCE,
  SWIPE_AXIS_DOMINANCE_RATIO,
  SWIPE_SAMPLE_COOLDOWN_MS,
} from "./gestureConfig";

const INDEX_TIP = 8;

/**
 * Tracks the index fingertip's position across frames while ONE_FINGER is
 * held, and emits a swipe direction once movement clearly exceeds the
 * accidental-jitter threshold along a dominant axis. After emitting, the
 * reference point resets so the next swipe needs fresh deliberate movement
 * (this is what makes "the snake keeps moving until another swipe" work —
 * we're not continuously steering, just detecting discrete swipe events).
 */
export class SwipeTracker {
  private referencePoint: { x: number; y: number } | null = null;
  private lastSampleTime = 0;

  /**
   * Call every frame while the current gesture is ONE_FINGER. Returns a
   * Direction if a swipe was just detected, otherwise null.
   */
  update(landmarks: Landmark[], now: number): Direction | null {
    const tip = landmarks[INDEX_TIP];

    if (!this.referencePoint) {
      this.referencePoint = { x: tip.x, y: tip.y };
      this.lastSampleTime = now;
      return null;
    }

    if (now - this.lastSampleTime < SWIPE_SAMPLE_COOLDOWN_MS) {
      return null;
    }

    const dx = tip.x - this.referencePoint.x;
    const dy = tip.y - this.referencePoint.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const distance = Math.hypot(dx, dy);

    if (distance < SWIPE_MIN_DISTANCE) {
      // Too small — likely accidental jitter, not an intentional swipe.
      return null;
    }

    let direction: Direction | null = null;

    if (absDx > absDy * SWIPE_AXIS_DOMINANCE_RATIO) {
      // Note: video is mirrored for display (scale-x-[-1]), so we invert
      // the raw x-delta to match what the user visually perceives as
      // left/right on screen.
      direction = dx > 0 ? "LEFT" : "RIGHT";
    } else if (absDy > absDx * SWIPE_AXIS_DOMINANCE_RATIO) {
      direction = dy > 0 ? "DOWN" : "UP";
    }

    if (direction) {
      // Reset reference so the next swipe requires fresh movement.
      this.referencePoint = { x: tip.x, y: tip.y };
      this.lastSampleTime = now;
    }

    return direction;
  }

  reset() {
    this.referencePoint = null;
    this.lastSampleTime = 0;
  }
}
