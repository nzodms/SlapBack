"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "1",
    title: "Pick a preset.",
    body: "Choose a sound and what triggers it.",
    icon: "🎯",
  },
  {
    n: "2",
    title: "Trigger it.",
    body: "Tap your desk, press a key, or spam clicks.",
    icon: "⚡",
  },
  {
    n: "3",
    title: "Your Mac reacts.",
    body: "Sound + screen shake + punchline. Instantly.",
    icon: "💥",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Three steps. Zero brain.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black text-zinc-800 leading-none tracking-tighter">
                  {step.n}
                </span>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-lg font-bold text-white">{step.title}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
