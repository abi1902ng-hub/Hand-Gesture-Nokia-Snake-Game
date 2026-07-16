import Phaser from "phaser";
import { SnakeScene, type SnakeSceneCallbacks } from "./SnakeScene";
import { BOARD_PIXELS, GAME_COLORS } from "./gameConfig";

export function createSnakeGame(
  parent: HTMLDivElement,
  callbacks: SnakeSceneCallbacks
): Phaser.Game {
  const scene = new SnakeScene(callbacks);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: BOARD_PIXELS,
    height: BOARD_PIXELS,
    backgroundColor: `#${GAME_COLORS.background.toString(16).padStart(6, "0")}`,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene,
  };

  return new Phaser.Game(config);
}
