"use client";
import { useRef, useState, useCallback } from "react";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMutedRef = useRef(false);

  const loadSound = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    const audio = new Audio(src);
    audio.muted = isMutedRef.current;
    audio.preload = "auto";
    audio.addEventListener("error", () => setHasError(true));
    audio.addEventListener("canplaythrough", () => setHasError(false));
    audioRef.current = audio;
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Browser may block autoplay before user gesture — silent fail
    });
  }, []);

  // Preview always plays regardless of mute (user explicitly asked to hear it)
  const preview = useCallback(() => {
    if (!audioRef.current) return;
    const prev = audioRef.current.muted;
    audioRef.current.muted = false;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .catch(() => setHasError(true))
      .finally(() => {
        if (audioRef.current) audioRef.current.muted = prev;
      });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  return { loadSound, play, preview, toggleMute, isMuted, hasError };
}
