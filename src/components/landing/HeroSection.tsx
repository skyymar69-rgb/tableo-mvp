"use client";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { HeroImage } from "@/components/ui/LazyImage";

function AnimatedStat({ prefix = "", suffix = "", target, decimals = 0, label }: {
  prefix?: string; suffix?: string; target: number; decimals?: number; label: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(target, 2200, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-light text-white tabular-nums">
        {prefix}{decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(1) : count.toLocaleString("fr-FR")}{suffix}
      </div>
      <div className="text-[12px] text-[#a8a8b3] mt-1 font-medium">{label}</div>
    </div>
  );
}

const trustLogos = [
  { name: "Le Petit Bistrot", initials: "LPB" },
  { name: "Brasserie 42", initials: "B42" },
  { name: "Chez Marco", initials: "CM" },
  { name: "L'Ardoise", initials: "LA" },
  { name: "Casa Verde", initials: "CV" },
];

const HeroSection = () => {
  const rafRef = useRef<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[60px] bg-[#000]">
      {/* Subtle blue radial glow — structural, not decorative */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,112,209,0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Cursor-tracking glow — very subtle */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,112,209,0.05), transparent 50%)`,
        }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-6 py-24 text-center" style={{ zIndex: 2 }}>
        {/* Live badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-10">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0070d1] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0070d1]" />
          </span>
          <span className="text-[12px] font-medium text-[#a8a8b3]">Revenue Operating System pour restaurants</span>
        </div>

        {/* Headline — PS weight 300 display */}
        <h1 className="animate-fade-up-d1 text-[clamp(2.5rem,8vw,6rem)] font-light tracking-[-0.02em] leading-[1.05] max-w-5xl mx-auto text-white">
          Faites de chaque table une{" "}
          <span className="text-[#0070d1] font-light italic">source de revenus</span>
        </h1>

        <p className="animate-fade-up-d2 mt-7 text-[17px] text-[#a8a8b3] max-w-2xl mx-auto leading-relaxed font-normal">
          Tableo transforme vos QR codes en un moteur de croissance intelligent.
          Menu IA, commandes, paiements, CRM et analytics — tout en une plateforme.
        </p>

        {/* PS pill CTAs */}
        <div className="animate-fade-up-d3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0070d1] hover:bg-[#0082f0] px-8 py-[14px] text-[15px] font-semibold text-white transition-colors focus-ring"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/menu/demo"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 hover:border-white/40 px-8 py-[14px] text-[15px] font-medium text-white transition-colors focus-ring"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-3 h-3 text-white ml-0.5" />
            </div>
            Essayer sans s&apos;inscrire
          </Link>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-up-d4 mt-20 flex flex-wrap items-center justify-center gap-10 md:gap-20 border-t border-white/8 pt-10">
          <AnimatedStat prefix="+" suffix="%" target={32} label="de revenus par table" />
          <div className="hidden md:block w-px h-10 bg-white/10" />
          <AnimatedStat prefix="< " suffix=" min" target={5} label="pour être en ligne" />
          <div className="hidden md:block w-px h-10 bg-white/10" />
          <AnimatedStat target={12000} suffix="+" label="restaurants actifs" />
          <div className="hidden md:block w-px h-10 bg-white/10" />
          <AnimatedStat prefix="" suffix="★" target={49} decimals={1} label="satisfaction client" />
        </div>

        {/* Trust logos */}
        <div className="animate-fade-up-d5 mt-12 flex flex-col items-center gap-3">
          <p className="text-[11px] text-[#a8a8b3]/60 uppercase tracking-widest font-semibold">Ils font confiance à Tableo</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {trustLogos.map((logo) => (
              <div
                key={logo.name}
                title={logo.name}
                className="h-8 px-3 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-[11px] font-semibold text-[#a8a8b3] hover:text-white hover:border-white/16 transition-colors"
              >
                {logo.initials}
              </div>
            ))}
            <div className="h-8 px-3 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-[11px] text-[#a8a8b3]/50">
              +12k restaurants
            </div>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="animate-fade-up-d7 mt-16 relative mx-auto max-w-5xl">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/4 to-transparent pointer-events-none" />
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
