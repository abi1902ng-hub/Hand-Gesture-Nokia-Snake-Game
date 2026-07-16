import type { SpeedMode } from "../utils/types";

// Grid-based snake game configuration.
export const GRID_SIZE = 20; // cells per row/column
export const CELL_PIXELS = 24; // rendered pixel size per cell
export const BOARD_PIXELS = GRID_SIZE * CELL_PIXELS;

// Move interval (ms) per speed mode — lower = faster snake.
export const SPEED_INTERVALS_MS: Record<SpeedMode, number> = {
  SLOW: 300,
  NORMAL: 190,
  FAST: 120,
};

// Colors matching the Tailwind theme (Phaser needs hex numbers, not classes).
export const GAME_COLORS = {
  background: 0x0b1220,
  gridLine: 0x1e2e4a,
  snakeHead: 0x34d8a0,
  snakeBody: 0x2f6fed,
  food: 0x7ce7c4,
  foodGlow: 0x34d8a0,
};
