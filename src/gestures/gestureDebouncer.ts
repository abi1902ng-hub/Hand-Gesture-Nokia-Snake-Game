import type { GestureType } from "../utils/types";
import { GESTURE_DEBOUNCE_FRAMES } from "./gestureConfig";

/**
 * Requires a raw classification to repeat for N consecutive frames before
 * it's accepted as the "current" gesture. Prevents flicker (e.g. a single
 * misread frame between ONE_FINGER samples) from being treated as a real
 * gesture change.
 */
export class GestureDebouncer {
  private candidate: GestureType = "NONE";
  private candidateCount = 0;
  private accepted: GestureType = "NONE";

  update(raw: GestureType): GestureType {
    if (raw === this.candidate) {
      this.candidateCount += 1;
    } else {
      this.candidate = raw;
      this.candidateCount = 1;
    }

    if (this.candidateCount >= GESTURE_DEBOUNCE_FRAMES) {
      this.accepted = this.candidate;
    }

    return this.accepted;
  }

  reset() {
    this.candidate = "NONE";
    this.candidateCount = 0;
    this.accepted = "NONE";
  }
}
