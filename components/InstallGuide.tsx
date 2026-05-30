"use client";

import { motion } from "framer-motion";
import { INSTALL_STEPS } from "@/lib/download";

export default function InstallGuide({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {INSTALL_STEPS.map((step, i) => (
        <motion.div
          key={step.n}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-start gap-4 rounded-2xl border border-zinc-900 bg-zinc-950 p-4 md:p-5"
        >
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-sm flex items-center justify-center">
              {step.n}
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <span>{step.emoji}</span>
              {step.title}
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">{step.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
