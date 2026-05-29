"use client";
import { useRef, useState, useCallback } from "react";
import { playSynth, SYNTH_PROFILES } from "@/lib/synthSounds";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentIdRef = useRef<string | null>(null);
  const fileMissingRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const isMutedRef = useRef(false);

  const loadSound = useCallback((id: string, src: string) => {
    currentIdRef.current = id;
    fileMissingRef.current = false;
    setUsingFallback(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    const audio = new Audio(src);
    audio.muted = isMutedRef.current;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      fileMissingRef.current = true;
      setUsingFallback(!!SYNTH_PROFILES[id]);
    });
    audioRef.current = audio;
  }, []);

  const play = useCallback(() => {
    if (fileMissingRef.current && currentIdRef.current) {
      playSynth(currentIdRef.current, isMutedRef.current);
      return;
    }
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      if (currentIdRef.current) playSynth(currentIdRef.current, isMutedRef.current);
    });
  }, []);

  const preview = useCallback(() => {
    if (fileMissingRef.current && currentIdRef.current) {
      playSynth(currentIdRef.current, false); // preview ignores mute
      return;
    }
    if (!audioRef.current) return;
    const prevMute = audioRef.current.muted;
    audioRef.current.muted = false;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .catch(() => {
        if (currentIdRef.current) playSynth(currentIdRef.current, false);
      })
      .finally(() => {
        if (audioRef.current) audioRef.current.muted = prevMute;
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

  return { loadSound, play, preview, toggleMute, isMuted, usingFallback };
}
