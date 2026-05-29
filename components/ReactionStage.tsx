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
          {/* Flash overlay */}
          <motion.div
            key={`flash-${reactionKey}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`fixed inset-0 pointer-events-none z-40 ${
              isRageMax ? "bg-red-500" : "bg-white"
            }`}
          />

          {/* Impact text */}
          <motion.div
            key={`impact-${reactionKey}`}
            initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: -2 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 4 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50 px-6"
          >
            <div
              className={`font-black leading-none tracking-tighter select-none drop-shadow-2xl ${
                isRageMax
                  ? "text-[14vw] md:text-[10rem] text-red-400"
                  : "text-[10vw] md:text-[8rem] text-white"
              }`}
              style={{ textShadow: "0 8px 40px rgba(0,0,0,0.7)" }}
            >
              {impact}
            </div>
            {punchline && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-4 text-lg md:text-2xl text-white font-semibold text-center max-w-lg"
                style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
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
