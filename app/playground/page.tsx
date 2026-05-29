"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { SOUNDS } from "@/lib/sounds";
import { TriggerType, isKeyboardTrigger } from "@/lib/triggers";
import { getRandomPunchline, getRandomImpact, getRandomRageMaxPunchline } from "@/lib/reactions";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useMicTapDetection } from "@/hooks/useMicTapDetection";
import { useKeyboardTrigger } from "@/hooks/useKeyboardTrigger";
import { useSpamClick } from "@/hooks/useSpamClick";
import { useMouseShake } from "@/hooks/useMouseShake";

import AppShell from "@/components/AppShell";
import SoundSelector from "@/components/SoundSelector";
import TriggerSelector from "@/components/TriggerSelector";
import RageMeter from "@/components/RageMeter";
import ReactionStage from "@/components/ReactionStage";

const RAGE_INCREMENT = 15;
const RAGE_DECAY_RATE = 0.4;
const REACTION_DURATION = 1500;

export default function PlaygroundPage() {
  const [selectedSound, setSelectedSound] = useState("quick-scream");
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>("mic-tap");
  const [isActive, setIsActive] = useState(false);
  const [sensitivity, setSensitivity] = useState(65);
  const [rageLevel, setRageLevel] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [reaction, setReaction] = useState<{
    impact: string;
    punchline: string;
    key: number;
    isRageMax: boolean;
  } | null>(null);

  useEffect(() => {
    const id = setInterval(() => setRageLevel((p) => Math.max(0, p - RAGE_DECAY_RATE)), 100);
    return () => clearInterval(id);
  }, []);

  const { loadSound, play, preview, toggleMute, isMuted, usingFallback } = useAudioPlayer();

  useEffect(() => {
    const sound = SOUNDS.find((s) => s.id === selectedSound);
    if (sound) loadSound(sound.id, sound.file);
  }, [selectedSound, loadSound]);

  const fireTrigger = useCallback(() => {
    if (!isActive) return;
    play();
    setRageLevel((prev) => {
      const next = Math.min(100, prev + RAGE_INCREMENT);
      const isRageMax = next >= 100;
      setReaction({
        impact: getRandomImpact(),
        punchline: isRageMax ? getRandomRageMaxPunchline() : getRandomPunchline(),
        key: Date.now(),
        isRageMax,
      });
      setIsShaking(true);
      setTimeout(() => setReaction(null), REACTION_DURATION);
      setTimeout(() => setIsShaking(false), 500);
      return next;
    });
  }, [isActive, play]);

  const micDetection = useMicTapDetection({ sensitivity, onTap: fireTrigger, cooldown: 700 });

  const { isCapturing, startCapture, capturedKey } = useKeyboardTrigger({
    trigger: selectedTrigger,
    onTrigger: fireTrigger,
    active: isActive && isKeyboardTrigger(selectedTrigger),
  });

  useSpamClick({ onSpam: fireTrigger, active: isActive && selectedTrigger === "spam-click" });
  useMouseShake({ onShake: fireTrigger, active: isActive && selectedTrigger === "mouse-shake" });

  const handleStart = useCallback(async () => {
    if (isActive) {
      micDetection.stop();
      setIsActive(false);
    } else {
      setIsActive(true);
      if (selectedTrigger === "mic-tap") await micDetection.start();
    }
  }, [isActive, selectedTrigger, micDetection]);

  const handleTriggerSelect = useCallback(
    (t: TriggerType) => {
      if (isActive) { micDetection.stop(); setIsActive(false); }
      setSelectedTrigger(t);
    },
    [isActive, micDetection]
  );

  const needsMic = selectedTrigger === "mic-tap";
  const startDisabled = selectedTrigger === "custom-key" && !capturedKey;
  const showKeyboardNotice = isActive && isKeyboardTrigger(selectedTrigger);
  const showSpamClickNotice = isActive && selectedTrigger === "spam-click";
  const showMouseShakeNotice = isActive && selectedTrigger === "mouse-shake";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30">
      <ReactionStage
        impact={reaction?.impact ?? null}
        punchline={reaction?.punchline ?? null}
        reactionKey={reaction?.key ?? 0}
        isRageMax={reaction?.isRageMax ?? false}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Playground
          </span>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            ← Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-4 pb-8 px-6 text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
          Full playground
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          All sounds. All triggers.
        </h1>
        <p className="mt-3 text-zinc-500 max-w-md mx-auto text-sm">
          Mix any of the 10 sounds with any of the 8 triggers. Tweak everything.
        </p>
      </header>

      {/* App */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
        <AppShell
          isActive={isActive}
          isMuted={isMuted}
          isShaking={isShaking}
          rageLevel={rageLevel}
          onToggleStart={handleStart}
          onToggleMute={toggleMute}
          startDisabled={startDisabled}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <SoundSelector
              selected={selectedSound}
              onSelect={setSelectedSound}
              onPreview={preview}
              usingFallback={usingFallback}
            />
            <TriggerSelector
              selected={selectedTrigger}
              onSelect={handleTriggerSelect}
              customKey={capturedKey}
              onCaptureKey={startCapture}
              isCapturing={isCapturing}
            />
          </div>

          <div className="mt-7 pt-6 border-t border-zinc-900 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center">
                3
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                Start chaos
              </h2>
            </div>

            {needsMic && isActive && (
              <div className="space-y-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                {micDetection.permissionDenied ? (
                  <div className="space-y-2">
                    <p className="text-sm text-red-400 font-semibold">
                      🚫 Microphone access was blocked.
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Click the lock icon in your address bar, allow microphone, then press Stop
                      and Start again.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Mic level
                      </span>
                      <span className="text-[11px] text-zinc-600">
                        {micDetection.volumeLevel > 0.6
                          ? "🔴 peak"
                          : micDetection.volumeLevel > 0.3
                          ? "🟡"
                          : "🟢"}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                        animate={{ width: `${Math.min(100, micDetection.volumeLevel * 100)}%` }}
                        transition={{ duration: 0.05, ease: "linear" }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Sensitivity</span>
                        <span className="font-mono">{sensitivity}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={sensitivity}
                        onChange={(e) => setSensitivity(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {needsMic && !isActive && (
              <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
                <p className="text-sm text-zinc-300 font-medium">
                  🎤 SlapBack will request mic access when you press Start.
                </p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  No audio is recorded. Local detection only.
                </p>
              </div>
            )}

            {(showKeyboardNotice || showSpamClickNotice || showMouseShakeNotice) && (
              <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
                <p className="text-xs text-zinc-400">
                  {showKeyboardNotice && "⌨️ Press your trigger key while this window is focused."}
                  {showSpamClickNotice && "🖱️ Click anywhere 6 times in 2 seconds."}
                  {showMouseShakeNotice && "🐭 Shake your mouse rapidly inside this window."}
                </p>
              </div>
            )}

            <RageMeter level={rageLevel} />
          </div>
        </AppShell>

        <div className="mt-6 text-center">
          <Link
            href="/#pricing"
            className="inline-block text-xs text-zinc-600 hover:text-white transition-colors underline underline-offset-4"
          >
            Unlock all features with SlapBack Pro →
          </Link>
        </div>
      </main>
    </div>
  );
}
