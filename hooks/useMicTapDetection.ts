"use client";
import { useRef, useState, useCallback, useEffect } from "react";

interface Options {
  sensitivity: number; // 0–100
  onTap: () => void;
  cooldown?: number; // ms between triggers
}

export function useMicTapDetection({ sensitivity, onTap, cooldown = 800 }: Options) {
  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0–1
  const [permissionDenied, setPermissionDenied] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const lastTapRef = useRef<number>(0);
  const baselineRef = useRef<number>(0);
  const onTapRef = useRef(onTap);
  const sensitivityRef = useRef(sensitivity);

  useEffect(() => { onTapRef.current = onTap; }, [onTap]);
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current?.state !== "closed") audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    setIsListening(false);
    setVolumeLevel(0);
    baselineRef.current = 0;
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionDenied(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      setIsListening(true);
      setPermissionDenied(false);

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const instant = data.reduce((sum, v) => sum + v, 0) / data.length / 255;

        // Slow baseline tracks ambient noise
        baselineRef.current = baselineRef.current * 0.97 + instant * 0.03;

        const spike = instant - baselineRef.current;
        // threshold: at sensitivity=100 → 0.04, at sensitivity=0 → 0.54
        const threshold = 0.04 + ((100 - sensitivityRef.current) / 100) * 0.5;

        const now = Date.now();
        if (spike > threshold && now - lastTapRef.current > cooldown) {
          lastTapRef.current = now;
          onTapRef.current();
        }

        setVolumeLevel(Math.min(1, instant * 3)); // boost for visual
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setPermissionDenied(true);
    }
  }, [cooldown]);

  useEffect(() => () => stop(), [stop]);

  return { isListening, volumeLevel, start, stop, permissionDenied };
}
