"use client";
import { useEffect, useRef } from "react";

interface Options {
  onShake: () => void;
  active: boolean;
  speedThreshold?: number; // px/ms
  consecutiveCount?: number;
  timeWindow?: number; // ms
  cooldown?: number; // ms between triggers
}

export function useMouseShake({
  onShake,
  active,
  speedThreshold = 1.2,
  consecutiveCount = 6,
  timeWindow = 600,
  cooldown = 1000,
}: Options) {
  const prevPos = useRef({ x: 0, y: 0, t: 0 });
  const fastMoves = useRef<number[]>([]);
  const lastTrigger = useRef<number>(0);
  const onShakeRef = useRef(onShake);
  useEffect(() => { onShakeRef.current = onShake; }, [onShake]);

  useEffect(() => {
    if (!active) {
      fastMoves.current = [];
      return;
    }

    const handler = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(now - prevPos.current.t, 1);
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      prevPos.current = { x: e.clientX, y: e.clientY, t: now };

      if (speed > speedThreshold) {
        fastMoves.current = [
          ...fastMoves.current.filter((t) => now - t < timeWindow),
          now,
        ];
        if (
          fastMoves.current.length >= consecutiveCount &&
          now - lastTrigger.current > cooldown
        ) {
          fastMoves.current = [];
          lastTrigger.current = now;
          onShakeRef.current();
        }
      }
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [active, speedThreshold, consecutiveCount, timeWindow, cooldown]);
}
