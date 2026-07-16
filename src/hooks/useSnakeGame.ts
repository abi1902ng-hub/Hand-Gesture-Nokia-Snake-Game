import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { createSnakeGame } from "../game/createSnakeGame";
import { SnakeScene } from "../game/SnakeScene";
import type { Direction, SpeedMode } from "../utils/types";

interface UseSnakeGameOptions {
  onGameOver: () => void;
}

/**
 * Owns the Phaser.Game lifecycle and exposes React-friendly state + a
 * control API that is agnostic to input source. Phase 2 wires keyboard
 * (inside SnakeScene itself); Phase 3 will call the same `setDirection`,
 * `togglePause`, `setSpeedMode` methods from gesture output.
 */
export function useSnakeGame({ onGameOver }: UseSnakeGameOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<SnakeScene | null>(null);

  const [score, setScore] = useState(0);
  const [speedMode, setSpeedModeState] = useState<SpeedMode>("NORMAL");
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirectionState] = useState<Direction>("RIGHT");
  const modalPausedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = createSnakeGame(containerRef.current, {
      onScoreChange: setScore,
      onGameOver: () => {
        onGameOver();
      },
      onSpeedChange: setSpeedModeState,
      onPauseChange: setIsPaused,
      onDirectionChange: setDirectionState,
    });

    gameRef.current = game;

    // Grab the scene once Phaser actually signals it's ready, instead of
    // assuming it's safe to read `game.scene.getScene(...)` immediately.
    // Under React StrictMode (dev only), effects mount -> cleanup -> mount
    // again; if the scene reference were captured synchronously here and
    // the *first* game instance's async boot finished after the second
    // mount already replaced `gameRef.current`, control calls could end up
    // silently targeting a destroyed/stale scene. Listening for Phaser's
    // own READY event ties the reference to the actual live instance.
    game.events.once(Phaser.Core.Events.READY, () => {
      if (gameRef.current === game) {
        sceneRef.current = game.scene.getScene("SnakeScene") as SnakeScene;
        // Apply whatever modal-pause state was requested before the scene
        // finished booting (e.g. End Game confirm opened very early).
        sceneRef.current.setModalPaused(modalPausedRef.current);
      }
    });

    return () => {
      game.destroy(true);
      if (gameRef.current === game) {
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDirection = useCallback((dir: Direction) => {
    sceneRef.current?.setDirection(dir);
  }, []);

  const togglePause = useCallback(() => {
    // No optimistic setIsPaused here — `isPaused` is now driven entirely
    // by the scene's onPauseChange callback (see createSnakeGame call
    // above), so the UI only shows "Paused" when the engine actually
    // paused, instead of flipping regardless of whether the call landed.
    sceneRef.current?.togglePause();
  }, []);

  const setSpeedMode = useCallback((mode: SpeedMode) => {
    sceneRef.current?.setSpeedMode(mode);
  }, []);

  const setModalPaused = useCallback((paused: boolean) => {
    modalPausedRef.current = paused;
    sceneRef.current?.setModalPaused(paused);
  }, []);

  const resetGame = useCallback(() => {
    sceneRef.current?.reset();
    sceneRef.current?.start();
    setScore(0);
    setSpeedModeState("NORMAL");
    setIsPaused(false);
    setDirectionState("RIGHT");
  }, []);

  const startGame = useCallback(() => {
    sceneRef.current?.start();
  }, []);

  const stopGame = useCallback(() => {
    sceneRef.current?.stop();
    sceneRef.current?.reset();
    setScore(0);
    setSpeedModeState("NORMAL");
    setIsPaused(false);
    setDirectionState("RIGHT");
  }, []);

  return {
    containerRef,
    score,
    speedMode,
    isPaused,
    direction,
    setDirection,
    togglePause,
    setSpeedMode,
    setModalPaused,
    resetGame,
    startGame,
    stopGame,
  };
}
