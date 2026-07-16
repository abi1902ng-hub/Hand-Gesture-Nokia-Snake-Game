import { useEffect, useRef, useState } from "react";
import { detectHands } from "../gestures/handLandmarker";
import { classifyGesture } from "../gestures/gestureClassifier";
import { GestureDebouncer } from "../gestures/gestureDebouncer";
import { SwipeTracker } from "../gestures/swipeTracker";
import type { Direction, GestureType, SpeedMode } from "../utils/types";

interface UseGestureRecognitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoReady: boolean;
  /** Called whenever a swipe is detected while ONE_FINGER is held. */
  onSwipe: (dir: Direction) => void;
  /** Called once per rising edge of OPEN_PALM (i.e. palm just shown). */
  onOpenPalmToggle: () => void;
  onSpeedChange: (mode: SpeedMode) => void;
  /** Called once per rising edge of PEACE — restart after game over. */
  onRestart: () => void;
  /** Called once per rising edge of FIST — exit the game. */
  onExit: () => void;
  /** Gesture-driven gameplay actions (swipe/palm/thumbs/fist) are ignored
   *  unless this is true. */
  enabled: boolean;
  /** PEACE -> restart is gated separately since it must work specifically
   *  while game-over is showing, a state where `enabled` is false. */
  restartEnabled: boolean;
}

/**
 * Runs the full gesture pipeline off the webcam video element: detect hand
 * landmarks -> classify static gesture -> debounce -> dispatch actions.
 * Exposes the currently recognized (debounced) gesture for display in the
 * InfoBar. All game-affecting callbacks fire only on the "rising edge" of a
 * gesture (i.e. once when it's newly recognized, not every frame it's
 * held) except swipes, which are naturally discrete events already.
 */
export function useGestureRecognition({
  videoRef,
  videoReady,
  onSwipe,
  onOpenPalmToggle,
  onSpeedChange,
  onRestart,
  onExit,
  enabled,
  restartEnabled,
}: UseGestureRecognitionOptions) {
  const [currentGesture, setCurrentGesture] = useState<GestureType>("NONE");

  const debouncerRef = useRef(new GestureDebouncer());
  const swipeTrackerRef = useRef(new SwipeTracker());
  const previousAcceptedRef = useRef<GestureType>("NONE");
  const rafRef = useRef<number | null>(null);

  // The detection loop below is long-lived (only restarts when the video
  // becomes ready) so it doesn't reset debounce/swipe state on every
  // enabled/restartEnabled flip. It reads the latest flags/callbacks via
  // refs rather than closing over the values from when the effect ran.
  const enabledRef = useRef(enabled);
  const restartEnabledRef = useRef(restartEnabled);
  const callbacksRef = useRef({ onSwipe, onOpenPalmToggle, onSpeedChange, onRestart, onExit });

  useEffect(() => {
    enabledRef.current = enabled;
    restartEnabledRef.current = restartEnabled;
    callbacksRef.current = { onSwipe, onOpenPalmToggle, onSpeedChange, onRestart, onExit };
  });

  useEffect(() => {
    if (!videoReady || !videoRef.current) return;

    let cancelled = false;
    const video = videoRef.current;

    async function loop() {
      if (cancelled || !video) return;

      const now = performance.now();

      try {
        const { landmarks } = await detectHands(video, now);

        if (!cancelled) {
          const raw: GestureType = landmarks ? classifyGesture(landmarks) : "NONE";
          const accepted = debouncerRef.current.update(raw);
          setCurrentGesture(accepted);

          const justChanged = accepted !== previousAcceptedRef.current;
          const cb = callbacksRef.current;

          if (enabledRef.current) {
            if (accepted === "ONE_FINGER" && landmarks) {
              const dir = swipeTrackerRef.current.update(landmarks, now);
              if (dir) cb.onSwipe(dir);
            } else {
              swipeTrackerRef.current.reset();
            }

            if (justChanged) {
              if (accepted === "OPEN_PALM") cb.onOpenPalmToggle();
              if (accepted === "THUMBS_UP") cb.onSpeedChange("FAST");
              if (accepted === "THUMBS_DOWN") cb.onSpeedChange("SLOW");
              if (accepted === "ONE_FINGER") cb.onSpeedChange("NORMAL");
              if (accepted === "FIST") cb.onExit();
            }
          } else {
            swipeTrackerRef.current.reset();
          }

          if (restartEnabledRef.current && justChanged && accepted === "PEACE") {
            cb.onRestart();
          }

          previousAcceptedRef.current = accepted;
        }
      } catch {
        // Detection can transiently fail (e.g. model still loading on the
        // very first frames) — safe to skip this frame and retry.
      }

      if (!cancelled) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      debouncerRef.current.reset();
      swipeTrackerRef.current.reset();
      previousAcceptedRef.current = "NONE";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoReady]);

  return { currentGesture };
}
