"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { TriggerType } from "@/lib/triggers";

interface Options {
  trigger: TriggerType;
  onTrigger: () => void;
  active: boolean;
}

export function useKeyboardTrigger({ trigger, onTrigger, active }: Options) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedKey, setCapturedKey] = useState<string | null>(null);
  const capturedKeyRef = useRef<string | null>(null);
  const lastTriggerRef = useRef<number>(0);
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => { onTriggerRef.current = onTrigger; }, [onTrigger]);
  useEffect(() => { capturedKeyRef.current = capturedKey; }, [capturedKey]);

  const startCapture = useCallback(() => setIsCapturing(true), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Key capture mode — grab the next keypress as the custom trigger
      if (isCapturing) {
        e.preventDefault();
        setCapturedKey(e.key);
        setIsCapturing(false);
        return;
      }

      if (!active) return;

      const now = Date.now();
      if (now - lastTriggerRef.current < 300) return; // debounce repeated keydown

      let shouldTrigger = false;
      switch (trigger) {
        case "space-key":
          shouldTrigger = e.code === "Space";
          break;
        case "enter-key":
          shouldTrigger = e.code === "Enter";
          break;
        case "backspace-key":
          shouldTrigger = e.code === "Backspace";
          break;
        case "caps-lock":
          shouldTrigger = e.code === "CapsLock";
          break;
        case "custom-key":
          shouldTrigger = capturedKeyRef.current !== null && e.key === capturedKeyRef.current;
          break;
      }

      if (shouldTrigger) {
        e.preventDefault();
        lastTriggerRef.current = now;
        onTriggerRef.current();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, trigger, isCapturing]);

  return { isCapturing, startCapture, capturedKey };
}
