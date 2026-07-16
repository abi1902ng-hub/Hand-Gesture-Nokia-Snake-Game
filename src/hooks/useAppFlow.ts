import { useCallback, useState } from "react";
import type { AppScreen } from "../utils/types";

/**
 * Drives the top-level flow of the app:
 * landing (game blurred behind it) -> instructions modal -> live game.
 *
 * The game screen is ALWAYS mounted (per spec: "the actual game screen
 * must already be rendered behind it"). This hook only controls the
 * overlay/blur/instructions visibility on top of it.
 */
export function useAppFlow() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [startSignal, setStartSignal] = useState(0);
  const [stopSignal, setStopSignal] = useState(0);

  const startGame = useCallback(() => {
    // Landing card fades away, instructions popup appears next.
    setShowInstructions(true);
  }, []);

  const continueFromInstructions = useCallback(() => {
    setShowInstructions(false);
    setScreen("game");
    setStartSignal((n) => n + 1);
  }, []);

  const openInstructions = useCallback(() => {
    setShowInstructions(true);
  }, []);

  const closeInstructionsOnly = useCallback(() => {
    // Used when instructions are opened mid-game via "View Instructions".
    setShowInstructions(false);
  }, []);

  const requestEndGame = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  const cancelEndGame = useCallback(() => {
    setShowEndConfirm(false);
  }, []);

  const confirmEndGame = useCallback(() => {
    setShowEndConfirm(false);
    setIsGameOver(false);
    setScreen("landing");
    setStopSignal((n) => n + 1);
  }, []);

  const triggerGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const restartGame = useCallback(() => {
    setIsGameOver(false);
    setResetSignal((n) => n + 1);
  }, []);

  const exitToLanding = useCallback(() => {
    setIsGameOver(false);
    setScreen("landing");
    setStopSignal((n) => n + 1);
  }, []);

  return {
    screen,
    showInstructions,
    showEndConfirm,
    isGameOver,
    resetSignal,
    startSignal,
    stopSignal,
    startGame,
    continueFromInstructions,
    openInstructions,
    closeInstructionsOnly,
    requestEndGame,
    cancelEndGame,
    confirmEndGame,
    triggerGameOver,
    restartGame,
    exitToLanding,
  };
}
