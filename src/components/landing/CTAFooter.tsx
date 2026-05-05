"use client";
import { ArrowRight, Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* 39. Animated gradient CTA background */
const CTASection = () => (
  <section className="py-24 md:py-32 border-t border-border/50 relative overflow-hidden">
    <div className="absolute inset-0 bg-hero-glow" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[140px] animate-pulse-slow" />
    {/* Animated gradient orb */}
    <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] animate-float" />

    <div className="container mx-auto px-6 relative text-center" style={{ zIndex: 2 }}>
      <h2 className="text-3xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
        Prêt à transformer vos tables en{" "}
        <span className="text-gradient-warm font-serif italic font-normal">machines à revenus</span> ?
      </h2>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
        Rejoignez 12 000+ restaurants qui utilisent déjà Tableo pour augmenter leurs revenus.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-warm px-8 py-4 text-base font-semibold text-primary-foreground shadow-warm transition-all hover:scale-[1.03] hover:shadow-glow-warm focus-ring"
        >
          Commencer gratuitement
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-foreground hover:bg-secondary/50 transition-all focus-ring"
        >
          Explorer le dashboard
        </Link>
      </div>

      {/* Social proof counter */}
      <p className="mt-8 text-sm text-muted-foreground">
        🚀 <span className="text-foreground font-medium">347 restaurants</span> ont rejoint Tableo ce mois-ci
      </p>
    </div>
  </section>
);

/* 40. Footer with social links + newsletter */
const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex mb-4 focus-ring rounded-lg">
              <span className="text-2xl font-bold tracking-tight text-gradient-warm">Tabléo</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              L'IA qui fluidifie vos workflows documentaires. Classification, extraction et traitement intelligent de documents.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Produit</h4>
            <ul className="space-y-2.5">
              {["Fonctionnalités", "Tarifs", "Intégrations", "API"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Ressources</h4>
            <ul className="space-y-2.5">
              {["Blog", "Documentation", "Guides", "Webinaires"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-muted-foreground mb-3">Recevez nos conseils pour booster vos revenus.</p>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Inscription à la newsletter">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                  <label htmlFor="footer-newsletter-email" className="sr-only">Adresse email pour la newsletter</label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    className="w-full rounded-lg bg-secondary border border-border pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors focus-ring"
                  />
                </div>
                <button type="submit" aria-label="S'inscrire à la newsletter" className="rounded-lg bg-gradient-warm px-3 py-2 text-xs font-semibold text-primary-foreground shrink-0 hover:opacity-90 transition-opacity focus-ring">
                  OK
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                En vous inscrivant, vous acceptez notre{" "}
                <Link href="/politique-confidentialite" className="underline hover:text-foreground transition-colors focus-ring rounded">politique de confidentialité</Link>.
                Désabonnement en un clic.
              </p>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Tableo — service édité par <a href="https://internet.kayzen-lyon.fr" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors focus-ring rounded">KAYZEN LYON</a> (SASU, RCS Lyon 999 418 346)</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-gradient-warm-subtle px-2 py-0.5 text-[10px] font-medium text-primary" aria-label="Site conforme à l'European Accessibility Act (EAA), RGAA 4.1 et WCAG 2.2 niveau AA">
                  <span aria-hidden="true">♿</span> Conforme EAA · RGAA 4.1 · WCAG 2.2 AA
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground" aria-label="Conforme au Règlement Général sur la Protection des Données">
                  🔒 Conforme RGPD
                </span>
              </div>
            </div>
            <a
              href="https://internet.kayzen-lyon.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-ring rounded shrink-0"
              aria-label="Réalisé fièrement par Kayzen Web — agence web à Lyon (ouvre dans un nouvel onglet)"
            >
              Réalisé fièrement par <span className="text-primary font-medium">Kayzen Web</span> 🤝
            </a>
          </div>
          <nav aria-label="Liens légaux">
            <ul className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground list-none" role="list">
              <li><Link href="/politique-confidentialite" className="hover:text-foreground transition-colors focus-ring rounded">Confidentialité</Link></li>
              <li><Link href="/cgu" className="hover:text-foreground transition-colors focus-ring rounded">CGU</Link></li>
              <li><Link href="/cgv" className="hover:text-foreground transition-colors focus-ring rounded">CGV</Link></li>
              <li><Link href="/politique-cookies" className="hover:text-foreground transition-colors focus-ring rounded">Cookies</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-foreground transition-colors focus-ring rounded">Mentions légales</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors focus-ring rounded">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export { CTASection, Footer };
