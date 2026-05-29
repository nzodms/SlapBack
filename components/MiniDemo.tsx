"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SOUNDS } from "@/lib/sounds";
import { getRandomImpact } from "@/lib/reactions";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useMicTapDetection } from "@/hooks/useMicTapDetection";
import { useKeyboardTrigger } from "@/hooks/useKeyboardTrigger";
import { useSpamClick } from "@/hooks/useSpamClick";

type PresetId = "tap-scream" | "space-ouch" | "spam-angry";

interface Preset {
  id: PresetId;
  icon: string;
  trigger: string;
  hint: string;
  soundId: string;
  soundLabel: string;
  impact: string;
  color: string;
  glow: string;
  border: string;
  bg: string;
}

const PRESETS: Preset[] = [
  {
    id: "tap-scream",
    icon: "🪵",
    trigger: "Tap your desk",
    hint: "Detected via mic",
    soundId: "quick-scream",
    soundLabel: "Quick Scream",
    impact: "SLAP!",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.3)",
    border: "rgba(239,68,68,0.5)",
    bg: "rgba(239,68,68,0.08)",
  },
  {
    id: "space-ouch",
    icon: "⎵",
    trigger: "Press Space",
    hint: "While window is focused",
    soundId: "ouch",
    soundLabel: "Ouch",
    impact: "OUCH!",
    color: "#facc15",
    glow: "rgba(250,204,21,0.3)",
    border: "rgba(250,204,21,0.5)",
    bg: "rgba(250,204,21,0.08)",
  },
  {
    id: "spam-angry",
    icon: "🖱️",
    trigger: "Spam clicks",
    hint: "6 clicks in 2 seconds",
    soundId: "angry-voice",
    soundLabel: "Angry Voice",
    impact: "STOP IT!",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    border: "rgba(167,139,250,0.5)",
    bg: "rgba(167,139,250,0.08)",
  },
];

const PUNCHLINES: Record<PresetId, string> = {
  "tap-scream": "Ton Mac n'a rien demandé.",
  "space-ouch": "Doucement, c'est un clavier.",
  "spam-angry": "Le bouton a compris la première fois.",
};

const RAGE_INC = 25;
const RAGE_DECAY = 0.5;

