"use client";
import { ArrowRight, Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CTASection = () => (
  <section className="py-24 md:py-32 bg-[#0070d1] relative overflow-hidden">
    {/* Structural dark overlay at edges */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,0.2), transparent 70%)",
      }}
      aria-hidden="true"
    />

    <div className="container mx-auto px-6 relative text-center">
      <p className="text-[11px] font-semibold text-white/60 mb-4 tracking-widest uppercase">Rejoignez 12 000+ restaurants</p>
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-light tracking-tight max-w-3xl mx-auto leading-tight text-white">
        Prêt à transformer vos tables en{" "}
        <span className="font-semibold italic">machines à revenus</span> ?
      </h2>
      <p className="mt-6 text-[17px] text-white/70 max-w-xl mx-auto">
        Rejoignez 12 000+ restaurants qui utilisent déjà Tableo pour augmenter leurs revenus.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-[14px] text-[15px] font-semibold text-[#0070d1] hover:bg-white/90 transition-colors focus-ring group"
        >
          Commencer gratuitement
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:border-white/60 px-8 py-[14px] text-[15px] font-medium text-white transition-colors focus-ring"
        >
          Explorer le dashboard
        </Link>
      </div>

      <p className="mt-8 text-[13px] text-white/60">
        🚀 <span className="text-white font-medium">347 restaurants</span> ont rejoint Tableo ce mois-ci
      </p>
    </div>
  </section>
);

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#000] border-t border-white/8 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex mb-4 focus-ring rounded-lg">
              <span className="text-[22px] font-bold tracking-tight text-white">Tabléo</span>
            </Link>
            <p className="text-[12px] text-[#a8a8b3] leading-relaxed mb-4">
              Le Revenue Operating System pour restaurants. Menu IA, commandes, paiements et analytics en une plateforme.
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-[#a8a8b3] hover:text-white hover:border-white/16 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4">Produit</h4>
            <ul className="space-y-2.5">
              {["Fonctionnalités", "Tarifs", "Intégrations", "API"].map((l) => (
                <li key={l}><a href="#" className="text-[13px] text-[#a8a8b3] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4">Ressources</h4>
            <ul className="space-y-2.5">
              {["Blog", "Documentation", "Guides", "Webinaires"].map((l) => (
                <li key={l}><a href="#" className="text-[13px] text-[#a8a8b3] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-[12px] text-[#a8a8b3] mb-3">Recevez nos conseils pour booster vos revenus.</p>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Inscription à la newsletter">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a8a8b3]" aria-hidden="true" />
                  <label htmlFor="footer-newsletter-email" className="sr-only">Adresse email pour la newsletter</label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    className="w-full rounded-[4px] bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-[12px] text-white placeholder:text-[#a8a8b3] focus:outline-none focus:border-[#0070d1]/60 transition-colors focus-ring"
                  />
                </div>
                <button type="submit" aria-label="S'inscrire à la newsletter" className="rounded-[4px] bg-[#0070d1] hover:bg-[#0082f0] px-3 py-2 text-[12px] font-semibold text-white shrink-0 transition-colors focus-ring">
                  OK
                </button>
              </div>
              <p className="text-[10px] text-[#a8a8b3]/60">
                En vous inscrivant, vous acceptez notre{" "}
                <Link href="/politique-confidentialite" className="underline hover:text-[#a8a8b3] transition-colors focus-ring rounded">politique de confidentialité</Link>.
              </p>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-[11px] text-[#a8a8b3]">© {new Date().getFullYear()} Tableo — service édité par <a href="https://internet.kayzen-lyon.fr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-ring rounded">KAYZEN LYON</a> (SASU, RCS Lyon 999 418 346)</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#0070d1]/30 bg-[#0070d1]/10 px-2 py-0.5 text-[10px] font-medium text-[#0070d1]" aria-label="Site conforme à l'European Accessibility Act (EAA), RGAA 4.1 et WCAG 2.2 niveau AA">
                  <span aria-hidden="true">♿</span> Conforme EAA · RGAA 4.1 · WCAG 2.2 AA
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] text-[#a8a8b3]" aria-label="Conforme au Règlement Général sur la Protection des Données">
                  🔒 Conforme RGPD
                </span>
              </div>
            </div>
            <a
              href="https://internet.kayzen-lyon.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#a8a8b3] hover:text-white transition-colors focus-ring rounded shrink-0"
              aria-label="Réalisé fièrement par Kayzen Web — agence web à Lyon (ouvre dans un nouvel onglet)"
            >
              Réalisé fièrement par <span className="text-[#0070d1] font-medium">Kayzen Web</span> 🤝
            </a>
          </div>
          <nav aria-label="Liens légaux">
            <ul className="flex flex-wrap items-center gap-4 text-[11px] text-[#a8a8b3] list-none" role="list">
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors focus-ring rounded">Confidentialité</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors focus-ring rounded">CGU</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors focus-ring rounded">CGV</Link></li>
              <li><Link href="/politique-cookies" className="hover:text-white transition-colors focus-ring rounded">Cookies</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors focus-ring rounded">Mentions légales</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors focus-ring rounded">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export { CTASection, Footer };
