"use client";
import { Check, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    monthly: "Gratuit",
    yearly: "Gratuit",
    monthlyNum: 0,
    yearlyNum: 0,
    period: "",
    desc: "Pour découvrir Tableo",
    features: ["1 établissement", "Menu QR basique", "100 scans/mois", "Templates standards"],
    cta: "Commencer gratuitement",
    href: "/onboarding",
    featured: false,
  },
  {
    name: "Growth",
    monthly: "49€",
    yearly: "39€",
    monthlyNum: 49,
    yearlyNum: 39,
    period: "/mois",
    desc: "Pour les restaurants ambitieux",
    features: [
      "Jusqu'à 3 établissements",
      "Menu IA + traductions",
      "Scans illimités",
      "Commandes + paiements",
      "CRM + analytics",
      "Revenue Engine complet",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    href: "/onboarding?plan=growth",
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: "Sur mesure",
    yearly: "Sur mesure",
    monthlyNum: null,
    yearlyNum: null,
    period: "",
    desc: "Pour les franchises et groupes",
    features: [
      "Établissements illimités",
      "Solution white-label",
      "Accès API complet",
      "Account manager dédié",
      "Intégrations personnalisées",
      "SLA garanti",
    ],
    cta: "Contacter l'équipe",
    href: "/contact",
    featured: false,
  },
];

const PricingSection = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-semibold text-[#6b7280] mb-3 tracking-widest uppercase">Tarifs</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] text-[#111111]">
            Des tarifs transparents
          </h2>
          <p className="mt-4 text-[#374151] text-[15px]">Commencez gratuitement. Évoluez quand vous êtes prêt.</p>

          {/* Nav-pill-group toggle */}
          <div
            role="group"
            aria-label="Période de facturation"
            className="mt-8 inline-flex items-center gap-1 rounded-full bg-[#f5f5f5] p-1"
          >
            <button
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all focus-ring ${
                !annual
                  ? "bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "text-[#6b7280] hover:text-[#111111]"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5 focus-ring ${
                annual
                  ? "bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "text-[#6b7280] hover:text-[#111111]"
              }`}
            >
              Annuel
              <span
                className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${annual ? "bg-[#f5f5f5] text-[#374151]" : "bg-[#e5e7eb] text-[#374151]"}`}
                aria-label="économisez 20 pourcent"
              >
                -20%
              </span>
            </button>
          </div>

          {annual && (
            <p className="mt-3 text-[12px] text-[#34d399] font-medium">
              Économisez jusqu&apos;à <strong>120€/an</strong> avec la facturation annuelle
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-[12px] p-8 flex flex-col transition-all duration-300 ${
                p.featured
                  ? "bg-[#101010] text-white"
                  : "bg-[#f5f5f5]"
              }`}
            >
              <div className="mb-6">
                <h3 className={`text-[18px] font-semibold mb-1 ${p.featured ? "text-white" : "text-[#111111]"}`}>
                  {p.name}
                </h3>
                <p className={`text-[13px] ${p.featured ? "text-[#a1a1aa]" : "text-[#6b7280]"}`}>{p.desc}</p>
              </div>

              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-[clamp(1.8rem,4vw,2.2rem)] font-display font-semibold tracking-[-0.04em] transition-all duration-300 ${p.featured ? "text-white" : "text-[#111111]"}`}
                    key={annual ? "annual" : "monthly"}
                  >
                    {annual ? p.yearly : p.monthly}
                  </span>
                  <span className={`text-[14px] ${p.featured ? "text-[#a1a1aa]" : "text-[#6b7280]"}`}>{p.period}</span>
                </div>
                {annual && p.monthlyNum && p.yearlyNum && (
                  <p className="text-[12px] text-[#34d399] font-medium mt-1">
                    Soit {(p.monthlyNum - p.yearlyNum) * 12}€ économisés/an
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1 mt-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px]">
                    <Check className={`w-4 h-4 shrink-0 ${p.featured ? "text-[#a1a1aa]" : "text-[#111111]"}`} aria-hidden="true" />
                    <span className={p.featured ? "text-[#a1a1aa]" : "text-[#374151]"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className={`w-full text-center rounded-[8px] py-3 text-[14px] font-semibold transition-all focus-ring inline-flex items-center justify-center gap-2 group ${
                  p.featured
                    ? "bg-white text-[#111111] hover:bg-[#f5f5f5]"
                    : "bg-[#111111] text-white hover:bg-[#242424]"
                }`}
              >
                {p.cta}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[12px] text-[#6b7280]">
          <Shield className="w-4 h-4" aria-hidden="true" />
          <span>Annulation gratuite à tout moment · Sans engagement · Paiement sécurisé</span>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#898989]">
            Tous les plans incluent : SSL gratuit · Support email · Mises à jour automatiques · Dashboard analytics de base
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
