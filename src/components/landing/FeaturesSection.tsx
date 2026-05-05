"use client";

import { useRef, useState } from "react";
import {
  QrCode, Brain, CreditCard, Users, BarChart3, Globe, Building2, Shield,
} from "lucide-react";

const features = [
  { icon: QrCode,    title: "QR Intelligent",       desc: "QR codes dynamiques et contextuels. Multi-usage : menu, commande, paiement, fidélité.",            color: "from-primary/20 to-primary/5",   glow: "hsl(212,100%,13%,0.18)" },
  { icon: Brain,     title: "Menu IA",               desc: "Créez votre menu depuis un PDF ou photo. Traductions IA, recommandations, optimisation des prix.",   color: "from-accent/20 to-accent/5",     glow: "hsl(302,30%,40%,0.16)" },
  { icon: CreditCard,title: "Paiement Intégré",      desc: "Commande à table sans serveur. Apple Pay, Google Pay, partage d'addition et pourboires.",            color: "from-primary/20 to-accent/5",    glow: "hsl(244,97%,35%,0.14)" },
  { icon: Users,     title: "CRM Automatique",       desc: "Base clients construite automatiquement. Scoring de fréquentation, segmentation VIP.",               color: "from-accent/20 to-primary/5",    glow: "hsl(302,30%,40%,0.16)" },
  { icon: BarChart3, title: "Analytics Temps Réel",  desc: "Revenu par table, taux de conversion, plats les plus rentables. Dashboard actionnable.",             color: "from-primary/15 to-primary/5",   glow: "hsl(212,100%,13%,0.16)" },
  { icon: Globe,     title: "Site Web Auto",          desc: "Site restaurant généré automatiquement, SEO optimisé, templates premium, domaine personnalisé.",    color: "from-accent/15 to-accent/5",     glow: "hsl(302,30%,40%,0.14)" },
  { icon: Building2, title: "Multi-Établissements",  desc: "Dashboard centralisé pour franchises. Accès par rôle et analytics croisées.",                       color: "from-primary/20 to-accent/5",    glow: "hsl(244,97%,35%,0.16)" },
  { icon: Shield,    title: "Conformité RGPD",        desc: "Conforme RGPD, gestion des cookies, anonymisation des données, sécurité enterprise.",               color: "from-accent/20 to-primary/5",    glow: "hsl(212,100%,13%,0.14)" },
];

/* ── TiltCard — perspective 3D + spotlight glow cursor ── */
function TiltCard({
  children,
  className,
  glowColor,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [cursor, setCursor]   = useState({ x: 50, y: 50 }); // % position inside card
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;   // 0–1
    const ny = (e.clientY - rect.top)  / rect.height;  // 0–1
    setTilt({ x: (ny - 0.5) * -10, y: (nx - 0.5) * 10 });
    setCursor({ x: nx * 100, y: ny * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      className={className}
      style={{
        transform: hovered
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(6px) scale(1.015)`
          : "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: hovered ? "transform 0.08s linear" : "transform 0.5s cubic-bezier(0.34,1.2,0.64,1)",
        willChange: "transform",
      }}
    >
      {/* Cursor spotlight — Photoshop radial gradient overlay */}
      {hovered && (
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl z-0"
          style={{
            background: `radial-gradient(220px circle at ${cursor.x}% ${cursor.y}%, ${glowColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

const FeaturesSection = () => (
  <section id="features" className="py-24 md:py-32 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

    <div className="container mx-auto px-6 relative">
      <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-4 tracking-widest uppercase">
          <span className="w-6 h-px bg-primary/50" />
          Fonctionnalités
          <span className="w-6 h-px bg-primary/50" />
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
          Tout ce dont votre restaurant a besoin.{" "}
          <span className="text-muted-foreground font-normal">Rien de superflu.</span>
        </h2>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Une plateforme intégrée conçue pour maximiser chaque euro généré par vos tables.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 animate-stagger">
        {features.map((f, i) => (
          <TiltCard
            key={f.title}
            glowColor={f.glow}
            className="group relative rounded-2xl border border-border bg-gradient-card p-6 cursor-default overflow-hidden hover:border-primary/25 transition-colors duration-300"
          >
            {/* Index number — decoartive */}
            <span className="absolute top-4 right-5 text-[11px] font-bold text-muted-foreground/15 tabular-nums select-none z-10">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Icon with animated gradient background */}
            <div
              className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 z-10 transition-all duration-500 group-hover:shadow-warm`}
              style={{
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
              }}
            >
              {/* Icon glow ping on hover */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-warm transition-opacity duration-300" aria-hidden="true" />
              <f.icon className="relative w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300 z-10" />
            </div>

            {/* Text */}
            <h3 className="relative text-[15px] font-semibold text-foreground mb-2 z-10 group-hover:text-foreground transition-colors">
              {f.title}
            </h3>
            <p className="relative text-[13px] text-muted-foreground leading-relaxed z-10">
              {f.desc}
            </p>

            {/* Bottom reveal line — Illustrator stroke */}
            <span
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-warm transition-all duration-500 ease-out rounded-b-2xl"
              aria-hidden="true"
            />
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
