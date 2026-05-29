"use client";
import { motion } from "framer-motion";

interface Props {
  level: number; // 0–100
}

const getColor = (level: number) => {
  if (level >= 80) return "from-red-500 to-red-400";
  if (level >= 50) return "from-orange-500 to-red-500";
  if (level >= 25) return "from-yellow-400 to-orange-500";
  return "from-green-400 to-yellow-400";
};

export default function RageMeter({ level }: Props) {
  const isMax = level >= 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Rage Meter
        </span>
        <div className="flex items-center gap-2">
          {isMax && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-black text-red-400 animate-pulse tracking-widest"
            >
              RAGE MAX 💀
            </motion.span>
          )}
          <span className="text-xs font-mono text-zinc-500">{Math.round(level)}%</span>
        </div>
      </div>

      <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(level)}`}
          animate={{ width: `${level}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {isMax && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 text-center font-semibold"
        >
          Appelle un médecin.
        </motion.p>
      )}
    </div>
  );
}
