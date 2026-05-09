"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  QrCode, Brain, CreditCard, Users, BarChart3, Globe, Building2, Shield, ArrowRight,
} from "lucide-react";

const features = [
  { icon: QrCode,    title: "QR Intelligent",       desc: "QR codes dynamiques et contextuels. Multi-usage : menu, commande, paiement, fidélité.",            badge: null },
  { icon: Brain,     title: "Menu IA",               desc: "Créez votre menu depuis un PDF ou photo. Traductions IA, recommandations, optimisation des prix.",   badge: "Nouveau" },
  { icon: CreditCard,title: "Paiement Intégré",      desc: "Commande à table sans serveur. Apple Pay, Google Pay, partage d'addition et pourboires.",            badge: null },
  { icon: Users,     title: "CRM Automatique",       desc: "Base clients construite automatiquement. Scoring de fréquentation, segmentation VIP.",               badge: null },
  { icon: BarChart3, title: "Analytics Temps Réel",  desc: "Revenu par table, taux de conversion, plats les plus rentables. Dashboard actionnable.",             badge: null },
  { icon: Globe,     title: "Site Web Auto",          desc: "Site restaurant généré automatiquement, SEO optimisé, templates premium, domaine personnalisé.",    badge: null },
  { icon: Building2, title: "Multi-Établissements",  desc: "Dashboard centralisé pour franchises. Accès par rôle et analytics croisées.",                       badge: null },
  { icon: Shield,    title: "Conformité RGPD",        desc: "Conforme RGPD, gestion des cookies, anonymisation des données, sécurité enterprise.",               badge: null },
];

function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="article"
      className="group relative rounded-[12px] bg-[#f5f5f5] p-8 cursor-default overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/20 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      {f.badge && (
        <span className="absolute top-4 right-4 z-20 inline-flex items-center rounded-full bg-[#111111] px-2.5 py-0.5 text-[10px] font-semibold text-white">
          {f.badge}
        </span>
      )}

      <span className="absolute top-5 right-5 text-[11px] font-bold text-[#e5e7eb] tabular-nums select-none" aria-hidden="true">
        {String(i + 1).padStart(2, "0")}
      </span>

      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center mb-5 transition-colors duration-200 ${hovered ? "bg-[#111111]" : "bg-white border border-[#e5e7eb]"}`}>
        <f.icon className={`w-5 h-5 transition-colors duration-200 ${hovered ? "text-white" : "text-[#111111]"}`} />
      </div>

      <h3 className="text-[15px] font-semibold text-[#111111] mb-2">
        {f.title}
      </h3>
      <p className="text-[13px] text-[#6b7280] leading-relaxed">
        {f.desc}
      </p>
    </div>
  );
}

const FeaturesSection = () => (
  <section id="features" className="py-24 md:py-32 bg-[#f5f5f5]">
    <div className="container mx-auto px-6 max-w-[1200px]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#6b7280] mb-4 tracking-widest uppercase">
          {features.length} Fonctionnalités
        </p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] leading-tight text-[#111111]">
          Tout ce dont votre restaurant a besoin.{" "}
          <span className="text-[#6b7280]">Rien de superflu.</span>
        </h2>
        <p className="mt-4 text-[15px] text-[#374151] leading-relaxed">
          Une plateforme intégrée conçue pour maximiser chaque euro généré par vos tables.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((f, i) => (
          <FeatureCard key={f.title} f={f} i={i} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white px-6 py-3 text-[14px] font-medium text-[#111111] hover:border-[#111111]/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all focus-ring"
        >
          Voir toutes les fonctionnalités
          <ArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
