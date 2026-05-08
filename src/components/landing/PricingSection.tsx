"use client";
import { Check, Zap, Shield, ArrowRight } from "lucide-react";
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
    <section id="pricing" className="py-24 md:py-32 bg-[#f5f7fa] relative">
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-semibold text-[#0070d1] mb-3 tracking-widest uppercase">Tarifs</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight text-[#0a0a0a]">
            Des tarifs <span className="text-[#0070d1]">transparents</span>
          </h2>
          <p className="mt-4 text-[#6b7280] text-[15px]">Commencez gratuitement. Évoluez quand vous êtes prêt.</p>

          {/* Toggle mensuel/annuel */}
          <div
            role="group"
            aria-label="Période de facturation"
            className="mt-8 inline-flex items-center gap-1 rounded-full bg-white border border-[#e8eaed] p-1"
          >
            <button
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all focus-ring ${
                !annual ? "bg-[#0070d1] text-white" : "text-[#6b7280] hover:text-[#0a0a0a]"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5 focus-ring ${
                annual ? "bg-[#0070d1] text-white" : "text-[#6b7280] hover:text-[#0a0a0a]"
              }`}
            >
              Annuel
              <span
                className={`text-[10px] rounded px-1.5 py-0.5 font-bold ${annual ? "bg-white/20 text-white" : "bg-[#0070d1]/10 text-[#0070d1]"}`}
                aria-label="économisez 20 pourcent"
              >
                -20%
              </span>
            </button>
          </div>

          {annual && (
            <p className="mt-3 text-[12px] text-emerald-600 font-medium">
              Économisez jusqu&apos;à <strong>120€/an</strong> avec la facturation annuelle
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-[8px] border p-8 flex flex-col transition-all duration-300 ${
                p.featured
                  ? "border-[#0070d1] bg-white shadow-[0_0_0_1px_#0070d1]"
                  : "border-[#e8eaed] bg-white hover:border-[#0070d1]/30"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#0070d1] px-3 py-1">
                  <Zap className="w-3 h-3 text-white" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-white">Plus populaire</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[15px] font-semibold text-[#0a0a0a]">{p.name}</h3>
                <p className="text-[13px] text-[#6b7280] mt-1">{p.desc}</p>
              </div>

              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-light text-[#0a0a0a] transition-all duration-300"
                    key={annual ? "annual" : "monthly"}
                    style={{ animation: "scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
                  >
                    {annual ? p.yearly : p.monthly}
                  </span>
                  <span className="text-[#6b7280] text-[14px]">{p.period}</span>
                </div>
                {annual && p.monthlyNum && p.yearlyNum && (
                  <p className="text-[12px] text-emerald-600 font-medium mt-1">
                    Soit {(p.monthlyNum - p.yearlyNum) * 12}€ économisés/an
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1 mt-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#6b7280]">
                    <Check className="w-4 h-4 text-[#0070d1] shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className={`w-full text-center rounded-full py-3 text-[13px] font-semibold transition-all focus-ring inline-flex items-center justify-center gap-2 group ${
                  p.featured
                    ? "bg-[#0070d1] text-white hover:bg-[#0082f0]"
                    : "border border-[#e8eaed] text-[#0a0a0a] hover:border-[#0070d1]/40 hover:text-[#0070d1]"
                }`}
              >
                {p.cta}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[12px] text-[#6b7280]">
          <Shield className="w-4 h-4 text-[#0070d1]/60" aria-hidden="true" />
          <span>Annulation gratuite à tout moment · Sans engagement · Paiement sécurisé</span>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#9ca3af]">
            Tous les plans incluent : SSL gratuit · Support email · Mises à jour automatiques · Dashboard analytics de base
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
