"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEMOS = [
  {
    icon: "🪵",
    trigger: "Tap your desk",
    impact: "SLAP!",
    punchline: "Ton Mac n&apos;a rien demandé.",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.25)",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.3)",
  },
  {
    icon: "⎵",
    trigger: "Press Space",
    impact: "OUCH!",
    punchline: "Doucement, c&apos;est un clavier.",
    color: "#facc15",
    glow: "rgba(250,204,21,0.2)",
    bg: "rgba(250,204,21,0.05)",
    border: "rgba(250,204,21,0.25)",
  },
  {
    icon: "🖱️",
    trigger: "Spam clicks",
    impact: "STOP IT",
    punchline: "Le bouton a compris la première fois.",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.2)",
    bg: "rgba(167,139,250,0.05)",
    border: "rgba(167,139,250,0.25)",
  },
] as const;

const STEP_DURATION = 3000;
const IMPACT_DELAY = 850;
const PUNCHLINE_DELAY = 1100;

export default function HeroDemo() {
  const [step, setStep] = useState(0);
  const [showImpact, setShowImpact] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);
  const [paused, setPaused] = useState(false);

  const demo = DEMOS[step];

  const goTo = useCallback((i: number) => {
    setStep(i);
    setPaused(true);
    // resume auto-advance after 6s of inactivity
    setTimeout(() => setPaused(false), 6000);
  }, []);

  useEffect(() => {
    setShowImpact(false);
    setShowPunchline(false);

    const t1 = setTimeout(() => setShowImpact(true), IMPACT_DELAY);
    const t2 = setTimeout(() => setShowPunchline(true), PUNCHLINE_DELAY);
    if (paused) return () => { clearTimeout(t1); clearTimeout(t2); };
    const t3 = setTimeout(() => setStep((s) => (s + 1) % DEMOS.length), STEP_DURATION);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step, paused]);

  return (
    <div className="w-full max-w-md mx-auto select-none">
      {/* Mac window card */}
      <motion.div
        animate={{ boxShadow: showImpact ? `0 0 80px ${demo.glow}, 0 0 0 1px ${demo.border}` : "0 0 0 1px rgba(63,63,70,0.8)" }}
        transition={{ duration: 0.5 }}
        className="rounded-[22px] border border-zinc-800 bg-zinc-950 overflow-hidden"
        style={{ transition: "box-shadow 0.5s" }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-zinc-700/80" />
            <span className="w-3 h-3 rounded-full bg-zinc-700/80" />
            <span className="w-3 h-3 rounded-full bg-zinc-700/80" />
          </div>
          <span className="flex-1 text-center text-xs text-zinc-600 font-medium tracking-wide">
            SlapBack
          </span>
          <div className="w-10" />
        </div>

        {/* Demo stage */}
        <div className="relative px-8 pt-8 pb-6 flex flex-col items-center gap-5 min-h-[200px]">
          {/* Glow background pulse */}
          <AnimatePresence>
            {showImpact && (
              <motion.div
                key={`glow-${step}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${demo.glow} 0%, transparent 70%)` }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col items-center gap-5 w-full"
            >
              {/* Trigger pill */}
              <div
                className="flex items-center gap-3 px-5 py-2.5 rounded-full border text-sm font-semibold text-zinc-200"
                style={{ background: demo.bg, borderColor: demo.border }}
              >
                <span className="text-xl leading-none">{demo.icon}</span>
                <span>{demo.trigger}</span>
                <span className="text-zinc-600 text-xs">→</span>
                <span className="font-bold text-xs" style={{ color: demo.color }}>
                  react
                </span>
              </div>

              {/* Impact word */}
              <div className="h-20 flex items-center justify-center">
                <AnimatePresence>
                  {showImpact && (
                    <motion.div
                      key={`impact-${step}`}
                      initial={{ scale: 0.25, opacity: 0, rotate: -8 }}
                      animate={{ scale: 1, opacity: 1, rotate: -2 }}
                      exit={{ scale: 1.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 520, damping: 20 }}
                      className="text-6xl font-black tracking-tighter leading-none"
                      style={{
                        color: demo.color,
                        textShadow: `0 0 50px ${demo.glow}, 0 4px 24px rgba(0,0,0,0.6)`,
                      }}
                    >
                      {demo.impact}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Punchline */}
              <div className="h-5 flex items-center">
                <AnimatePresence>
                  {showPunchline && (
                    <motion.p
                      key={`pl-${step}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-zinc-500 text-center"
                    >
                      {demo.punchline}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center items-center gap-2 pb-5">
          {DEMOS.map((d, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Demo ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: step === i ? 20 : 8,
                height: 8,
                borderRadius: 9999,
                background: step === i ? d.color : "#27272a",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* CTA below */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-zinc-600 mt-4"
      >
        ↑ This is what happens. Try it yourself below.
      </motion.p>
    </div>
  );
}
