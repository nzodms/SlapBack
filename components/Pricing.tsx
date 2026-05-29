"use client";

const PRO_FEATURES = [
  "Tous les sons V1",
  "Tous les déclencheurs",
  "Rage Meter Pro",
  "Punchlines custom",
  "Thèmes visuels",
];

const ULTIMATE_FEATURES = [
  "Tout ce qu'il y a dans Pro",
  "Upload de sons custom",
  "Packs de sons exclusifs",
  "Accès prioritaire aux nouveaux triggers",
  "Badge Collector",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Go further.
          </h2>
          <p className="text-zinc-500 mt-3 text-lg">
            Paiement unique. Pas d&apos;abonnement. Pas de bullshit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                SlapBack Pro
              </p>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-5xl font-black text-white">9,99€</span>
              </div>
              <p className="text-zinc-600 text-sm mt-1">paiement unique</p>
            </div>
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-green-400 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 text-sm font-bold cursor-not-allowed"
            >
              Bientôt disponible
            </button>
          </div>

          {/* Ultimate */}
          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1 rounded-full">
                Best value
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">
                SlapBack Ultimate
              </p>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-5xl font-black text-white">14,99€</span>
              </div>
              <p className="text-zinc-600 text-sm mt-1">paiement unique</p>
            </div>
            <ul className="space-y-2.5">
              {ULTIMATE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-400 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full py-3 rounded-xl bg-yellow-400/10 text-yellow-400/50 text-sm font-bold cursor-not-allowed border border-yellow-400/20"
            >
              Bientôt disponible
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700">
          Les paiements seront traités via Stripe. Aucune donnée audio n&apos;est collectée.
        </p>
      </div>
    </section>
  );
}
