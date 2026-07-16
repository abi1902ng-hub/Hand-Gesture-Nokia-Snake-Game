import { Camera, CameraOff, Loader2 } from "lucide-react";
import type { RefObject } from "react";

interface WebcamPanelProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: "idle" | "requesting" | "ready" | "denied" | "error";
  errorMessage: string | null;
}

export function WebcamPanel({ videoRef, status, errorMessage }: WebcamPanelProps) {
  return (
    <div className="glass-panel flex h-full min-h-[220px] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-panel-border px-4 py-3">
        <Camera className="h-4 w-4 text-signal-blue-soft" strokeWidth={2} />
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Hand Tracking Feed
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-panel/40">
        <video
          ref={videoRef}
          className="h-full w-full scale-x-[-1] object-cover"
          playsInline
          muted
          style={{ display: status === "ready" ? "block" : "none" }}
        />

        {status !== "ready" && (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            {status === "requesting" || status === "idle" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-signal-blue-soft" />
                <p className="font-body text-xs text-muted-dim">
                  Requesting camera access…
                </p>
              </>
            ) : (
              <>
                <CameraOff className="h-5 w-5 text-red-400" strokeWidth={1.5} />
                <p className="font-body text-xs text-muted-dim">
                  {errorMessage ?? "Camera unavailable."}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
