"use client";
import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type Platform = "chromium" | "safari-mac" | "safari-ios" | "firefox" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  if (/iPad|iPhone|iPod/.test(ua)) return "safari-ios";
  if (isSafari) return "safari-mac";
  if (/Firefox/.test(ua)) return "firefox";
  return "chromium";
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [didJustInstall, setDidJustInstall] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());

    const check = () =>
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    check();

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setDidJustInstall(true);
      check();
    };
    const mql = window.matchMedia("(display-mode: standalone)");
    const onChange = () => check();

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    mql.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      mql.removeEventListener?.("change", onChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") setInstallPrompt(null);
      return result.outcome === "accepted";
    } catch {
      return false;
    }
  }, [installPrompt]);

  const canPrompt = installPrompt !== null;

  return { canPrompt, promptInstall, isStandalone, platform, didJustInstall };
}
