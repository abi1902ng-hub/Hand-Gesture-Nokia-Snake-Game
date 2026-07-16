import { useState, useCallback } from "react";
import { useAppFlow } from "./hooks/useAppFlow";
import { GameScreen } from "./pages/GameScreen";
import { LandingOverlay } from "./components/LandingOverlay";
import { InstructionsModal } from "./components/InstructionsModal";
import { EndGameConfirmModal } from "./components/EndGameConfirmModal";
import { GameOverModal } from "./components/GameOverModal";

function App() {
  const flow = useAppFlow();

  // Live score is reported up from GameScreen (which owns the Phaser
  // instance via useSnakeGame) so the End Game / Game Over modals can show
  // an accurate score without re-querying the game engine directly.
  const [liveScore, setLiveScore] = useState(0);
  // Frozen at the moment collision happens, so it doesn't reset to 0 before
  // the Game Over modal has a chance to render it.
  const [finalScore, setFinalScore] = useState(0);

  const handleGameOver = useCallback(() => {
    setFinalScore(liveScore);
    flow.triggerGameOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveScore, flow.triggerGameOver]);

  // Gestures should only be able to affect gameplay while the game is the
  // active screen and no blocking modal (instructions / end-confirm) is
  // covering it. Game-over is a special case: swipes/palm/thumbs should
  // stop mattering once the snake has died, but PEACE (restart) must keep
  // working specifically during game-over, per spec ("Peace: Restart after
  // Game Over").
  const gesturesEnabled =
    flow.screen === "game" &&
    !flow.showInstructions &&
    !flow.showEndConfirm &&
    !flow.isGameOver;

  const restartGestureEnabled =
    flow.screen === "game" && !flow.showInstructions && !flow.showEndConfirm && flow.isGameOver;

  // Freezes the snake's actual movement (not just gesture input) whenever
  // a blocking overlay covers the game screen — End Game confirmation, or
  // Instructions reopened mid-game via the "View Instructions" button.
  // Without this the snake kept crawling toward a wall while the player
  // couldn't see the board or react.
  const isBlockingModalOpen =
    flow.screen === "game" && (flow.showEndConfirm || flow.showInstructions);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void">
      {/* The game screen is ALWAYS mounted behind the landing overlay,
          per spec: "the actual game screen must already be rendered behind it." */}
      <GameScreen
        onViewInstructions={flow.openInstructions}
        onEndGame={flow.requestEndGame}
        onGameOver={handleGameOver}
        onScoreChange={setLiveScore}
        resetSignal={flow.resetSignal}
        startSignal={flow.startSignal}
        stopSignal={flow.stopSignal}
        gesturesEnabled={gesturesEnabled}
        restartGestureEnabled={restartGestureEnabled}
        onGestureExit={flow.requestEndGame}
        onGestureRestart={flow.restartGame}
        isBlockingModalOpen={isBlockingModalOpen}
      />

      <LandingOverlay
        visible={flow.screen === "landing" && !flow.showInstructions}
        onStart={flow.startGame}
      />

      <InstructionsModal
        open={flow.showInstructions}
        onContinue={flow.continueFromInstructions}
      />

      <EndGameConfirmModal
        open={flow.showEndConfirm}
        score={liveScore}
        onCancel={flow.cancelEndGame}
        onConfirm={flow.confirmEndGame}
      />

      <GameOverModal
        open={flow.isGameOver}
        score={finalScore}
        onNewGame={flow.restartGame}
        onExit={flow.exitToLanding}
      />
    </div>
  );
}

export default App;
