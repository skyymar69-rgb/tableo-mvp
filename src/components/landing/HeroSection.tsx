"use client";
import { ArrowRight, Zap, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { HeroImage } from "@/components/ui/LazyImage";

function AnimatedStat({ prefix = "", suffix = "", target, decimals = 0, label }: { prefix?: string; suffix?: string; target: number; decimals?: number; label: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(target, 2200, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="group cursor-default">
      <div className="text-2xl md:text-3xl font-bold text-gradient-warm transition-transform duration-300 group-hover:scale-110">
        {prefix}{decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(1) : count.toLocaleString("fr-FR")}{suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/70 transition-colors">{label}</div>
    </div>
  );
}

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 noise-overlay">
      <div className="absolute inset-0 bg-hero-glow" />

      {/* Cursor glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(302, 30%, 40%, 0.04), transparent 40%)`,
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-primary/40 animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute top-1/3 right-[20%] w-3 h-3 rounded-full bg-accent/30 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-1/3 left-[25%] w-1.5 h-1.5 rounded-full bg-primary/30 animate-float" style={{ animationDelay: "4s" }} />
      <div className="absolute top-2/3 right-[10%] w-2 h-2 rounded-full bg-accent/20 animate-float" style={{ animationDelay: "1s" }} />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px]"
        style={{
          background: "linear-gradient(135deg, hsl(212,100%,13%,0.06), hsl(244,97%,35%,0.05), hsl(302,30%,40%,0.04))",
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite, pulseSlow 6s ease infinite",
        }}
      />

      <div className="container relative mx-auto px-6 py-20 text-center" style={{ zIndex: 2 }}>
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full glass-warm px-4 py-1.5 mb-8 hover:border-primary/30 transition-colors cursor-default">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Revenue Operating System pour restaurants</span>
          <span className="text-xs text-primary font-semibold">→ Nouveau</span>
        </div>

        <h1 className="animate-fade-up-d1 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] max-w-5xl mx-auto">
          Faites de chaque table une{" "}
          <span className="text-gradient-warm font-serif italic font-normal">source de revenus</span>
        </h1>

        <p className="animate-fade-up-d2 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tableo transforme vos QR codes en un moteur de croissance intelligent. Menu IA, commandes, paiements, CRM et analytics — tout en une plateforme.
        </p>

        <div className="animate-fade-up-d3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-warm px-8 py-4 text-base font-semibold text-primary-foreground shadow-warm transition-all hover:scale-[1.03] hover:shadow-glow-warm focus-ring"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/menu/demo"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-foreground hover:bg-secondary/50 transition-all focus-ring group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-warm-subtle flex items-center justify-center group-hover:bg-gradient-warm transition-all duration-300">
              <Play className="w-3.5 h-3.5 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            Essayer sans s&apos;inscrire
          </Link>
        </div>

        {/* Animated stats */}
        <div className="animate-fade-up-d4 mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <AnimatedStat prefix="+" suffix="%" target={32} label="de revenus par table" />
          <AnimatedStat prefix="< " suffix=" min" target={5} label="pour être en ligne" />
          <AnimatedStat target={12000} suffix="+" label="restaurants actifs" />
          <AnimatedStat prefix="" suffix="★" target={49} decimals={1} label="satisfaction client" />
        </div>

        {/* Trust badges */}
        <div className="animate-fade-up-d5 mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1.5">🔒 RGPD Compliant</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5">⚡ 99.9% Uptime</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5">🏆 Top Product 2026</span>
        </div>

        {/* Hero illustration */}
        <div className="animate-fade-up-d6 mt-12 relative mx-auto max-w-5xl">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-warm-subtle blur-xl animate-pulse-slow" />
          <HeroImage
            src="/illus-hero.svg"
            alt="Smartphone Tabléo affichant un menu QR code avec terminal de paiement en arrière-plan"
            width={960}
            height={580}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
