"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { usePWAInstall } from "@/hooks/usePWAInstall";

import MiniDemo from "@/components/MiniDemo";
import HowItWorks from "@/components/HowItWorks";
import WhyPeople from "@/components/WhyPeople";
import TrustSection from "@/components/TrustSection";
import InstallButton from "@/components/InstallButton";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

const TRUST_BADGES = [
  "No audio recording",
  "No keylogging",
  "Local only",
  "No install needed to test",
  "Installable app",
  "One-time payment",
];

export default function Home() {
  const { isStandalone } = usePWAInstall();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30 overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </span>
        <div className="hidden md:flex items-center gap-7 text-sm text-zinc-500">
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#install" className="hover:text-white transition-colors">Install</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/playground" className="hover:text-white transition-colors">Playground</Link>
        </div>
        {isStandalone && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            App mode
          </span>
        )}
      </nav>

      {isMobile && (
        <div className="max-w-5xl mx-auto px-6 mb-2">
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-2.5 text-center text-xs text-yellow-300/80">
            SlapBack is made for desktop. Open it on your Mac for the full experience.
          </div>
        </div>
      )}

      {/* ── 1. HERO ── */}
      <header className="pt-10 md:pt-20 pb-10 md:pb-12 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950 text-xs text-zinc-500 font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Web app — no install required
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Make your Mac
            <br />
            <span className="text-red-400">scream.</span>
          </h1>

          <p className="mt-6 text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Pick a sound. Pick a trigger. Tap your desk, press a key, or spam your clicks —{" "}
            <span className="text-white font-semibold">SlapBack reacts instantly.</span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#demo"
              className="px-7 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              Try the demo →
            </a>
            <a
              href="#install"
              className="px-7 py-3.5 rounded-2xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-all active:scale-95"
            >
              ⬇ Install SlapBack
            </a>
          </div>

          <p className="mt-6 text-xs text-zinc-600">
            No audio recording. No keylogging. Runs locally.
          </p>
        </motion.div>
      </header>

      {/* ── TRUST BAR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto px-6 mb-14"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-4 border-y border-zinc-900">
          {TRUST_BADGES.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              {b}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── 2. MINI DEMO ── */}
      <section id="demo" className="pb-20 px-4">
        <div className="text-center mb-8 max-w-xl mx-auto px-2">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
            Demo
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Pick a preset. Trigger it. Done.
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            3 presets out of 80+ combinations. Get a real feel of the chaos.
          </p>
        </div>

        <MiniDemo />
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── 4. WHY PEOPLE USE IT ── */}
      <WhyPeople />

      {/* ── 5. TRUST ── */}
      <TrustSection />

      {/* ── 6. INSTALL ── */}
      <section id="install" className="py-24 px-4 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
              Install
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Install it like an app.
            </h2>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Opens like a real app. No DMG. No App Store.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <InstallButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto pt-4">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 space-y-1.5">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Chrome / Edge</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Click the install icon in the address bar → Confirm → Launch from Dock.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 space-y-1.5">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Safari Mac</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Share → Add to Dock → Launch from Dock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. PRICING ── */}
      <Pricing />

      {/* ── 8. FAQ ── */}
      <FAQ />

      {/* ── PLAYGROUND CTA ── */}
      <section className="py-16 px-4 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto rounded-3xl border border-zinc-900 bg-zinc-950 p-8 md:p-10 text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Tinkerer?</p>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">
            Want all sounds + all triggers?
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Open the full playground to mix and match every combination — no signup required.
          </p>
          <div className="pt-2">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-700 text-zinc-200 font-bold text-sm hover:border-white hover:text-white transition-all active:scale-95"
            >
              Open playground →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 py-10 px-4 text-center space-y-3 mt-8">
        <div className="text-xl font-black">
          <span className="text-red-400">Slap</span>Back
        </div>
        <div className="flex justify-center gap-6 text-xs text-zinc-700">
          <Link href="/playground" className="hover:text-zinc-400 transition-colors">Playground</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
          <a href="#faq" className="hover:text-zinc-400 transition-colors">FAQ</a>
        </div>
        <p className="text-xs text-zinc-800">© {new Date().getFullYear()} SlapBack.</p>
      </footer>
    </div>
  );
}
