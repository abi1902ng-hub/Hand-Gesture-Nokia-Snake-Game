import { motion, AnimatePresence } from "framer-motion";
import { Hand, Play } from "lucide-react";

interface LandingOverlayProps {
  visible: boolean;
  onStart: () => void;
}

const contentVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/**
 * Sits on top of the (already-mounted) game screen.
 * Visibility of the blur/dark backdrop is controlled by the parent
 * via the `visible` prop, not by mounting/unmounting the game.
 *
 * On first mount (page load), the scrim fades in from fully transparent so
 * there's a brief "boot sequence" glimpse of the live game canvas behind
 * before it dims — reinforcing that the game is really there, not a
 * separate page. On subsequent shows (rare — landing normally only shows
 * once per session) the same fade-in applies via `initial`.
 */
export function LandingOverlay({ visible, onStart }: LandingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Dark + blur scrim over the live game behind */}
          <motion.div
            className="absolute inset-0 bg-void/80 backdrop-blur-2xl"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          <motion.div
            className="glass-card signal-border relative z-10 mx-4 flex max-h-[85vh] max-w-md flex-col items-center gap-5 overflow-y-auto px-6 py-9 text-center sm:gap-6 sm:px-10 sm:py-12"
            variants={contentVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.92, y: -16, transition: { duration: 0.45, ease: "easeInOut" } }}
          >
            <motion.div
              variants={itemVariants}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-signal-blue/20 to-signal-emerald/20 border border-panel-border sm:h-16 sm:w-16"
            >
              <Hand className="h-7 w-7 text-signal-emerald sm:h-8 sm:w-8" strokeWidth={1.5} />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                HAND GESTURE
                <br />
                SNAKE GAME
              </h1>
              <p className="font-body text-sm text-muted">
                Control the snake using your hand gestures.
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={onStart}
              className="btn-primary mt-2 w-full"
            >
              <Play className="h-4 w-4" strokeWidth={2} fill="currentColor" />
              Start Game
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
