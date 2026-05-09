"use client";
import { ArrowRight, Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const CTASection = () => (
  <section className="py-16 md:py-20 bg-white">
    <div className="container mx-auto px-6 max-w-[1200px]">
      <div className="relative rounded-[20px] overflow-hidden p-12 md:p-16 text-center"
        style={{ background: "linear-gradient(135deg, #001e40 0%, #1603ae 50%, #844981 100%)" }}>
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
        <p className="relative text-[11px] font-semibold text-white/60 mb-4 tracking-widest uppercase">Rejoignez 12 000+ restaurants</p>
        <h2 className="relative text-[clamp(1.8rem,4vw,2.8rem)] font-display font-semibold tracking-[-0.03em] max-w-2xl mx-auto leading-tight text-white">
          Prêt à transformer vos tables en machines à revenus ?
        </h2>
        <p className="relative mt-5 text-[16px] text-white/75 max-w-xl mx-auto">
          Rejoignez 12 000+ restaurants qui utilisent déjà Tableo pour augmenter leurs revenus.
        </p>
        <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-[8px] bg-white hover:bg-white/90 px-8 py-3.5 text-[14px] font-semibold text-[#001e40] transition-all hover:scale-[1.02] focus-ring group shadow-lg"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[8px] border border-white/25 hover:border-white/50 bg-white/10 px-8 py-3.5 text-[14px] font-medium text-white transition-all hover:bg-white/20 focus-ring"
          >
            Explorer le dashboard
          </Link>
        </div>
        <p className="relative mt-6 text-[13px] text-white/50">
          <span className="font-semibold text-white">347 restaurants</span> ont rejoint Tableo ce mois-ci
        </p>
      </div>
    </div>
  </section>
);

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#101010] py-16">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 focus-ring rounded-lg group">
              <Image src="/logo.png" alt="Tabléo" width={32} height={32} className="rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="text-[22px] font-display font-bold tracking-tight text-white">Tabléo</span>
            </Link>
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-4">
              Le Revenue Operating System pour restaurants. Menu IA, commandes, paiements et analytics en une plateforme.
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:border-white/20 transition-all">
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
                <li key={l}><a href="#" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4">Ressources</h4>
            <ul className="space-y-2.5">
              <li><Link href="/docs" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs#faq" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="#" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors">Webinaires</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-[12px] text-[#a1a1aa] mb-3">Recevez nos conseils pour booster vos revenus.</p>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Inscription à la newsletter">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a1a1aa]" aria-hidden="true" />
                  <label htmlFor="footer-newsletter-email" className="sr-only">Adresse email pour la newsletter</label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    className="w-full rounded-[8px] bg-[#1a1a1a] border border-white/10 pl-9 pr-3 py-2 text-[12px] text-white placeholder:text-[#a1a1aa] focus:outline-none focus:border-white/30 transition-colors focus-ring"
                  />
                </div>
                <button type="submit" aria-label="S'inscrire à la newsletter" className="rounded-[8px] bg-white hover:bg-[#f5f5f5] px-3 py-2 text-[12px] font-semibold text-[#111111] shrink-0 transition-colors focus-ring">
                  OK
                </button>
              </div>
              <p className="text-[10px] text-[#a1a1aa]/60">
                En vous inscrivant, vous acceptez notre{" "}
                <Link href="/politique-confidentialite" className="underline hover:text-[#a1a1aa] transition-colors focus-ring rounded">politique de confidentialité</Link>.
              </p>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-[11px] text-[#a1a1aa]">© {new Date().getFullYear()} Tableo — service édité par <a href="https://internet.kayzen-lyon.fr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-ring rounded">KAYZEN LYON</a> (SASU, RCS Lyon 999 418 346)</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-[#a1a1aa]" aria-label="Site conforme à l'European Accessibility Act (EAA), RGAA 4.1 et WCAG 2.2 niveau AA">
                  <span aria-hidden="true">♿</span> Conforme EAA · RGAA 4.1 · WCAG 2.2 AA
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 px-2 py-0.5 text-[10px] text-[#a1a1aa]" aria-label="Conforme au Règlement Général sur la Protection des Données">
                  🔒 Conforme RGPD
                </span>
              </div>
            </div>
            <a
              href="https://internet.kayzen-lyon.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#a1a1aa] hover:text-white transition-colors focus-ring rounded shrink-0"
              aria-label="Réalisé fièrement par Kayzen Web — agence web à Lyon (ouvre dans un nouvel onglet)"
            >
              Réalisé fièrement par <span className="text-white font-medium">Kayzen Web</span>
            </a>
          </div>
          <nav aria-label="Liens légaux">
            <ul className="flex flex-wrap items-center gap-4 text-[11px] text-[#a1a1aa] list-none" role="list">
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
