"use client";

import { motion } from "framer-motion";

interface Tier {
  id: string;
  name: string;
  price: string;
  priceNote?: string;
  badge?: string;
  highlight?: boolean;
  features: { label: string; included: boolean }[];
  cta: string;
  ctaHref?: string;
  ctaDisabled?: boolean;
}

const TIERS: Tier[] = [
  {
    id: "demo",
    name: "Free Demo",
    price: "0€",
    priceNote: "no signup",
    features: [
      { label: "3 demo presets", included: true },
      { label: "Works in browser", included: true },
      { label: "Limited sounds", included: true },
      { label: "Limited triggers", included: true },
      { label: "Demo watermark", included: true },
      { label: "All 10 sounds", included: false },
      { label: "All 8 triggers", included: false },
      { label: "Installable app mode", included: false },
    ],
    cta: "Try it now",
    ctaHref: "#demo",
  },
  {
    id: "pro",
    name: "SlapBack Pro",
    price: "9,99€",
    priceNote: "one-time",
    badge: "Most popular",
    highlight: true,
    features: [
      { label: "All 10 built-in sounds", included: true },
      { label: "All 8 triggers", included: true },
      { label: "Installable app mode", included: true },
      { label: "Rage Meter", included: true },
      { label: "Visual punchlines", included: true },
      { label: "No watermark", included: true },
      { label: "Future V1 updates", included: true },
    ],
    cta: "Get Pro — 9,99€",
    ctaDisabled: true,
  },
  {
    id: "ultimate",
    name: "SlapBack Ultimate",
    price: "14,99€",
    priceNote: "one-time",
    badge: "Best value",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Upload custom sounds", included: true },
      { label: "Exclusive sound packs", included: true },
      { label: "Demon Mode 👹", included: true },
      { label: "Collector badge", included: true },
      { label: "Priority new triggers", included: true },
    ],
    cta: "Get Ultimate — 14,99€",
    ctaDisabled: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Pay once. Slap forever.
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            One-time payment. No subscription. 7-day refund if it doesn&apos;t work for you.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className={`relative rounded-3xl p-6 md:p-7 space-y-5 ${
                tier.highlight
                  ? "border-2 border-red-500/50 bg-gradient-to-b from-red-500/5 to-transparent"
                  : "border border-zinc-900 bg-zinc-950"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tier.highlight
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400/10 border border-yellow-400/40 text-yellow-300"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    {tier.price}
                  </span>
                  {tier.priceNote && (
                    <span className="text-xs text-zinc-600">{tier.priceNote}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2 min-h-[180px]">
                {tier.features.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-start gap-2.5 text-sm ${
                      f.included ? "text-zinc-200" : "text-zinc-600 line-through"
                    }`}
                  >
                    <span
                      className={`mt-0.5 text-xs font-bold ${
                        f.included
                          ? tier.highlight
                            ? "text-red-400"
                            : "text-green-400"
                          : "text-zinc-700"
                      }`}
                    >
                      {f.included ? "✓" : "—"}
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              {tier.ctaHref ? (
                <a
                  href={tier.ctaHref}
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    tier.highlight
                      ? "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30"
                      : "border border-zinc-700 text-zinc-300 hover:border-white hover:text-white"
                  }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <button
                  disabled={tier.ctaDisabled}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    tier.highlight
                      ? "bg-red-500/40 text-white/70 cursor-not-allowed"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {tier.ctaDisabled ? "Coming soon" : tier.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Reassurance */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-600">
          <span>💳 One-time payment</span>
          <span>🚫 No subscription</span>
          <span>↩ 7-day refund</span>
          <span>🔒 Secure checkout (Stripe)</span>
        </div>
      </div>
    </section>
  );
}
