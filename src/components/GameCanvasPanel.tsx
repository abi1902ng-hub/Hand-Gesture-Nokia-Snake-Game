import { Gamepad2, Pause } from "lucide-react";
import type { RefObject } from "react";

interface GameCanvasPanelProps {
  containerRef: RefObject<HTMLDivElement | null>;
  isPaused?: boolean;
}

export function GameCanvasPanel({ containerRef, isPaused }: GameCanvasPanelProps) {
  return (
    <div className="glass-panel relative flex h-full min-h-[380px] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-panel-border px-4 py-3">
        <Gamepad2 className="h-4 w-4 text-signal-emerald-soft" strokeWidth={2} />
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Snake Arena
        </span>
      </div>
      <div className="relative flex flex-1 items-center justify-center bg-panel/40 bg-grid-fade p-3">
        <div
          ref={containerRef}
          className="flex h-full w-full items-center justify-center [&_canvas]:max-h-full [&_canvas]:max-w-full [&_canvas]:rounded-xl"
        />

        {isPaused && (
          <div className="absolute inset-3 flex flex-col items-center justify-center gap-2 rounded-xl bg-void/70 backdrop-blur-sm">
            <Pause className="h-6 w-6 text-signal-blue-soft" strokeWidth={2} />
            <span className="font-mono text-xs uppercase tracking-widest text-white/90">
              Paused
            </span>
            <span className="font-body text-[11px] text-muted-dim">
              Show Open Palm again to resume
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
