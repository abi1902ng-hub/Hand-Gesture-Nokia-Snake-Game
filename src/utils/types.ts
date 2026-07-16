// Central type definitions shared across the app.
// Phase 1 defines the shapes; Phase 2 (game engine) and Phase 3 (gestures)
// will implement the logic that produces/consumes these types.

export type AppScreen = "landing" | "game";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type SpeedMode = "SLOW" | "NORMAL" | "FAST";

export type GestureType =
  | "ONE_FINGER"
  | "OPEN_PALM"
  | "THUMBS_UP"
  | "THUMBS_DOWN"
  | "PEACE"
  | "FIST"
  | "NONE";

export interface GameState {
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
  direction: Direction;
  speedMode: SpeedMode;
}

export interface GestureState {
  currentGesture: GestureType;
  swipeDirection: Direction | null;
}
