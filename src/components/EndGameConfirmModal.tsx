import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface EndGameConfirmModalProps {
  open: boolean;
  score: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function EndGameConfirmModal({
  open,
  score,
  onCancel,
  onConfirm,
}: EndGameConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-void/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="glass-card relative z-10 w-full max-w-sm px-8 py-8 text-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-6 w-6 text-amber-400" strokeWidth={1.5} />
            </div>

            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
              Current Score
            </p>
            <p className="stat-readout mt-1 text-3xl font-bold">{score}</p>

            <p className="mt-5 font-body text-sm text-white/80">
              Are you sure you want to end this game?
            </p>

            <div className="mt-6 flex gap-3">
              <button onClick={onCancel} className="btn-secondary flex-1">
                No
              </button>
              <button onClick={onConfirm} className="btn-danger flex-1">
                Yes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
