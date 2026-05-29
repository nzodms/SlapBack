"use client";
import { motion } from "framer-motion";

const TRUST_ITEMS = [
  {
    icon: "🔒",
    title: "No audio recording",
    body: "Your mic is read-only. We detect volume peaks. Zero bytes of audio are stored or sent anywhere.",
  },
  {
    icon: "⌨️",
    title: "No keylogging",
    body: "SlapBack only reacts to the specific keys you configure. It never reads what you type.",
  },
  {
    icon: "🌐",
    title: "Runs locally",
    body: "100% in your browser. No server processing. No data leaves your machine.",
  },
  {
    icon: "📦",
    title: "Zero install required",
    body: "Open the URL and use it. Install as a PWA for the app experience — completely optional.",
  },
  {
    icon: "💳",
    title: "One-time payment",
    body: "Pay once for Pro or Ultimate. No subscription, no renewal, no surprise charges.",
  },
  {
    icon: "⚡",
    title: "Works while open",
    body: "SlapBack reacts while its window is active. No background services, no system access.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 px-4 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Trust</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Built with privacy
            <br />
            <span className="text-zinc-500">from day one.</span>
          </h2>
        </div>

        {/* Trust grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-base">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-white">{item.title}</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Privacy detail card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950 to-black p-7 md:p-9"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
              🛡️
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-white">The full picture</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                SlapBack never records your microphone. It only detects sudden volume peaks locally
                in your browser. It never reads what you type. It only reacts to selected keys and
                interaction patterns while the app is open. No analytics, no third-party scripts,
                no surprises.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["No keylogging", "No audio recording", "Local only", "No background access"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-400"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
