"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import OnboardingDemo from "@/components/OnboardingDemo";
import HowItWorks from "@/components/HowItWorks";
import WhyPeople from "@/components/WhyPeople";
import TrustSection from "@/components/TrustSection";
import DownloadButton from "@/components/DownloadButton";
import InstallGuide from "@/components/InstallGuide";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import { DOWNLOAD_READY, TRUST_LINE, SOURCE_NOTE } from "@/lib/download";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30 overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto relative z-10">
        <span className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </span>
        <div className="hidden md:flex items-center gap-7 text-sm text-zinc-500">
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#download" className="hover:text-white transition-colors">Download</a>
          <Link href="/install" className="hover:text-white transition-colors">Install guide</Link>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/playground" className="hover:text-white transition-colors">Playground</Link>
        </div>
      </nav>

      {isMobile && (
        <div className="max-w-5xl mx-auto px-6 mb-2">
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-2.5 text-center text-xs text-yellow-300/80">
            SlapBack is made for desktop. Open it on your Mac for the full experience.
          </div>
        </div>
      )}

      {/* ── HERO (cinematic) ── */}
      <header className="relative pt-10 md:pt-16 pb-12 px-6 text-center max-w-3xl mx-auto">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center -z-0">
          <div className="w-[500px] h-[300px] rounded-full bg-red-500/10 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur text-xs text-zinc-400 font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Native Mac app — {DOWNLOAD_READY ? "download now" : "beta coming soon"}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Make your Mac
            <br />
            <span className="text-red-400">scream.</span>
          </h1>

          <p className="mt-6 text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Pick a sound. Pick a trigger. SlapBack turns your Mac into a{" "}
            <span className="text-white font-semibold">reactive little chaos machine.</span>
          </p>

          <div className="mt-8 flex justify-center">
            <DownloadButton variant="hero" withGuideLink />
          </div>

          <div className="mt-5">
            <a
              href="#demo"
              className="text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
            >
              Or try the free web demo →
            </a>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            No recording. No keylogging. Runs locally. {TRUST_LINE}
          </p>
        </motion.div>
      </header>

      {/* ── ONBOARDING DEMO ── */}
      <section id="demo" className="pb-20 px-4 relative z-10">
        <OnboardingDemo />
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── WHY PEOPLE ── */}
      <WhyPeople />

      {/* ── TRUST ── */}
      <TrustSection />

      {/* ── DOWNLOAD ── */}
      <section id="download" className="py-24 px-4 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">Download</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Download the Mac app.
            </h2>
            <p className="text-zinc-400 mt-4 leading-relaxed max-w-md mx-auto">
              Direct Mac download. No App Store required. Runs from your menu bar and reacts to
              triggers system-wide — not just in a browser tab.
            </p>
          </div>

          <div className="flex justify-center">
            <DownloadButton variant="hero" withGuideLink />
          </div>

          <p className="text-[11px] text-zinc-600">{TRUST_LINE}</p>

          {/* Quick 6-step preview */}
          <div className="text-left max-w-lg mx-auto pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3 text-center">
              How install works
            </p>
            <InstallGuide compact />
          </div>

          {/* Honest coming-soon explainer */}
          {!DOWNLOAD_READY && (
            <div className="rounded-3xl border border-yellow-400/15 bg-yellow-400/5 p-6 text-left space-y-2 max-w-lg mx-auto">
              <p className="text-sm font-bold text-yellow-300">
                Why does the button say “coming soon”?
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">{SOURCE_NOTE}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-600 pt-2">
            <span>🚫 No recording</span>
            <span>🚫 No keylogging</span>
            <span>📡 No network</span>
            <span>🔒 100% local</span>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <Pricing />

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent p-8 md:p-12 text-center space-y-5">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight">
            Ready to make your Mac scream?
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Download the Mac app, or try the free web demo first.
          </p>
          <div className="flex justify-center pt-2">
            <DownloadButton variant="hero" withGuideLink />
          </div>
          <div className="pt-1">
            <a
              href="#demo"
              className="text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
            >
              Or try the free web demo →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 py-10 px-4 text-center space-y-3">
        <div className="text-xl font-black">
          <span className="text-red-400">Slap</span>Back
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-700">
          <Link href="/install" className="hover:text-zinc-400 transition-colors">Install guide</Link>
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
