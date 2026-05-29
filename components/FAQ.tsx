"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Est-ce que ça enregistre mon micro ?",
    a: "Non, jamais. Zéro octet ne quitte ton navigateur. Le micro est utilisé en lecture seule pour détecter des pics de volume soudains — comme un tap sur le bureau.",
  },
  {
    q: "Est-ce que ça fonctionne sur mobile ?",
    a: "Oui. La détection tap via micro marche très bien sur mobile. Les déclencheurs clavier nécessitent un clavier physique.",
  },
  {
    q: "Est-ce que j'ai besoin d'installer quelque chose ?",
    a: "Non. Ouvre l'URL, c'est tout. Aucun téléchargement, aucune extension, aucun privilège macOS.",
  },
  {
    q: "Ça ralentit mon ordinateur ?",
    a: "À peine. Environ autant qu'un GIF animé. L'analyse audio est faite via Web Audio API, nativement dans le navigateur.",
  },
  {
    q: "Que se passe-t-il si mon navigateur bloque le micro ?",
    a: "Tous les autres déclencheurs (clavier, clics, souris) fonctionnent sans micro. La version sans micro est entièrement opérationnelle.",
  },
  {
    q: "C'est quoi la différence avec une vraie app Mac ?",
    a: "Une vraie app Mac peut détecter les taps même quand le navigateur est en arrière-plan, et peut intercepter les raccourcis globaux. SlapBack Web fonctionne uniquement quand la page est ouverte et au premier plan — ce qui est parfait pour une V1.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
          {q}
        </span>
        <span
          className={`text-zinc-600 text-lg transition-transform duration-200 flex-shrink-0 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-500 pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 border-t border-zinc-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">FAQ</h2>
          <p className="text-zinc-500 mt-3">Les questions que tu te poses.</p>
        </div>
        <div>
          {FAQS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
