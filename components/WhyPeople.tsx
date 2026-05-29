"use client";

import { motion } from "framer-motion";

const REASONS = [
  {
    icon: "🎭",
    title: "Prank your friends",
    body: "Set it up before a meeting. Watch them flinch.",
  },
  {
    icon: "🎮",
    title: "Make your desk fun",
    body: "Turn boring keyboard work into a chaotic toy.",
  },
  {
    icon: "🤖",
    title: "A reactive Mac",
    body: "Your computer talks back. Loudly. With attitude.",
  },
  {
    icon: "🚀",
    title: "Zero install to test",
    body: "Open the URL, hear the chaos. Install when ready.",
  },
];

export default function WhyPeople() {
  return (
    <section className="py-20 px-4 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            Why people use it
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Built to feel <span className="text-red-400">stupid.</span>
            <br />
            <span className="text-zinc-500">Built to stay private.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 md:p-6 space-y-2 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg">
                  {r.icon}
                </div>
                <p className="text-base font-bold text-white">{r.title}</p>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
