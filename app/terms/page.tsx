import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms — SlapBack",
  description: "SlapBack terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          ← SlapBack
        </Link>

        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
            Terms of Service
          </p>
          <h1 className="text-4xl font-black">Conditions d&apos;utilisation.</h1>
          <p className="text-zinc-500 mt-3 text-sm">Dernière mise à jour : mai 2025</p>
        </header>

        <div className="space-y-8 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Utilisation du service</h2>
            <p>
              SlapBack est un gadget web à usage personnel et récréatif. En utilisant ce site, tu
              acceptes de ne pas l&apos;utiliser à des fins malveillantes, abusives ou commerciales
              sans accord préalable.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Accès au micro</h2>
            <p>
              L&apos;accès au microphone est une permission que tu accordes volontairement via ton
              navigateur. SlapBack ne peut pas accéder au micro sans ton consentement explicite. Tu
              peux révoquer cette permission à tout moment dans les paramètres de ton navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Disponibilité</h2>
            <p>
              SlapBack est fourni &laquo; tel quel &raquo;, sans garantie de disponibilité continue.
              Nous nous réservons le droit de modifier ou d&apos;interrompre le service à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Responsabilité</h2>
            <p>
              SlapBack n&apos;est pas responsable des dommages directs ou indirects liés à
              l&apos;utilisation du service, y compris les accidents causés par la frayeur de tes
              collègues. (Sérieusement, ne fais pas peur aux gens sans consentement.)
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Paiements</h2>
            <p>
              Les paiements Pro et Ultimate, quand ils seront disponibles, seront traités par un
              prestataire tiers (Stripe ou Lemon Squeezy). Les achats sont à usage personnel
              uniquement et non remboursables sauf obligation légale.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Contact</h2>
            <p>
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
