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
import HeroDemo from "@/components/HeroDemo";
import TrustSection from "@/components/TrustSection";
import InstallButton from "@/components/InstallButton";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

const RAGE_INCREMENT = 15;
const RAGE_DECAY_RATE = 0.4;
const REACTION_DURATION = 1500;

export default function Home() {
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
  const [isMobile, setIsMobile] = useState(false);

  const { isStandalone } = usePWAInstall();

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Rage decay
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

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </span>
        <div className="hidden md:flex items-center gap-7 text-sm text-zinc-500">
          <a href="#app" className="hover:text-white transition-colors">Try it</a>
          <a href="#install" className="hover:text-white transition-colors">Install</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
        {isStandalone && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            App mode
          </span>
        )}
      </nav>

      {/* ── MOBILE HINT ── */}
      {isMobile && (
        <div className="max-w-5xl mx-auto px-6 mb-2">
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-2.5 text-center text-xs text-yellow-300/80">
            SlapBack is made for desktop. Open it on your Mac for the full experience.
          </div>
        </div>
      )}

      {/* ── 1. HOOK ── */}
      <header className="pt-10 md:pt-20 pb-12 md:pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950 text-xs text-zinc-500 font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Web app — no install required
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[4.5rem] font-black leading-[0.93] tracking-tighter">
            Choose a sound.
            <br />
            Pick a trigger.
            <br />
            <span className="text-red-400">Make your Mac scream.</span>
          </h1>
          <p className="mt-5 text-zinc-400 text-base md:text-xl max-w-lg mx-auto leading-relaxed">
            Tap your desk, press a key, or spam your clicks —{" "}
            <span className="text-white font-semibold">SlapBack reacts instantly.</span>
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#app"
              className="px-7 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              Try it now →
            </a>
            <a
              href="#install"
              className="px-7 py-3.5 rounded-2xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-all active:scale-95"
            >
              ⬇ Install as app
            </a>
          </div>
        </motion.div>
      </header>

      {/* ── 2. DEMO ── */}
      <section className="pb-16 px-4">
        <HeroDemo />
      </section>

      {/* ── 3. APP INTERACTIVE ── */}
      <section id="app" className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
        {/* Section label */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
            Try it
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Pick a sound. Pick a trigger. Go.
          </h2>
        </div>

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

          {/* Step 3 — Start */}
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
                      Click the lock icon in your address bar, allow microphone, then press Stop
                      and Start again. Or switch to a keyboard / click trigger — no mic needed.
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
                    <p className="text-[11px] text-zinc-700 text-center">
                      No audio is recorded. Local volume detection only.
                    </p>
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
                  {showSpamClickNotice && "🖱️ Click anywhere in this window 6 times in 2 seconds."}
                  {showMouseShakeNotice && "🐭 Shake your mouse rapidly inside this window."}
                </p>
              </div>
            )}

            <RageMeter level={rageLevel} />
          </div>
        </AppShell>

        {/* Mini trust strip */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
          {[
            "🔒 No audio recording",
            "⌨️ No keylogging",
            "🌐 Runs locally",
            "🎤 Mic optional",
          ].map((b) => (
            <span key={b} className="text-[11px] text-zinc-700">{b}</span>
          ))}
        </div>
      </section>

      {/* ── 4. TRUST ── */}
      <TrustSection />

      {/* ── 5. INSTALL ── */}
      <section id="install" className="py-24 px-4 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
              Install
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Install it like an app.
            </h2>
            <p className="text-zinc-400 mt-4 max-w-md mx-auto leading-relaxed">
              Keep SlapBack in your Dock and launch it like a real app.
              No DMG. No App Store. Just install the web app.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <InstallButton />
            <p className="text-xs text-zinc-600">
              Works best in Chrome, Edge, or Safari → Add to Dock on Mac.
            </p>
          </div>

          {/* How it looks */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: "🪟", title: "Standalone window", body: "Opens without browser chrome — full app feeling." },
              { icon: "🚀", title: "Dock shortcut", body: "Launch from your Dock like any other app." },
              { icon: "⚡", title: "Instant load", body: "Cached assets. Opens in under a second." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 space-y-2">
                <div className="text-2xl">{f.icon}</div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ── */}
      <Pricing />

      {/* ── 7. FAQ ── */}
      <FAQ />

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 py-10 px-4 text-center space-y-3">
        <div className="text-xl font-black">
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
