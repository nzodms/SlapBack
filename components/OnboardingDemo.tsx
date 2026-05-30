"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { SOUNDS } from "@/lib/sounds";
import {
  VIBES,
  ONBOARDING_TRIGGERS,
  TEST_PUNCHLINES,
  Vibe,
  OnboardingTrigger,
} from "@/lib/vibes";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useMicTapDetection } from "@/hooks/useMicTapDetection";
import { useKeyboardTrigger } from "@/hooks/useKeyboardTrigger";
import { useSpamClick } from "@/hooks/useSpamClick";
import InstallButton from "@/components/InstallButton";

type Step = 0 | 1 | 2 | 3;

export default function OnboardingDemo() {
  const [step, setStep] = useState<Step>(0);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [trigger, setTrigger] = useState<OnboardingTrigger | null>(null);
  const [reaction, setReaction] = useState<{ impact: string; punch: string; key: number } | null>(
    null
  );
  const [shake, setShake] = useState(false);
  const [hits, setHits] = useState(0);
  const reactionTimeout = useRef<NodeJS.Timeout | null>(null);

  const { loadSound, play, preview, usingFallback } = useAudioPlayer();

  const triggerOpt = ONBOARDING_TRIGGERS.find((t) => t.id === trigger);

  // Load the vibe's sound
  useEffect(() => {
    if (!vibe) return;
    const s = SOUNDS.find((sd) => sd.id === vibe.soundId);
    if (s) loadSound(s.id, s.file);
  }, [vibe, loadSound]);

  const fireReaction = useCallback(() => {
    if (step !== 3 || !vibe || !triggerOpt) return;
    play();
    setHits((h) => {
      const punch = TEST_PUNCHLINES[Math.min(h, TEST_PUNCHLINES.length - 1)];
      setReaction({ impact: triggerOpt.impact, punch, key: Date.now() });
      return h + 1;
    });
    setShake(true);
    if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
    reactionTimeout.current = setTimeout(() => setReaction(null), 1400);
    setTimeout(() => setShake(false), 450);
  }, [step, vibe, triggerOpt, play]);

  // Trigger wiring — only active on the test step
  const testing = step === 3;
  const mic = useMicTapDetection({ sensitivity: 70, onTap: fireReaction, cooldown: 600 });

  useKeyboardTrigger({
    trigger: "space-key",
    onTrigger: fireReaction,
    active: testing && trigger === "press-space",
  });
  useSpamClick({
    onSpam: fireReaction,
    active: testing && trigger === "spam-clicks",
    clickThreshold: 6,
    timeWindow: 2000,
  });

  // Start/stop mic when entering/leaving test step with tap-desk
  useEffect(() => {
    if (testing && trigger === "tap-desk") {
      mic.start();
      return () => mic.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testing, trigger]);

  const goToTest = useCallback(() => {
    setHits(0);
    setStep(3);
  }, []);

  const restart = useCallback(() => {
    mic.stop();
    setStep(0);
    setVibe(null);
    setTrigger(null);
    setReaction(null);
    setHits(0);
  }, [mic]);

  const accent = vibe?.color ?? "#ef4444";
  const accentGlow = vibe?.glow ?? "rgba(239,68,68,0.3)";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mac window */}
      <motion.div
        animate={shake ? { x: [0, -10, 10, -6, 6, 0], y: [0, 3, -3, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative rounded-[24px] border bg-zinc-950 overflow-hidden"
        style={{
          borderColor: testing ? vibe?.border ?? "rgba(63,63,70,0.6)" : "rgba(63,63,70,0.6)",
          boxShadow: testing
            ? `0 0 70px ${accentGlow}, 0 0 0 1px ${vibe?.border}`
            : "0 24px 70px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.4s, border-color 0.4s",
        }}
      >
        {/* macOS header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="flex-1 text-center text-xs text-zinc-600 font-medium tracking-wide select-none">
            SlapBack
          </span>
          {/* Step dots */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 14 : 5,
                  height: 5,
                  background: i === step ? accent : i < step ? "#52525b" : "#27272a",
                }}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="relative min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* ── STEP 0 — WELCOME ── */}
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 gap-5"
              >
                <motion.div
                  animate={{ rotate: [0, -6, 6, -3, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                >
                  👋
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                    Let&apos;s make your Mac react.
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                    Choose a vibe, pick a trigger, then test it instantly.
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-7 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all shadow-lg shadow-red-500/30 active:scale-95"
                >
                  Start setup →
                </button>
              </motion.div>
            )}

            {/* ── STEP 1 — VIBE ── */}
            {step === 1 && (
              <motion.div
                key="vibe"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="flex-1 px-6 py-8 flex flex-col"
              >
                <div className="text-center mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-1">
                    Step 1 of 3
                  </p>
                  <h3 className="text-xl font-black tracking-tight">Choose your vibe</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  {VIBES.map((v) => (
                    <motion.button
                      key={v.id}
                      onClick={() => {
                        setVibe(v);
                        setTimeout(() => setStep(2), 180);
                      }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border text-center transition-all"
                      style={{
                        borderColor: vibe?.id === v.id ? v.border : "rgb(39,39,42)",
                        background: vibe?.id === v.id ? v.bg : "rgba(24,24,27,0.6)",
                      }}
                    >
                      <span className="text-3xl">{v.emoji}</span>
                      <span className="text-sm font-bold text-white">{v.label}</span>
                      <span className="text-[11px] text-zinc-500 leading-snug">
                        {v.description}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP 2 — TRIGGER ── */}
            {step === 2 && (
              <motion.div
                key="trigger"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="flex-1 px-6 py-8 flex flex-col"
              >
                <div className="text-center mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-1">
                    Step 2 of 3
                  </p>
                  <h3 className="text-xl font-black tracking-tight">Pick your trigger</h3>
                </div>
                <div className="grid grid-cols-1 gap-2.5 flex-1">
                  {ONBOARDING_TRIGGERS.map((t) => (
                    <motion.button
                      key={t.id}
                      onClick={() => {
                        setTrigger(t.id);
                        setTimeout(goToTest, 180);
                      }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-left transition-all hover:border-zinc-600"
                    >
                      <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white">{t.label}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{t.description}</div>
                      </div>
                      <span className="ml-auto text-zinc-600 text-sm">→</span>
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors self-center"
                >
                  ← Back to vibe
                </button>
              </motion.div>
            )}

            {/* ── STEP 3 — TEST ── */}
            {step === 3 && vibe && triggerOpt && (
              <motion.div
                key="test"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                {/* Reaction stage */}
                <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[200px]">
                  {/* Glow */}
                  <AnimatePresence>
                    {reaction && (
                      <motion.div
                        key={`g-${reaction.key}`}
                        initial={{ opacity: 0.7, scale: 0.4 }}
                        animate={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${accentGlow} 0%, transparent 70%)`,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Waiting prompt */}
                  {!reaction && (
                    <div className="flex flex-col items-center gap-4 text-center px-6">
                      {trigger === "tap-desk" && mic.permissionDenied ? (
                        <>
                          <span className="text-4xl">🚫</span>
                          <p className="text-sm font-semibold text-red-400">
                            Microphone blocked
                          </p>
                          <p className="text-xs text-zinc-500 max-w-xs">
                            Allow the mic in your browser, or go back and pick Press Space / Spam
                            clicks instead.
                          </p>
                        </>
                      ) : trigger === "tap-desk" ? (
                        <>
                          {/* Sound wave */}
                          <div className="flex items-end gap-1 h-12">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                              <motion.span
                                key={i}
                                className="w-1.5 rounded-full"
                                style={{ background: accent }}
                                animate={{ height: [8, 8 + 38 * (0.3 + mic.volumeLevel), 8] }}
                                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                              />
                            ))}
                          </div>
                          <p className="text-lg font-bold text-white">{triggerOpt.prompt}</p>
                          <p className="text-[11px] text-zinc-600">Listening locally — nothing is recorded</p>
                        </>
                      ) : (
                        <>
                          <motion.span
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            className="text-5xl"
                          >
                            {triggerOpt.emoji}
                          </motion.span>
                          <p className="text-lg font-bold text-white">{triggerOpt.prompt}</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Impact */}
                  <AnimatePresence>
                    {reaction && (
                      <motion.div
                        key={reaction.key}
                        initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
                        animate={{ scale: 1, opacity: 1, rotate: -2 }}
                        exit={{ scale: 1.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 560, damping: 18 }}
                        className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none"
                      >
                        <div
                          className="text-6xl md:text-7xl font-black tracking-tighter leading-none"
                          style={{
                            color: accent,
                            textShadow: `0 0 50px ${accentGlow}, 0 6px 24px rgba(0,0,0,0.7)`,
                          }}
                        >
                          {reaction.impact}
                        </div>
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="mt-3 text-sm font-semibold text-zinc-300"
                        >
                          {reaction.punch}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer — conversion */}
                <div className="border-t border-zinc-900 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                      {vibe.label} · {triggerOpt.label}
                    </span>
                    <button onClick={preview} className="hover:text-zinc-300 transition-colors">
                      ▶ Preview sound
                    </button>
                  </div>

                  {hits > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <div className="flex-[2]">
                        <InstallButton />
                      </div>
                      <Link
                        href="/playground"
                        className="flex-1 inline-flex items-center justify-center px-4 py-3.5 rounded-2xl border border-zinc-800 text-zinc-400 text-sm font-semibold hover:border-zinc-600 hover:text-white transition-all"
                      >
                        Full playground →
                      </Link>
                    </motion.div>
                  )}

                  {usingFallback && (
                    <p className="text-[10px] text-yellow-500/70 text-center">
                      ⚠ Synth fallback — drop real MP3s in /public/sounds/
                    </p>
                  )}

                  <button
                    onClick={restart}
                    className="w-full text-[11px] text-zinc-700 hover:text-zinc-500 transition-colors"
                  >
                    ↺ Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Caption under window */}
      <p className="text-center text-xs text-zinc-600 mt-4">
        This is the free demo — 3 vibes, 3 triggers.{" "}
        <a href="#pricing" className="text-zinc-400 hover:text-white underline underline-offset-4 transition-colors">
          Unlock everything
        </a>
      </p>
    </div>
  );
}
