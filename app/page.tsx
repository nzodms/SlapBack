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

import SoundSelector from "@/components/SoundSelector";
import TriggerSelector from "@/components/TriggerSelector";
import MicTapDetector from "@/components/MicTapDetector";
import RageMeter from "@/components/RageMeter";
import ReactionOverlay from "@/components/ReactionOverlay";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

const RAGE_INCREMENT = 15;
const RAGE_DECAY_RATE = 0.4; // per 100ms
const REACTION_DURATION = 1400; // ms

export default function Home() {
  const [selectedSound, setSelectedSound] = useState("scream-short");
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

  // Rage decay over time
  useEffect(() => {
    const id = setInterval(() => {
      setRageLevel((prev) => Math.max(0, prev - RAGE_DECAY_RATE));
    }, 100);
    return () => clearInterval(id);
  }, []);

  const { loadSound, play, preview, toggleMute, isMuted, hasError } = useAudioPlayer();

  // Reload audio when sound selection changes
  useEffect(() => {
    const sound = SOUNDS.find((s) => s.id === selectedSound);
    if (sound) loadSound(sound.file);
  }, [selectedSound, loadSound]);

  const onTriggerFired = useCallback(() => {
    if (!isActive) return;

    play();

    setRageLevel((prev) => {
      const next = Math.min(100, prev + RAGE_INCREMENT);
      const isRageMax = next >= 100;

      const impact = getRandomImpact();
      const punchline = isRageMax ? getRandomRageMaxPunchline() : getRandomPunchline();

      setReaction({ impact, punchline, key: Date.now(), isRageMax });
      setIsShaking(true);
      setTimeout(() => setReaction(null), REACTION_DURATION);
      setTimeout(() => setIsShaking(false), 500);

      return next;
    });
  }, [isActive, play]);

  // Mic tap detection
  const micDetection = useMicTapDetection({
    sensitivity,
    onTap: onTriggerFired,
    cooldown: 700,
  });

  // Keyboard triggers
  const { isCapturing, startCapture, capturedKey } = useKeyboardTrigger({
    trigger: selectedTrigger,
    onTrigger: onTriggerFired,
    active: isActive && isKeyboardTrigger(selectedTrigger),
  });

  // Spam click
  useSpamClick({
    onSpam: onTriggerFired,
    active: isActive && selectedTrigger === "spam-click",
  });

  // Mouse shake
  useMouseShake({
    onShake: onTriggerFired,
    active: isActive && selectedTrigger === "mouse-shake",
  });

  const handleStart = useCallback(async () => {
    if (isActive) {
      micDetection.stop();
      setIsActive(false);
    } else {
      setIsActive(true);
      if (selectedTrigger === "mic-tap") {
        await micDetection.start();
      }
    }
  }, [isActive, selectedTrigger, micDetection]);

  const handleTriggerSelect = useCallback(
    (t: TriggerType) => {
      if (isActive) {
        micDetection.stop();
        setIsActive(false);
      }
      setSelectedTrigger(t);
    },
    [isActive, micDetection]
  );

  const needsMic = selectedTrigger === "mic-tap";
  const showKeyboardNotice = isActive && isKeyboardTrigger(selectedTrigger);
  const showSpamClickNotice = isActive && selectedTrigger === "spam-click";
  const showMouseShakeNotice = isActive && selectedTrigger === "mouse-shake";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Reaction overlay */}
      <ReactionOverlay
        impact={reaction?.impact ?? null}
        punchline={reaction?.punchline ?? null}
        reactionKey={reaction?.key ?? 0}
        isRageMax={reaction?.isRageMax ?? false}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </span>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-12 pb-16 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
            Choose a sound.
            <br />
            Pick a trigger.
            <br />
            <span className="text-red-400">Make your Mac scream.</span>
          </h1>
          <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            No install. Open SlapBack, tap your desk, press a key, or spam your clicks — and watch
            your screen talk back.
          </p>
        </motion.div>
      </header>

      {/* App card */}
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          animate={
            isShaking
              ? {
                  x: [0, -10, 10, -7, 7, -4, 4, -2, 2, 0],
                  y: [0, 4, -4, 3, -3, 2, -2, 0],
                }
              : { x: 0, y: 0 }
          }
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden"
        >
          {/* Card header — status + controls */}
          <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isActive ? "bg-green-400 animate-pulse" : "bg-zinc-700"
                }`}
              />
              <span className="text-sm font-semibold text-zinc-400">
                {isActive ? "Active" : "Paused"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-white transition-all"
              >
                {isMuted ? "🔇" : "🔊"}
              </button>

              <button
                onClick={handleStart}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/20"
                }`}
              >
                {isActive ? "⏹ Stop" : "▶ Start"}
              </button>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-10 py-8">
            <SoundSelector
              selected={selectedSound}
              onSelect={setSelectedSound}
              onPreview={preview}
              hasError={hasError}
            />
            <TriggerSelector
              selected={selectedTrigger}
              onSelect={handleTriggerSelect}
              customKey={capturedKey}
              onCaptureKey={startCapture}
              isCapturing={isCapturing}
            />
          </div>

          {/* Contextual panels */}
          <div className="px-6 md:px-10 pb-8 space-y-4">
            {/* Mic visualizer — only while active and mic trigger selected */}
            {needsMic && isActive && (
              <MicTapDetector
                volumeLevel={micDetection.volumeLevel}
                sensitivity={sensitivity}
                onSensitivityChange={setSensitivity}
                permissionDenied={micDetection.permissionDenied}
              />
            )}

            {/* Micro CTA — mic trigger, not yet started */}
            {needsMic && !isActive && (
              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 text-center space-y-1">
                <p className="text-sm text-zinc-400 font-medium">
                  🎤 SlapBack demandera accès à ton micro au démarrage.
                </p>
                <p className="text-xs text-zinc-600">
                  Aucun audio n&apos;est enregistré — détection locale uniquement.
                </p>
              </div>
            )}

            {/* Context notice for keyboard / click / shake triggers */}
            {(showKeyboardNotice || showSpamClickNotice || showMouseShakeNotice) && (
              <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-center">
                <p className="text-xs text-zinc-500">
                  {showKeyboardNotice &&
                    "⌨️ Le déclencheur clavier fonctionne uniquement quand cette page est active dans ton navigateur."}
                  {showSpamClickNotice &&
                    "🖱️ Clique 6 fois en 2 secondes n'importe où dans la page pour déclencher."}
                  {showMouseShakeNotice &&
                    "🐭 Secoue ta souris rapidement dans la page pour déclencher."}
                </p>
              </div>
            )}

            {/* Rage meter */}
            <RageMeter level={rageLevel} />
          </div>
        </motion.div>

        {/* Privacy badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            "🔒 No audio recorded",
            "⌨️ No keylogging",
            "🌐 Runs locally",
            "📦 No install",
            "🎤 Mic optional",
          ].map((b) => (
            <span key={b} className="text-xs text-zinc-700">
              {b}
            </span>
          ))}
        </div>
      </main>

      <Pricing />
      <FAQ />

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 px-4 text-center space-y-3">
        <div className="text-lg font-black">
          <span className="text-red-400">Slap</span>Back
        </div>
        <div className="flex justify-center gap-6 text-xs text-zinc-700">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">
            Terms
          </Link>
          <a href="#faq" className="hover:text-zinc-400 transition-colors">
            FAQ
          </a>
        </div>
        <p className="text-xs text-zinc-800">© {new Date().getFullYear()} SlapBack. All rights reserved.</p>
      </footer>
    </div>
  );
}
