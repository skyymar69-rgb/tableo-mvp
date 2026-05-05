"use client";
import { Check, Sparkles, Shield } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    monthly: "Gratuit",
    yearly: "Gratuit",
    period: "",
    desc: "Pour découvrir Tableo",
    features: ["1 établissement", "Menu QR basique", "100 scans/mois", "Templates standards"],
    cta: "Commencer gratuitement",
    featured: false,
  },
  {
    name: "Growth",
    monthly: "49€",
    yearly: "39€",
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
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: "Sur mesure",
    yearly: "Sur mesure",
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
    featured: false,
  },
];

const PricingSection = () => {
  /* 35. Annual/monthly toggle */
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border/50 relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[140px]" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Tarifs</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Des tarifs <span className="text-gradient-warm">transparents</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Commencez gratuitement. Évoluez quand vous êtes prêt.</p>

          {/* #45 — Toggle mensuel/annuel avec role="group" + aria-pressed WCAG 4.1.2 */}
          <div
            role="group"
            aria-label="Période de facturation"
            className="mt-8 inline-flex items-center gap-1 rounded-full bg-secondary p-1"
          >
            <button
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all focus-ring ${
                !annual ? "bg-gradient-warm text-primary-foreground shadow-warm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 focus-ring ${
                annual ? "bg-gradient-warm text-primary-foreground shadow-warm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annuel
              <span
                className="text-[10px] bg-primary/20 text-primary rounded px-1.5 py-0.5 font-bold"
                aria-label="économisez 20 pourcent"
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                p.featured
                  ? "border-primary/40 bg-gradient-card shadow-warm hover:shadow-glow-warm"
                  : "border-border bg-card hover:border-border/80 hover:shadow-card"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-warm px-3 py-1">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                  <span className="text-xs font-semibold text-primary-foreground">Plus populaire</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">{annual ? p.yearly : p.monthly}</span>
                <span className="text-muted-foreground">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full text-center rounded-xl py-3 text-sm font-semibold transition-all focus-ring ${
                  p.featured
                    ? "bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-warm hover:scale-[1.02]"
                    : "border border-border text-foreground hover:bg-secondary/50"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* 38. Guarantee badge */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 text-primary/60" />
          <span>Annulation gratuite à tout moment • Sans engagement • Paiement sécurisé</span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
