export interface GestureInstruction {
  emoji: string;
  label: string;
  description: string;
}

export const GESTURE_INSTRUCTIONS: GestureInstruction[] = [
  {
    emoji: "☝️",
    label: "One Finger",
    description:
      "Swipe left, right, up, or down to steer the snake in that direction.",
  },
  {
    emoji: "✋",
    label: "Open Palm",
    description: "Pause the game. Show it again to resume.",
  },
  {
    emoji: "👍",
    label: "Thumbs Up",
    description: "Speed up the snake.",
  },
  {
    emoji: "👎",
    label: "Thumbs Down",
    description: "Slow down the snake.",
  },
  {
    emoji: "✌️",
    label: "Peace",
    description: "Restart the game after Game Over.",
  },
  {
    emoji: "✊",
    label: "Fist",
    description: "Exit the current game.",
  },
];
