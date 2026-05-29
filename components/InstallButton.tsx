"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePWAInstall, Platform } from "@/hooks/usePWAInstall";

const INSTRUCTIONS: Record<Platform, { title: string; steps: string[] }> = {
  chromium: {
    title: "Install in Chrome / Edge",
    steps: [
      "Look for the install icon (▢ ↓) in the address bar.",
      "Click it, then confirm.",
      "SlapBack opens like a real app.",
    ],
  },
  "safari-mac": {
    title: "Install in Safari on Mac",
    steps: [
      "Click the Share button in the toolbar.",
      "Select “Add to Dock”.",
      "Launch SlapBack from your Dock anytime.",
    ],
  },
  "safari-ios": {
    title: "Install on iPhone / iPad",
    steps: [
      "Tap the Share button.",
      "Choose “Add to Home Screen”.",
      "Open SlapBack from your home screen.",
    ],
  },
  firefox: {
    title: "Install in Firefox",
    steps: [
      "Firefox desktop doesn’t support PWA install yet.",
      "Try Chrome, Edge, or Safari → Add to Dock.",
    ],
  },
  unknown: {
    title: "Install SlapBack",
    steps: [
      "Chrome / Edge: install icon in the address bar.",
      "Safari on Mac: Share → Add to Dock.",
    ],
  },
};

export default function InstallButton({ variant = "primary" }: { variant?: "primary" | "ghost" }) {
  const { canPrompt, promptInstall, isStandalone, platform, didJustInstall } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  if (isStandalone || didJustInstall) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Installed mode active
      </div>
    );
  }

  const handleClick = async () => {
    if (canPrompt) {
      const ok = await promptInstall();
      if (!ok) setShowInstructions(true);
    } else {
      setShowInstructions(true);
    }
  };

  const primaryClass =
    variant === "primary"
      ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
      : "bg-zinc-900 text-white border border-zinc-700 hover:border-zinc-500";

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${primaryClass}`}
      >
        <span className="text-base">⬇</span>
        Install SlapBack
      </button>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 max-w-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {INSTRUCTIONS[platform].title}
                </span>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-zinc-600 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <ol className="space-y-2">
                {INSTRUCTIONS[platform].steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
