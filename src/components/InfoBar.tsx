import { motion, AnimatePresence } from "framer-motion";
import type { Direction, GestureType, SpeedMode } from "../utils/types";

interface InfoBarProps {
  score: number;
  gesture: GestureType;
  speedMode: SpeedMode;
  direction: Direction;
}

const GESTURE_LABELS: Record<GestureType, string> = {
  ONE_FINGER: "ONE FINGER",
  OPEN_PALM: "OPEN PALM",
  THUMBS_UP: "THUMBS UP",
  THUMBS_DOWN: "THUMBS DOWN",
  PEACE: "PEACE",
  FIST: "FIST",
  NONE: "—",
};

const SPEED_LABELS: Record<SpeedMode, string> = {
  SLOW: "SLOW DOWN",
  NORMAL: "NORMAL",
  FAST: "SPEED UP",
};

// Arrow glyphs keep this compact enough to fit as a fourth block alongside
// Score/Gesture/Speed on narrow phone widths.
const DIRECTION_LABELS: Record<Direction, string> = {
  UP: "↑ UP",
  DOWN: "↓ DOWN",
  LEFT: "← LEFT",
  RIGHT: "→ RIGHT",
};

interface StatBlockProps {
  label: string;
  value: string | number;
  /** Unique per distinct value, so AnimatePresence knows when to animate. */
  animateKey: string | number;
  /** Score gets a slightly punchier pop than gesture/speed text. */
  variant?: "default" | "score";
}

function StatBlock({ label, value, animateKey, variant = "default" }: StatBlockProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 overflow-hidden sm:items-start">
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-dim sm:text-[10px]">
        {label}
      </span>
      <div className="relative h-5 w-full sm:h-7">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={animateKey}
            className="stat-readout absolute inset-0 flex items-center justify-center truncate text-xs font-semibold sm:justify-start sm:text-xl"
            initial={
              variant === "score"
                ? { opacity: 0, scale: 0.6, y: -6 }
                : { opacity: 0, y: 6 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              variant === "score"
                ? { opacity: 0, scale: 1.3 }
                : { opacity: 0, y: -6 }
            }
            transition={{ duration: variant === "score" ? 0.35 : 0.25, ease: "easeOut" }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function InfoBar({ score, gesture, speedMode, direction }: InfoBarProps) {
  return (
    <div className="glass-panel flex items-center justify-between gap-1.5 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
      <StatBlock label="Score" value={score} animateKey={score} variant="score" />
      <div className="h-8 w-px shrink-0 bg-panel-border" />
      <StatBlock label="Gesture" value={GESTURE_LABELS[gesture]} animateKey={gesture} />
      <div className="h-8 w-px shrink-0 bg-panel-border" />
      <StatBlock label="Direction" value={DIRECTION_LABELS[direction]} animateKey={direction} />
      <div className="h-8 w-px shrink-0 bg-panel-border" />
      <StatBlock label="Speed" value={SPEED_LABELS[speedMode]} animateKey={speedMode} />
    </div>
  );
}