export default function MiniDemo() {
  const [selected, setSelected] = useState<PresetId>("tap-scream");
  const [isActive, setIsActive] = useState(false);
  const [rage, setRage] = useState(0);
  const [reaction, setReaction] = useState<{ impact: string; key: number } | null>(null);
  const [shake, setShake] = useState(false);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const preset = PRESETS.find((p) => p.id === selected)!;

  const { loadSound, play, preview, usingFallback } = useAudioPlayer();

  useEffect(() => {
    const s = SOUNDS.find((sd) => sd.id === preset.soundId);
    if (s) loadSound(s.id, s.file);
  }, [preset.soundId, loadSound]);

  // Rage decay
  useEffect(() => {
    const id = setInterval(() => setRage((r) => Math.max(0, r - RAGE_DECAY)), 100);
    return () => clearInterval(id);
  }, []);

  const fireReaction = useCallback(() => {
    if (!isActive) return;
    play();
    setRage((r) => Math.min(100, r + RAGE_INC));
    setReaction({ impact: getRandomImpact() || preset.impact, key: Date.now() });
    setShake(true);
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => setReaction(null), 1100);
    setTimeout(() => setShake(false), 450);
  }, [isActive, play, preset.impact]);

  // Triggers
  const mic = useMicTapDetection({
    sensitivity: 70,
    onTap: fireReaction,
    cooldown: 600,
  });

  useKeyboardTrigger({
    trigger: "space-key",
    onTrigger: fireReaction,
    active: isActive && selected === "space-ouch",
  });

  useSpamClick({
    onSpam: fireReaction,
    active: isActive && selected === "spam-angry",
    clickThreshold: 6,
    timeWindow: 2000,
  });

  const handleStart = useCallback(async () => {
    if (isActive) {
      mic.stop();
      setIsActive(false);
      return;
    }
    setIsActive(true);
    if (selected === "tap-scream") await mic.start();
  }, [isActive, selected, mic]);

  const handleSelectPreset = useCallback((id: PresetId) => {
    if (isActive) {
      mic.stop();
      setIsActive(false);
    }
    setSelected(id);
  }, [isActive, mic]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mac window card */}
      <motion.div
        animate={shake ? { x: [0, -10, 10, -6, 6, 0], y: [0, 3, -3, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative rounded-[24px] border bg-zinc-950 overflow-hidden"
        style={{
          borderColor: isActive ? preset.border : "rgba(63,63,70,0.6)",
          boxShadow: isActive
            ? `0 0 60px ${preset.glow}, 0 0 0 1px ${preset.border}`
            : "0 20px 60px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.4s, border-color 0.4s",
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="flex-1 text-center text-xs text-zinc-600 font-medium tracking-wide select-none">
            SlapBack — Demo
          </span>
          {isActive && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: preset.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: preset.color }} />
              Active
            </motion.span>
          )}
        </div>

        {/* Presets row */}
        <div className="px-5 pt-5 pb-3 grid grid-cols-3 gap-2.5">
          {PRESETS.map((p) => {
            const sel = p.id === selected;
            return (
              <motion.button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                className="relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all"
                style={{
                  borderColor: sel ? p.border : "rgb(39,39,42)",
                  background: sel ? p.bg : "rgba(24,24,27,0.6)",
                }}
              >
                <span className="text-2xl leading-none">{p.icon}</span>
                <span className={`text-[11px] font-bold tracking-tight ${sel ? "text-white" : "text-zinc-400"}`}>
                  {p.trigger}
                </span>
                <span className="text-[10px] text-zinc-600 leading-tight">
                  → {p.soundLabel}
                </span>
                {sel && (
                  <motion.span
                    layoutId="preset-marker"
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ background: p.color }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Reaction stage */}
        <div className="relative h-44 md:h-52 mx-5 mb-4 rounded-2xl border border-zinc-900 bg-gradient-to-b from-black to-zinc-950 overflow-hidden flex items-center justify-center">
          {/* Glow on reaction */}
          <AnimatePresence>
            {reaction && (
              <motion.div
                key={`g-${reaction.key}`}
                initial={{ opacity: 0.7, scale: 0.4 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${preset.glow} 0%, transparent 70%)`,
                }}
              />
            )}
          </AnimatePresence>

          {/* Idle state */}
          {!reaction && !isActive && (
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <div className="text-4xl opacity-30">{preset.icon}</div>
              <p className="text-sm text-zinc-500 font-medium">
                {preset.trigger} <span className="text-zinc-700">→</span>{" "}
                <span style={{ color: preset.color }}>{preset.soundLabel}</span>
              </p>
              <p className="text-[11px] text-zinc-700">{preset.hint}</p>
            </div>
          )}

          {/* Active waiting state */}
          {!reaction && isActive && (
            <div className="flex flex-col items-center gap-3">
              {selected === "tap-scream" && mic.permissionDenied ? (
                <div className="text-center px-4">
                  <p className="text-sm font-semibold text-red-400">Mic blocked</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Allow mic in your browser, or try a different preset.
                  </p>
                </div>
              ) : selected === "tap-scream" ? (
                <>
                  {/* Sound wave */}
                  <div className="flex items-end gap-1 h-10">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 rounded-full"
                        style={{ background: preset.color }}
                        animate={{ height: [6, 30 * (0.4 + mic.volumeLevel), 6] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">Listening… tap your desk</p>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="text-3xl"
                  >
                    {preset.icon}
                  </motion.div>
                  <p className="text-xs text-zinc-500">
                    Ready — {selected === "space-ouch" ? "press Space" : "spam click anywhere"}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Reaction impact */}
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
                    color: preset.color,
                    textShadow: `0 0 50px ${preset.glow}, 0 6px 24px rgba(0,0,0,0.7)`,
                  }}
                >
                  {reaction.impact}
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 text-xs md:text-sm font-semibold text-zinc-300 text-center"
                >
                  {PUNCHLINES[selected]}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar — controls + rage meter */}
        <div className="px-5 pb-5 space-y-3">
          {/* Rage meter mini */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex-shrink-0">
              Rage
            </span>
            <div className="flex-1 h-2 rounded-full bg-zinc-900 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${rage}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{
                  background: rage > 70
                    ? "linear-gradient(90deg, #facc15, #ef4444)"
                    : rage > 30
                    ? "linear-gradient(90deg, #4ade80, #facc15)"
                    : preset.color,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-600 w-8 text-right">
              {Math.round(rage)}%
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={preview}
              className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 text-xs font-bold hover:border-zinc-600 hover:text-white transition-all active:scale-95"
            >
              ▶ Preview sound
            </button>
            <button
              onClick={handleStart}
              className="flex-[2] py-2.5 rounded-xl font-bold text-xs text-white transition-all active:scale-95"
              style={{
                background: isActive ? "rgb(39,39,42)" : preset.color,
                boxShadow: isActive ? "none" : `0 8px 28px ${preset.glow}`,
              }}
            >
              {isActive ? "■ Stop demo" : "▶ Start demo"}
            </button>
          </div>

          {usingFallback && (
            <p className="text-[10px] text-yellow-500/70 text-center">
              ⚠ Synth fallback — real sound coming soon
            </p>
          )}
        </div>
      </motion.div>

      {/* Helper text */}
      <p className="text-center text-xs text-zinc-600 mt-4">
        This is the demo. Want all 10 sounds + 8 triggers?{" "}
        <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4">
          Get Pro
        </a>
      </p>
    </div>
  );
}
