import { useEffect, useRef, useState } from "react";

interface UseWebcamResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: "idle" | "requesting" | "ready" | "denied" | "error";
  errorMessage: string | null;
}

/**
 * Requests webcam access and streams it into a <video> element via ref.
 * Phase 3 will attach MediaPipe's hand landmarker to the same video element
 * (reading frames from `videoRef.current`) — no changes needed here for that.
 */
export function useWebcam(): UseWebcamResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<UseWebcamResult["status"]>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      setStatus("requesting");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          setStatus("denied");
          setErrorMessage("Camera access was denied.");
        } else {
          setStatus("error");
          setErrorMessage("Could not access the camera.");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { videoRef, status, errorMessage };
}
