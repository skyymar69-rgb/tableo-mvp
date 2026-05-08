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
      <div className="text-3xl md:text-4xl font-display font-semibold tracking-[-0.04em] text-[#111111] tabular-nums">
        {prefix}{decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(1) : count.toLocaleString("fr-FR")}{suffix}
      </div>
      <div className="text-[12px] text-[#6b7280] mt-1 font-medium">{label}</div>
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

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-white">
    <div className="container relative mx-auto px-6 py-24 text-center max-w-[1200px]" style={{ zIndex: 2 }}>
      {/* Badge */}
      <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f5f5f5] px-4 py-1.5 mb-10">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#111111] opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#111111]" />
        </span>
        <span className="text-[12px] font-medium text-[#374151]">Revenue Operating System pour restaurants</span>
      </div>

      {/* Headline */}
      <h1 className="animate-fade-up-d1 text-[clamp(2.5rem,8vw,64px)] font-display font-semibold tracking-[-0.04em] leading-[1.05] max-w-5xl mx-auto text-[#111111]">
        Faites de chaque table une{" "}
        <span className="text-[#6b7280]">source de revenus</span>
      </h1>

      <p className="animate-fade-up-d2 mt-7 text-[17px] text-[#374151] max-w-2xl mx-auto leading-relaxed">
        Tableo transforme vos QR codes en un moteur de croissance intelligent.
        Menu IA, commandes, paiements, CRM et analytics — tout en une plateforme.
      </p>

      {/* CTAs */}
      <div className="animate-fade-up-d3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 rounded-[8px] bg-[#111111] hover:bg-[#242424] px-8 py-3.5 text-[14px] font-semibold text-white transition-colors focus-ring"
        >
          Commencer gratuitement
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/menu/demo"
          className="inline-flex items-center gap-2.5 rounded-[8px] border border-[#e5e7eb] bg-white hover:border-[#111111]/20 px-8 py-3.5 text-[14px] font-medium text-[#111111] transition-colors focus-ring"
        >
          <div className="w-7 h-7 rounded-full bg-[#f5f5f5] border border-[#e5e7eb] flex items-center justify-center">
            <Play className="w-3 h-3 text-[#111111] ml-0.5" />
          </div>
          Essayer sans s&apos;inscrire
        </Link>
      </div>

      {/* Stats strip */}
      <div className="animate-fade-up-d4 mt-20 flex flex-wrap items-center justify-center gap-10 md:gap-20 border-t border-[#e5e7eb] pt-10">
        <AnimatedStat prefix="+" suffix="%" target={32} label="de revenus par table" />
        <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />
        <AnimatedStat prefix="< " suffix=" min" target={5} label="pour être en ligne" />
        <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />
        <AnimatedStat target={12000} suffix="+" label="restaurants actifs" />
        <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />
        <AnimatedStat prefix="" suffix="★" target={49} decimals={1} label="satisfaction client" />
      </div>

      {/* Trust logos */}
      <div className="animate-fade-up-d5 mt-12 flex flex-col items-center gap-3">
        <p className="text-[11px] text-[#6b7280] uppercase tracking-widest font-semibold">Ils font confiance à Tableo</p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {trustLogos.map((logo) => (
            <div
              key={logo.name}
              title={logo.name}
              className="h-8 px-3 rounded-[8px] bg-[#f5f5f5] border border-[#e5e7eb] flex items-center justify-center text-[11px] font-semibold text-[#374151] hover:text-[#111111] hover:border-[#111111]/20 transition-colors"
            >
              {logo.initials}
            </div>
          ))}
          <div className="h-8 px-3 rounded-[8px] border border-dashed border-[#e5e7eb] flex items-center justify-center text-[11px] text-[#6b7280]">
            +12k restaurants
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="animate-fade-up-d7 mt-16 relative mx-auto max-w-5xl">
        <HeroImage
          src="/hero-tableo.png"
          alt="Interface Tabléo — menu digital QR code sur smartphone avec analytics restaurant en arrière-plan"
          width={2730}
          height={1536}
          priority
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
