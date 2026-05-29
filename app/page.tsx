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
import { usePWAInstall } from "@/hooks/usePWAInstall";

import AppShell from "@/components/AppShell";
import SoundSelector from "@/components/SoundSelector";
import TriggerSelector from "@/components/TriggerSelector";
import RageMeter from "@/components/RageMeter";
import ReactionStage from "@/components/ReactionStage";
import InstallButton from "@/components/InstallButton";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

const RAGE_INCREMENT = 15;
const RAGE_DECAY_RATE = 0.4;
const REACTION_DURATION = 1400;

const DEMO_CARDS = [
  { icon: "🪵", action: "Tap your desk", arrow: "→", result: "scream" },
  { icon: "⎵", action: "Press Space", arrow: "→", result: "ouch" },
  { icon: "🖱️", action: "Spam clicks", arrow: "→", result: "angry voice" },
];

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
  const [isMobile, setIsMobile] = useState(false);

  const { isStandalone } = usePWAInstall();

  // Mobile detection (hint, not blocking)
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Rage decay
  useEffect(() => {
    const id = setInterval(() => {
      setRageLevel((prev) => Math.max(0, prev - RAGE_DECAY_RATE));
    }, 100);
    return () => clearInterval(id);
  }, []);

  const { loadSound, play, preview, toggleMute, isMuted, usingFallback } = useAudioPlayer();

  // Load whenever sound changes
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

  const micDetection = useMicTapDetection({
    sensitivity,
    onTap: fireTrigger,
    cooldown: 700,
  });

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

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </span>
        <div className="hidden md:flex items-center gap-7 text-sm text-zinc-500">
          <a href="#install" className="hover:text-white transition-colors">Install</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
        {isStandalone && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            App mode
          </span>
        )}
      </nav>

      {/* MOBILE HINT */}
      {isMobile && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/5 px-4 py-3 text-center text-xs text-yellow-300">
            SlapBack is made for desktop. Open it on your Mac for the full experience.
          </div>
        </div>
      )}

      {/* HERO */}
      <header className="pt-8 pb-12 md:pt-16 md:pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight"
        >
          Choose a sound.
          <br />
          Pick a trigger.
          <br />
          <span className="text-red-400">Make your Mac scream.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Pick a sound. Choose what triggers it. Then slap your desk, press a key, or spam your
          clicks — and watch your screen talk back.
        </motion.p>
      </header>

      {/* MINI DEMO CARDS */}
      <div className="max-w-3xl mx-auto px-6 mb-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEMO_CARDS.map((d, i) => (
          <motion.div
            key={d.action}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="text-xl leading-none">{d.icon}</span>
              <span className="font-semibold text-zinc-200">{d.action}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-600">{d.arrow}</span>
              <span className="text-red-400 font-bold">{d.result}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* APP */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
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

          {/* STEP 3 — start chaos */}
          <div className="mt-7 pt-6 border-t border-zinc-900 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center">
                3
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                Start chaos
              </h2>
            </div>

            {/* Mic panel */}
            {needsMic && isActive && (
              <div className="space-y-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                {micDetection.permissionDenied ? (
                  <div className="space-y-2">
                    <p className="text-sm text-red-400 font-semibold">
                      🚫 Microphone access was blocked.
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Click the lock icon in your address bar and allow microphone, then click Stop
                      and Start again. Or use a keyboard / click trigger instead — they work
                      without mic.
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
                    <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
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
                  No audio is recorded. Local volume detection only.
                </p>
              </div>
            )}

            {(showKeyboardNotice || showSpamClickNotice || showMouseShakeNotice) && (
              <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
                <p className="text-xs text-zinc-400">
                  {showKeyboardNotice && "⌨️ Press your trigger key in this window."}
                  {showSpamClickNotice && "🖱️ Click anywhere 6 times in 2 seconds."}
                  {showMouseShakeNotice && "🐭 Shake your mouse fast inside this window."}
                </p>
              </div>
            )}

            <RageMeter level={rageLevel} />
          </div>
        </AppShell>

        {/* Trust strip */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
          {[
            "🔒 No audio recording",
            "⌨️ No keylogging",
            "🌐 Runs locally",
            "📦 No install required",
            "🎤 Mic optional",
          ].map((b) => (
            <span key={b} className="text-[11px] text-zinc-600">
              {b}
            </span>
          ))}
        </div>
      </main>

      {/* INSTALL SECTION */}
      <section id="install" className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            Install
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Install it like an app.</h2>
          <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Keep SlapBack in your Dock and launch it like a real app. No DMG. No App Store. Just
            install the web app.
          </p>
          <div className="flex justify-center pt-2">
            <InstallButton />
          </div>
          <p className="text-xs text-zinc-600">
            Works best in Chrome, Edge, or Safari → Add to Dock on Mac.
          </p>
        </div>
      </section>

      {/* PRIVACY/TRUST ZONE */}
      <section className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto rounded-3xl border border-zinc-900 bg-gradient-to-b from-zinc-950 to-black p-8 md:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-lg">
              🔒
            </div>
            <h3 className="text-xl font-black">No keylogging. No audio recording. Local only.</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            SlapBack never records your microphone. It only detects sudden volume peaks locally in
            your browser. It never reads what you type. It only reacts to selected keys and
            interaction patterns while the app is open.
          </p>
        </div>
      </section>

      <Pricing />
      <FAQ />

      <footer className="border-t border-zinc-900 py-10 px-4 text-center space-y-3">
        <div className="text-lg font-black">
          <span className="text-red-400">Slap</span>Back
        </div>
        <div className="flex justify-center gap-6 text-xs text-zinc-700">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
          <a href="#faq" className="hover:text-zinc-400 transition-colors">FAQ</a>
        </div>
        <p className="text-xs text-zinc-800">© {new Date().getFullYear()} SlapBack.</p>
      </footer>
    </div>
  );
}
