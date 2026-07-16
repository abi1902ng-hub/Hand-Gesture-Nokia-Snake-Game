import { HelpCircle, XCircle } from "lucide-react";

interface TopNavProps {
  onViewInstructions: () => void;
  onEndGame: () => void;
}

export function TopNav({ onViewInstructions, onEndGame }: TopNavProps) {
  return (
    <div className="glass-panel flex items-center justify-between px-4 py-3 sm:px-5">
      <button
        onClick={onViewInstructions}
        className="flex items-center gap-2 font-body text-sm font-medium text-muted transition-colors hover:text-signal-emerald-soft"
      >
        <HelpCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
        <span className="hidden sm:inline">View Instructions</span>
      </button>

      <div className="hidden items-center gap-2 xs:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-emerald animate-pulse-soft" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Live
        </span>
      </div>

      <button
        onClick={onEndGame}
        className="flex items-center gap-2 font-body text-sm font-medium text-muted transition-colors hover:text-red-300"
      >
        <span className="hidden sm:inline">End Game</span>
        <XCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
      </button>
    </div>
  );
}
