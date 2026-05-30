"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import InstallGuide from "@/components/InstallGuide";
import DownloadButton from "@/components/DownloadButton";
import { DOWNLOAD_READY, TRUST_LINE, SOURCE_NOTE } from "@/lib/download";

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="text-xl font-black tracking-tight">
          <span className="text-red-400">Slap</span>Back
        </Link>
        <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
          ← Home
        </Link>
      </nav>

      {/* Header */}
      <header className="pt-8 pb-10 px-6 text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
          Install guide
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Get SlapBack on your Mac.
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Direct Mac download. No App Store required. Six steps and your Mac starts reacting.
        </p>

        <div className="mt-8 flex justify-center">
          <DownloadButton variant="hero" withGuideLink={false} />
        </div>

        {!DOWNLOAD_READY && (
          <p className="mt-4 text-xs text-yellow-300/70">
            Mac app coming soon — join the beta to get the download link.
          </p>
        )}

        <p className="mt-3 text-[11px] text-zinc-600">{TRUST_LINE}</p>
      </header>

      {/* Steps */}
      <main className="max-w-2xl mx-auto px-4 md:px-6 pb-16">
        <InstallGuide />

        {/* Permissions detail */}
        <div className="mt-10 rounded-3xl border border-zinc-900 bg-gradient-to-b from-zinc-950 to-transparent p-6 md:p-7 space-y-4">
          <h2 className="text-lg font-black tracking-tight">About permissions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4 space-y-1.5">
              <p className="text-sm font-bold text-white flex items-center gap-2">⌨️ Accessibility</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Lets SlapBack detect your trigger key or click pattern system-wide. It only listens
                for the trigger you chose — never logs or stores what you type.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4 space-y-1.5">
              <p className="text-sm font-bold text-white flex items-center gap-2">🎤 Microphone</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Optional. Used only for desk-tap presets to detect volume spikes. No audio is ever
                recorded, stored, or sent anywhere.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-zinc-600 pt-1">
            <span>🚫 No recording</span>
            <span>🚫 No keylogging</span>
            <span>📡 No network</span>
            <span>🔒 100% local</span>
          </div>
        </div>

        {/* Source / coming soon explainer */}
        {!DOWNLOAD_READY && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 rounded-3xl border border-yellow-400/15 bg-yellow-400/5 p-6 space-y-3"
          >
            <p className="text-sm font-bold text-yellow-300">Why does the button say “coming soon”?</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{SOURCE_NOTE}</p>
            <a
              href="https://github.com/nzodms/SlapBack/tree/main/macos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-yellow-300/80 hover:text-yellow-200 underline underline-offset-4 transition-colors"
            >
              Build it from source (macOS README) →
            </a>
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-600 hover:text-white transition-colors underline underline-offset-4"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
