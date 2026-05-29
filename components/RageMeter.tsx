"use client";
import { motion } from "framer-motion";

interface Props {
  level: number; // 0–100
}

const getColor = (level: number) => {
  if (level >= 80) return "from-red-500 via-red-400 to-orange-400";
  if (level >= 50) return "from-orange-500 to-red-500";
  if (level >= 25) return "from-yellow-400 to-orange-500";
  return "from-green-400 to-yellow-400";
};

export default function RageMeter({ level }: Props) {
  const isMax = level >= 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Rage Meter
          </span>
          {isMax && (
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full tracking-widest animate-pulse"
            >
              RAGE MAX
            </motion.span>
          )}
        </div>
        <span className={`text-xs font-mono font-bold ${isMax ? "text-red-400" : "text-zinc-500"}`}>
          {Math.round(level)}%
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getColor(level)}`}
          animate={{ width: `${level}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        />
        {/* segment ticks */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-black/40 last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
