import Phaser from "phaser";
import type { Direction, SpeedMode } from "../utils/types";
import {
  GRID_SIZE,
  CELL_PIXELS,
  SPEED_INTERVALS_MS,
  GAME_COLORS,
} from "./gameConfig";

interface Point {
  x: number;
  y: number;
}

const OPPOSITES: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export interface SnakeSceneCallbacks {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
  onSpeedChange?: (speed: SpeedMode) => void;
  onPauseChange?: (isPaused: boolean) => void;
  onDirectionChange?: (direction: Direction) => void;
}

/**
 * Grid-based Snake game. Control is input-source-agnostic: external code
 * (keyboard in Phase 2, gestures in Phase 3) calls the public methods
 * `setDirection`, `togglePause`, `setSpeedMode`, and `reset`.
 */
export class SnakeScene extends Phaser.Scene {
  private snake: Point[] = [];
  private direction: Direction = "RIGHT";
  private pendingDirection: Direction = "RIGHT";
  private food: Point = { x: 0, y: 0 };
  private score = 0;
  private speedMode: SpeedMode = "NORMAL";
  private isPaused = false;
  private isModalPaused = false;
  private isGameOver = false;
  private hasStarted = false;
  private moveAccumulator = 0;

  private graphics!: Phaser.GameObjects.Graphics;
  private foodPulseTween?: Phaser.Tweens.Tween;
  private foodPulseScale = 1;

  private callbacks: SnakeSceneCallbacks;

  constructor(callbacks: SnakeSceneCallbacks) {
    super("SnakeScene");
    this.callbacks = callbacks;
  }

  create() {
    this.graphics = this.add.graphics();
    this.initSnake();
    this.spawnFood();

    const kb = this.input.keyboard!;

    // Fallback keyboard test-harness for control, agnostic to gesture input
    // that Phase 3 will add via `setDirection`.
    kb.on("keydown-UP", () => this.setDirection("UP"));
    kb.on("keydown-DOWN", () => this.setDirection("DOWN"));
    kb.on("keydown-LEFT", () => this.setDirection("LEFT"));
    kb.on("keydown-RIGHT", () => this.setDirection("RIGHT"));

    this.startFoodPulse();
    this.draw();
  }

