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

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (ny - 0.5) * -8, y: (nx - 0.5) * 8 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      onFocus={() => setHovered(true)}
      onBlur={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      tabIndex={0}
      role="article"
      className={className}
      style={{
        transform: hovered
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(4px)`
          : "perspective(900px) rotateX(0deg) rotateY(0deg)",
        transition: hovered ? "transform 0.08s linear" : "transform 0.45s cubic-bezier(0.34,1.2,0.64,1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

const FeaturesSection = () => (
  <section id="features" className="py-24 md:py-32 bg-[#f5f7fa] relative overflow-hidden">
    <div className="container mx-auto px-6 relative">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#0070d1] mb-4 tracking-widest uppercase">
          <span className="w-6 h-px bg-[#0070d1]/40" />
          {features.length} Fonctionnalités
          <span className="w-6 h-px bg-[#0070d1]/40" />
        </p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight leading-tight text-[#0a0a0a]">
          Tout ce dont votre restaurant a besoin.{" "}
          <span className="text-[#6b7280]">Rien de superflu.</span>
        </h2>
        <p className="mt-4 text-[15px] text-[#6b7280] leading-relaxed">
          Une plateforme intégrée conçue pour maximiser chaque euro généré par vos tables.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {features.map((f, i) => (
          <TiltCard
            key={f.title}
            className="group relative rounded-[8px] border border-[#e8eaed] bg-white p-6 cursor-default overflow-hidden hover:border-[#0070d1]/30 hover:shadow-[0_4px_24px_rgba(0,112,209,0.08)] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#0070d1]/40"
          >
            {f.badge && (
              <span className="absolute top-3 right-3 z-20 inline-flex items-center rounded-full bg-[#0070d1] px-2 py-0.5 text-[10px] font-bold text-white">
                {f.badge}
              </span>
            )}

            <span className="absolute top-4 right-5 text-[11px] font-bold text-[#e8eaed] tabular-nums select-none" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="w-10 h-10 rounded-[8px] bg-[#e8f2fc] flex items-center justify-center mb-5 transition-colors duration-200 group-hover:bg-[#0070d1]">
              <f.icon className="w-5 h-5 text-[#0070d1] group-hover:text-white transition-colors duration-200" />
            </div>

            <h3 className="text-[14px] font-semibold text-[#0a0a0a] mb-2">
              {f.title}
            </h3>
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              {f.desc}
            </p>

            <span
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#0070d1] transition-all duration-400 ease-out rounded-b-[8px]"
              aria-hidden="true"
            />
          </TiltCard>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 rounded-full border border-[#e8eaed] bg-white px-6 py-3 text-[13px] font-medium text-[#0a0a0a] hover:border-[#0070d1]/40 hover:text-[#0070d1] transition-all focus-ring"
        >
          Voir toutes les fonctionnalités
          <ArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#0070d1] group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
