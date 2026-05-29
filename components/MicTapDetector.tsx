"use client";
import { motion } from "framer-motion";

interface Props {
  volumeLevel: number; // 0–1
  sensitivity: number; // 0–100
  onSensitivityChange: (v: number) => void;
  permissionDenied: boolean;
}

export default function MicTapDetector({
  volumeLevel,
  sensitivity,
  onSensitivityChange,
  permissionDenied,
}: Props) {
  if (permissionDenied) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-center space-y-1">
        <p className="text-red-400 text-sm font-semibold">Accès micro refusé.</p>
        <p className="text-zinc-500 text-xs">
          Les autres déclencheurs fonctionnent sans micro.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Niveau micro
        </span>
        <span className="text-xs text-zinc-600">
          {volumeLevel > 0.6 ? "🔴 PIC" : volumeLevel > 0.3 ? "🟡" : "🟢"}
        </span>
      </div>

      {/* Volume bar */}
      <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
          animate={{ width: `${Math.min(100, volumeLevel * 100)}%` }}
          transition={{ duration: 0.05, ease: "linear" }}
        />
      </div>

      {/* Sensitivity slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Sensibilité</span>
          <span className="font-mono">{sensitivity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={sensitivity}
          onChange={(e) => onSensitivityChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-red-400"
        />
        <div className="flex justify-between text-xs text-zinc-700">
          <span>Moins</span>
          <span>Plus</span>
        </div>
      </div>

      <p className="text-xs text-zinc-700 text-center leading-relaxed">
        🔒 No audio is recorded. Your microphone is only used locally to detect sharp volume peaks.
      </p>
    </div>
  );
}
