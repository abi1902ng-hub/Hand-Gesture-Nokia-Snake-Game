import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, LogOut } from "lucide-react";

interface GameOverModalProps {
  open: boolean;
  score: number;
  onNewGame: () => void;
  onExit: () => void;
}

export function GameOverModal({ open, score, onNewGame, onExit }: GameOverModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-void/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="glass-card signal-border relative z-10 w-full max-w-sm px-8 py-9 text-center"
            initial={{ opacity: 0, scale: 0.85, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Pixel-art inspired header using a blocky monospace treatment */}
            <p
              className="font-mono text-2xl font-bold tracking-[0.3em] text-red-400"
              style={{ textShadow: "3px 3px 0px rgba(239,68,68,0.3)" }}
            >
              GAME
              <br />
              OVER
            </p>

            <div className="mx-auto mt-6 h-px w-16 bg-panel-border" />

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
              Final Score
            </p>
            <p className="stat-readout mt-1 text-4xl font-bold">{score}</p>

            <div className="mt-8 flex gap-3">
              <button onClick={onNewGame} className="btn-primary flex-1">
                <RotateCcw className="h-4 w-4" strokeWidth={2} />
                New Game
              </button>
              <button onClick={onExit} className="btn-secondary flex-1">
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Exit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