  private initSnake() {
    const startX = Math.floor(GRID_SIZE / 4);
    const startY = Math.floor(GRID_SIZE / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    this.direction = "RIGHT";
    this.pendingDirection = "RIGHT";
  }

  private spawnFood() {
    let candidate: Point;
    do {
      candidate = {
        x: Phaser.Math.Between(0, GRID_SIZE - 1),
        y: Phaser.Math.Between(0, GRID_SIZE - 1),
      };
    } while (this.snake.some((s) => s.x === candidate.x && s.y === candidate.y));
    this.food = candidate;
  }

  private startFoodPulse() {
    this.foodPulseTween?.stop();
    this.foodPulseScale = 1;
    this.foodPulseTween = this.tweens.add({
      targets: this,
      foodPulseScale: 1.25,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  update(_time: number, delta: number) {
    if (!this.hasStarted || this.isPaused || this.isModalPaused || this.isGameOver) return;

    this.moveAccumulator += delta;
    const interval = SPEED_INTERVALS_MS[this.speedMode];

    if (this.moveAccumulator >= interval) {
      this.moveAccumulator = 0;
      this.step();
    }
  }

  private step() {
    this.direction = this.pendingDirection;
    const head = this.snake[0];
    const next: Point = { ...head };

    switch (this.direction) {
      case "UP":
        next.y -= 1;
        break;
      case "DOWN":
        next.y += 1;
        break;
      case "LEFT":
        next.x -= 1;
        break;
      case "RIGHT":
        next.x += 1;
        break;
    }

    // Wall collision
    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      this.handleGameOver();
      return;
    }

    // Self collision
    if (this.snake.some((s) => s.x === next.x && s.y === next.y)) {
      this.handleGameOver();
      return;
    }

    this.snake.unshift(next);

    const ateFood = next.x === this.food.x && next.y === this.food.y;
    if (ateFood) {
      this.score += 1;
      this.callbacks.onScoreChange(this.score);
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  private handleGameOver() {
    this.isGameOver = true;
    this.callbacks.onGameOver();
  }

  private draw() {
    const g = this.graphics;
    g.clear();

    // Grid lines (subtle)
    g.lineStyle(1, GAME_COLORS.gridLine, 0.35);
    for (let i = 0; i <= GRID_SIZE; i++) {
      g.lineBetween(i * CELL_PIXELS, 0, i * CELL_PIXELS, GRID_SIZE * CELL_PIXELS);
      g.lineBetween(0, i * CELL_PIXELS, GRID_SIZE * CELL_PIXELS, i * CELL_PIXELS);
    }

    // Snake
    this.snake.forEach((segment, index) => {
      const color = index === 0 ? GAME_COLORS.snakeHead : GAME_COLORS.snakeBody;
      const pad = index === 0 ? 1 : 2;
      g.fillStyle(color, 1);
      g.fillRoundedRect(
        segment.x * CELL_PIXELS + pad,
        segment.y * CELL_PIXELS + pad,
        CELL_PIXELS - pad * 2,
        CELL_PIXELS - pad * 2,
        6
      );
    });

    // Food (pulsing glow)
    const foodCenterX = this.food.x * CELL_PIXELS + CELL_PIXELS / 2;
    const foodCenterY = this.food.y * CELL_PIXELS + CELL_PIXELS / 2;
    const baseRadius = CELL_PIXELS / 2 - 4;

    g.fillStyle(GAME_COLORS.foodGlow, 0.25);
    g.fillCircle(foodCenterX, foodCenterY, baseRadius * this.foodPulseScale * 1.6);

    g.fillStyle(GAME_COLORS.food, 1);
    g.fillCircle(foodCenterX, foodCenterY, baseRadius * this.foodPulseScale);
  }

  // ---- Public control API (input-source-agnostic) ----

  setDirection(dir: Direction) {
    if (!this.hasStarted || this.isPaused || this.isModalPaused || this.isGameOver) return;
    // Prevent reversing directly into the snake's own body.
    if (OPPOSITES[dir] === this.direction) return;
    this.pendingDirection = dir;
    this.callbacks.onDirectionChange?.(dir);
  }

  togglePause() {
    if (!this.hasStarted || this.isGameOver) return;
    this.isPaused = !this.isPaused;
    this.callbacks.onPauseChange?.(this.isPaused);
  }

  /**
   * Freezes/unfreezes the game due to a blocking UI overlay (End Game
   * confirmation, or Instructions reopened mid-game) rather than the
   * player's own Open Palm gesture. Kept separate from `isPaused` so:
   * - opening the modal doesn't clear a pause the player set themselves
   * - closing the modal doesn't resume if the player was already paused
   * Does NOT fire onPauseChange, since the visible "Paused" overlay is
   * meant to reflect the player's gesture-driven pause specifically —
   * the modal itself is already visually obvious as a blocking state.
   */
  setModalPaused(paused: boolean) {
    this.isModalPaused = paused;
  }

  setSpeedMode(mode: SpeedMode) {
    this.speedMode = mode;
    this.callbacks.onSpeedChange?.(mode);
  }

  /** Called when the player actually reaches the live game screen (i.e.
   *  after Start -> Instructions -> Continue), so the snake begins moving
   *  only now instead of auto-walking into a wall behind the landing card. */
  start() {
    this.hasStarted = true;
  }

  /** Stops the snake from moving without touching score/position — used
   *  when returning to the landing screen, so it doesn't sit there
   *  auto-walking into a wall again behind the next landing card. */
  stop() {
    this.hasStarted = false;
  }

  /**
   * Resets score/snake/food to a fresh game. Does NOT change whether the
   * game is "started" — callers decide that separately via `start()`/
   * `stop()`, since a reset can happen either as "restart and keep
   * playing immediately" (Peace gesture, New Game button) or as "go back
   * to landing, snake should sit idle until Start is clicked again"
   * (End Game confirm, Exit from Game Over).
   */
  reset() {
    this.score = 0;
    this.speedMode = "NORMAL";
    this.isPaused = false;
    this.isModalPaused = false;
    this.isGameOver = false;
    this.moveAccumulator = 0;
    this.initSnake();
    this.spawnFood();
    this.callbacks.onScoreChange(0);
    this.callbacks.onSpeedChange?.("NORMAL");
    this.callbacks.onPauseChange?.(false);
    this.callbacks.onDirectionChange?.("RIGHT");
    this.draw();
  }

  getIsPaused() {
    return this.isPaused;
  }
}
