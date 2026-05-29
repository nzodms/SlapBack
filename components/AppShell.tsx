"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  isActive: boolean;
  isMuted: boolean;
  isShaking: boolean;
  rageLevel: number;
  onToggleStart: () => void;
  onToggleMute: () => void;
  children: ReactNode;
  startDisabled?: boolean;
}

export default function AppShell({
  isActive,
  isMuted,
  isShaking,
  rageLevel,
  onToggleStart,
  onToggleMute,
  children,
  startDisabled,
}: Props) {
  const isRageMax = rageLevel >= 100;

  return (
    <motion.div
      animate={
        isShaking
          ? {
              x: [0, -12, 12, -8, 8, -4, 4, 0],
              y: [0, 5, -5, 3, -3, 0],
              rotate: [0, -0.6, 0.6, -0.3, 0.3, 0],
            }
          : { x: 0, y: 0, rotate: 0 }
      }
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative rounded-[28px] border bg-zinc-950 overflow-hidden transition-colors duration-300 ${
        isRageMax
          ? "border-red-500/60 shadow-[0_0_80px_rgba(239,68,68,0.25)]"
          : isActive
          ? "border-zinc-700 shadow-[0_0_60px_rgba(255,255,255,0.04)]"
          : "border-zinc-800"
      }`}
    >
      {/* Window chrome — fake Mac-style */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900 bg-zinc-950">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 text-center text-xs text-zinc-600 font-medium tracking-wide select-none">
          SlapBack
        </div>
        <div className="w-12" />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={isActive ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
            className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-400" : "bg-zinc-700"}`}
          />
          <span
            className={`text-xs font-bold uppercase tracking-[0.18em] ${
              isActive ? "text-green-400" : "text-zinc-500"
            }`}
          >
            {isActive ? "Active" : "Paused"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white transition-all"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={onToggleStart}
            disabled={startDisabled}
            className={`px-5 h-10 rounded-xl font-bold text-sm transition-all ${
              isActive
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed"
            }`}
          >
            {isActive ? "Stop" : "Start chaos"}
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">{children}</div>
    </motion.div>
  );
}
