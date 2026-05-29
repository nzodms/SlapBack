import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — SlapBack",
  description: "SlapBack privacy policy. No audio recorded, no data collected.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          ← SlapBack
        </Link>

        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
            Privacy Policy
          </p>
          <h1 className="text-4xl font-black">On ne touche pas à tes données.</h1>
          <p className="text-zinc-500 mt-3 text-sm">Dernière mise à jour : mai 2025</p>
        </header>

        <div className="space-y-8 text-zinc-300 text-sm leading-relaxed">
          {/* TL;DR */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-3">
            <h2 className="text-white font-bold text-base">TL;DR</h2>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Aucun audio n&apos;est enregistré, ni stocké, ni transmis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Aucune touche n&apos;est loggée ou envoyée à un serveur.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Tout fonctionne localement dans ton navigateur.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>La permission micro est optionnelle et révocable à tout moment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Aucun compte requis pour utiliser SlapBack.</span>
              </li>
            </ul>
          </div>

          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Microphone</h2>
            <p>
              Si tu choisis le déclencheur &laquo; Physical Tap &raquo;, SlapBack demande l&apos;accès à ton
              microphone via l&apos;API standard du navigateur (<code>getUserMedia</code>). Cet accès est
              utilisé exclusivement pour analyser le volume sonore en temps réel via la Web Audio API.
            </p>
            <p className="mt-3">
              Aucun flux audio n&apos;est enregistré, bufferisé, ni envoyé à un serveur. L&apos;analyse se fait
              entièrement dans ton navigateur. Fermer l&apos;onglet ou cliquer &laquo; Stop &raquo; libère
              immédiatement l&apos;accès au micro.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Clavier et souris</h2>
            <p>
              SlapBack écoute les événements clavier et souris uniquement dans la page ouverte, uniquement
              quand un déclencheur de ce type est sélectionné et que tu as cliqué &laquo; Start &raquo;.
              Ces événements ne sont jamais enregistrés ni transmis. Ils servent uniquement à déclencher
              le son localement.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Cookies et analytics</h2>
            <p>
              SlapBack peut utiliser des analytics anonymes (Vercel Analytics) pour mesurer le nombre de
              visiteurs et les performances du site. Aucune donnée personnelle n&apos;est collectée.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Hébergement</h2>
            <p>
              Le site est hébergé sur Vercel (USA). Les logs de serveur standard (IP, user agent, URL)
              peuvent être conservés par Vercel selon leur politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Contact</h2>
            <p>
              Des questions ? Une demande RGPD ?{" "}
              <a
                href="mailto:hello@slapback.app"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                hello@slapback.app
              </a>
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-zinc-900">
          <Link href="/" className="text-sm text-zinc-600 hover:text-white transition-colors">
            ← Retour à SlapBack
          </Link>
        </div>
      </div>
    </div>
  );
}
