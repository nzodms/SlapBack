"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  impact: string | null;
  punchline: string | null;
  reactionKey: number;
  isRageMax: boolean;
}

export default function ReactionOverlay({ impact, punchline, reactionKey, isRageMax }: Props) {
  return (
    <AnimatePresence mode="wait">
      {impact && (
        <motion.div
          key={reactionKey}
          initial={{ scale: 0.3, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.4, opacity: 0, y: -20 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50 px-8"
        >
          <div
            className={`font-black leading-none tracking-tight drop-shadow-2xl select-none ${
              isRageMax
                ? "text-[10vw] md:text-[8rem] text-red-400"
                : "text-[8vw] md:text-[6rem] text-white"
            }`}
          >
            {impact}
          </div>
          {punchline && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 text-lg md:text-2xl text-zinc-300 font-semibold text-center drop-shadow-lg max-w-lg"
            >
              {punchline}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
