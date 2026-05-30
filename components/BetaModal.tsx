"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BETA_MODAL_TITLE, BETA_MODAL_BODY, SOURCE_NOTE } from "@/lib/download";

export default function BetaModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    // No backend yet — store locally so we don't lose early signups,
    // and so the button never feels broken.
    try {
      const list = JSON.parse(localStorage.getItem("slapback-beta") || "[]");
      list.push({ email, at: Date.now() });
      localStorage.setItem("slapback-beta", JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0e0e0e] p-7 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-600 hover:text-white text-sm"
              aria-label="Close"
            >
              ✕
            </button>

            {!submitted ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    Beta
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-white">
                    {BETA_MODAL_TITLE}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{BETA_MODAL_BODY}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all active:scale-95 shadow-lg shadow-red-500/30"
                  >
                    Join Mac beta →
                  </button>
                </form>

                <div className="pt-3 border-t border-zinc-900">
                  <p className="text-[11px] text-zinc-600 leading-relaxed">{SOURCE_NOTE}</p>
                  <Link
                    href="/install"
                    className="inline-block mt-2 text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    View install guide →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-2xl font-black tracking-tight text-white">You&apos;re on the list.</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  We&apos;ll email you the moment the Mac build is ready to download.
                </p>
                <Link
                  href="/install"
                  className="inline-block text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Meanwhile, read the install guide →
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
