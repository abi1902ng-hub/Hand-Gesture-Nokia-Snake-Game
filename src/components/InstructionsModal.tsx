import { motion, AnimatePresence } from "framer-motion";
import { GESTURE_INSTRUCTIONS } from "../utils/constants";

interface InstructionsModalProps {
  open: boolean;
  onContinue: () => void;
}

export function InstructionsModal({ open, onContinue }: InstructionsModalProps) {
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
            className="absolute inset-0 bg-void/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="glass-card relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col px-6 py-6 sm:px-8 sm:py-8"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h2 className="font-display text-xl font-bold tracking-wide text-white">
              HOW TO PLAY
            </h2>

            <div className="mt-5 space-y-4 overflow-y-auto pr-1 sm:mt-6">
              {GESTURE_INSTRUCTIONS.map((g) => (
                <div key={g.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-panel-raised/60 border border-panel-border text-xl">
                    {g.emoji}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-signal-emerald-soft">
                      {g.label}
                    </p>
                    <p className="font-body text-sm text-muted">
                      {g.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onContinue} className="btn-primary mt-6 w-full shrink-0 sm:mt-8">
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
