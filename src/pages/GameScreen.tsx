import { useEffect, useCallback } from "react";
import { TopNav } from "../components/TopNav";
import { InfoBar } from "../components/InfoBar";
import { WebcamPanel } from "../components/WebcamPanel";
import { GameCanvasPanel } from "../components/GameCanvasPanel";
import { useSnakeGame } from "../hooks/useSnakeGame";
import { useWebcam } from "../hooks/useWebcam";
import { useGestureRecognition } from "../hooks/useGestureRecognition";

interface GameScreenProps {
  onViewInstructions: () => void;
  onEndGame: () => void;
  onGameOver: () => void;
  onScoreChange: (score: number) => void;
  /** Bumped by the parent whenever a fresh game should start (New Game). */
  resetSignal: number;
  /** Bumped by the parent exactly once, when the player clicks Continue on
   *  the instructions modal — this is what makes the snake actually begin
   *  moving, instead of auto-walking into a wall behind the landing card. */
  startSignal: number;
  /** Bumped by the parent when returning to the landing screen (End Game
   *  confirm, or Exit from Game Over) — stops the snake and resets its
   *  position so it sits idle instead of auto-walking behind the next
   *  landing card. */
  stopSignal: number;
  /**
   * True only while the game screen is the active/visible one (i.e. not
   * behind the landing overlay, and no blocking modal is open). Gesture
   * actions are ignored while this is false so, e.g., a fist gesture
   * lingering from a previous game doesn't immediately exit a fresh one.
   */
  gesturesEnabled: boolean;
  /** Separate from gesturesEnabled: stays true during Game Over so PEACE
   *  can restart, even though other gestures are disabled at that point. */
  restartGestureEnabled: boolean;
  /** Fist gesture -> request end game (routes through confirmation modal). */
  onGestureExit: () => void;
  /** Peace gesture during Game Over -> restart (routes through app flow,
   *  not the raw engine reset, so score/UI state resets consistently). */
  onGestureRestart: () => void;
  /** True whenever a blocking overlay (End Game confirm, or Instructions
   *  reopened mid-game) covers the game — freezes the snake's movement so
   *  it isn't still crawling toward a wall while the player can't see or
   *  control it. Independent of the player's own Open Palm pause. */
  isBlockingModalOpen: boolean;
}

/**
 * Responsive layout per spec:
 * - Desktop: two columns, camera | game (game panel wider)
 * - Tablet: camera above game (stacked, camera first)
 * - Mobile: camera -> game -> info bar (already the natural stacking order)
 */
export function GameScreen({
  onViewInstructions,
  onEndGame,
  onGameOver,
  onScoreChange,
  resetSignal,
  startSignal,
  stopSignal,
  gesturesEnabled,
  restartGestureEnabled,
  onGestureExit,
  onGestureRestart,
  isBlockingModalOpen,
}: GameScreenProps) {
  const { containerRef, score, speedMode, isPaused, direction, setDirection, togglePause, setSpeedMode, setModalPaused, resetGame, startGame, stopGame } =
    useSnakeGame({ onGameOver });

  const { videoRef, status: webcamStatus, errorMessage } = useWebcam();

  const { currentGesture } = useGestureRecognition({
    videoRef,
    videoReady: webcamStatus === "ready",
    enabled: gesturesEnabled,
    restartEnabled: restartGestureEnabled,
    onSwipe: setDirection,
    onOpenPalmToggle: togglePause,
    onSpeedChange: setSpeedMode,
    onRestart: onGestureRestart,
    onExit: onGestureExit,
  });

  // Keyboard arrow keys remain wired inside SnakeScene itself as a fallback
  // / testing aid — gestures and keyboard both call the same control API,
  // so they coexist without conflict.

  useEffect(() => {
    onScoreChange(score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  useEffect(() => {
    if (resetSignal > 0) {
      resetGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  useEffect(() => {
    if (startSignal > 0) {
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSignal]);

  useEffect(() => {
    if (stopSignal > 0) {
      stopGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopSignal]);

  useEffect(() => {
    setModalPaused(isBlockingModalOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlockingModalOpen]);

  const handleViewInstructions = useCallback(() => {
    onViewInstructions();
  }, [onViewInstructions]);

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto p-3 sm:gap-4 sm:p-6">
      <TopNav onViewInstructions={handleViewInstructions} onEndGame={onEndGame} />

      <div className="grid flex-1 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="min-h-[180px] sm:min-h-[240px] lg:min-h-0">
          <WebcamPanel videoRef={videoRef} status={webcamStatus} errorMessage={errorMessage} />
        </div>
        <div className="min-h-[300px] sm:min-h-[420px] lg:min-h-0">
          <GameCanvasPanel containerRef={containerRef} isPaused={isPaused} />
        </div>
      </div>

      <InfoBar score={score} gesture={currentGesture} speedMode={speedMode} direction={direction} />
    </div>
  );
}
