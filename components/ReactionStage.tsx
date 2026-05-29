"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  impact: string | null;
  punchline: string | null;
  reactionKey: number;
  isRageMax: boolean;
}

export default function ReactionStage({ impact, punchline, reactionKey, isRageMax }: Props) {
  return (
    <AnimatePresence>
      {impact && (
        <>
          {/* Full-screen white/red flash */}
          <motion.div
            key={`flash-${reactionKey}`}
            initial={{ opacity: isRageMax ? 0.7 : 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed inset-0 pointer-events-none z-40 ${
              isRageMax ? "bg-red-500" : "bg-white"
            }`}
          />

          {/* Radial glow behind impact text */}
          <motion.div
            key={`glow-${reactionKey}`}
            initial={{ opacity: 0.6, scale: 0.6 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <div
              className="w-96 h-96 rounded-full"
              style={{
                background: isRageMax
                  ? "radial-gradient(circle, rgba(239,68,68,0.6) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
              }}
            />
          </motion.div>

          {/* Impact text */}
          <motion.div
            key={`impact-${reactionKey}`}
            initial={{ scale: 0.35, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: -2 }}
            exit={{ scale: 1.6, opacity: 0, rotate: 4 }}
            transition={{ type: "spring", stiffness: 550, damping: 18 }}
            className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50 px-6"
          >
            <div
              className={`font-black leading-none tracking-tighter select-none ${
                isRageMax
                  ? "text-[16vw] md:text-[9rem] text-red-400"
                  : "text-[12vw] md:text-[8rem] text-white"
              }`}
              style={{
                textShadow: isRageMax
                  ? "0 0 80px rgba(239,68,68,0.8), 0 8px 40px rgba(0,0,0,0.9)"
                  : "0 0 60px rgba(255,255,255,0.3), 0 8px 40px rgba(0,0,0,0.9)",
              }}
            >
              {impact}
            </div>
            {punchline && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-4 text-lg md:text-2xl font-semibold text-center max-w-xl"
                style={{ color: isRageMax ? "#fca5a5" : "rgba(255,255,255,0.85)" }}
              >
                {punchline}
              </motion.p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
