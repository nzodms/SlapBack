"use client";
import { useEffect, useRef } from "react";

interface Options {
  onSpam: () => void;
  active: boolean;
  clickThreshold?: number;
  timeWindow?: number; // ms
}

export function useSpamClick({
  onSpam,
  active,
  clickThreshold = 6,
  timeWindow = 2000,
}: Options) {
  const clickTimestamps = useRef<number[]>([]);
  const onSpamRef = useRef(onSpam);
  useEffect(() => { onSpamRef.current = onSpam; }, [onSpam]);

  useEffect(() => {
    if (!active) {
      clickTimestamps.current = [];
      return;
    }

    const handler = () => {
      const now = Date.now();
      clickTimestamps.current = [
        ...clickTimestamps.current.filter((t) => now - t < timeWindow),
        now,
      ];
      if (clickTimestamps.current.length >= clickThreshold) {
        clickTimestamps.current = [];
        onSpamRef.current();
      }
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [active, clickThreshold, timeWindow]);
}
