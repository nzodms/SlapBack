"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FAQS = [
  {
    q: "C'est quoi SlapBack, exactement ?",
    a: "Une vraie app macOS native qui vit dans ta barre de menu. Elle détecte tes triggers (touche, clics, tap sur le bureau) partout sur ton système et fait réagir ton Mac. Le site propose aussi une démo web gratuite, mais le vrai produit est l'app Mac.",
  },
  {
    q: "Comment je l'installe ?",
    a: "Télécharge le .dmg, ouvre-le, glisse SlapBack dans Applications, lance-le et autorise les permissions. Le guide complet est sur la page Install.",
  },
  {
    q: "Pourquoi le bouton dit parfois “coming soon” ?",
    a: "L'app Mac native est terminée côté code source, mais le build téléchargeable (.dmg signé/notarisé) est en cours de packaging. En attendant, tu peux rejoindre la beta pour recevoir le lien dès qu'il est prêt — ou compiler depuis Xcode via le README macOS.",
  },
  {
    q: "Est-ce que ça enregistre mon micro ?",
    a: "Non, jamais. Le micro sert uniquement à détecter des pics de volume (comme un tap sur le bureau) pour les presets concernés. Aucun audio n'est enregistré, stocké, ou envoyé. Tout est local.",
  },
  {
    q: "Est-ce que ça enregistre ce que je tape ?",
    a: "Non. SlapBack n'écoute que le trigger que tu as configuré (ex: la barre Espace ou Caps Lock). Il n'y a aucun historique des touches, aucun keylogging, aucun texte stocké.",
  },
  {
    q: "Pourquoi il faut la permission Accessibilité ?",
    a: "macOS exige cette permission pour qu'une app détecte les touches et clics en dehors de sa propre fenêtre. SlapBack l'utilise uniquement pour repérer ton trigger configuré, rien d'autre.",
  },
  {
    q: "C'est quoi la différence avec la démo web ?",
    a: "La démo web ne fonctionne que dans l'onglet ouvert et au premier plan. L'app Mac détecte les triggers partout sur ton système, même quand tu es dans une autre app, et affiche l'overlay par-dessus tout.",
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
        <div className="text-center pt-2">
          <Link
            href="/install"
            className="text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
          >
            See the full install guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
