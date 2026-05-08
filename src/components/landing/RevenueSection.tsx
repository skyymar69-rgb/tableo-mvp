import { TrendingUp, Sparkles, Clock, Target } from "lucide-react";
import { Illustration } from "./Illustration";

const engines = [
  {
    icon: TrendingUp,
    title: "Smart Upsell Engine",
    desc: "Suggestions intelligentes de boissons, desserts et menus. Déclenchement basé sur le comportement. A/B testing automatique.",
    metric: "+28%",
    metricLabel: "panier moyen",
  },
  {
    icon: Sparkles,
    title: "Optimisation Dynamique",
    desc: "Mise en avant des plats à forte marge. Masquage des plats sous-performants. Recommandations IA de pricing.",
    metric: "+35%",
    metricLabel: "marge brute",
  },
  {
    icon: Clock,
    title: "Promotions Intelligentes",
    desc: "Happy hour automatique, offres temporelles, promotions géo-ciblées. Tout se déclenche sans intervention.",
    metric: "+22%",
    metricLabel: "de trafic hors-peak",
  },
  {
    icon: Target,
    title: "Conversion Maximale",
    desc: "Chaque QR scan est optimisé pour convertir. Parcours personnalisé, favoris, re-commande en 1 clic.",
    metric: "3.2x",
    metricLabel: "taux de conversion",
  },
];

const RevenueSection = () => (
  <section id="revenue" className="py-24 md:py-32 bg-white">
    <div className="container mx-auto px-6 max-w-[1200px]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[11px] font-semibold text-[#6b7280] mb-3 tracking-widest uppercase">Revenue Engine</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] text-[#111111]">
          Pas juste un menu.{" "}
          <span className="text-[#6b7280]">Un moteur de revenus.</span>
        </h2>
        <p className="mt-4 text-[15px] text-[#374151]">
          Chaque interaction client est une opportunité de revenus. Tableo les capture toutes.
        </p>
      </div>

      {/* Illustration : tableau de bord performance restaurant */}
      <figure className="max-w-md mx-auto mb-12">
        <div className="rounded-[16px] border border-[#e5e7eb] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <Illustration
            slug="analytics-dashboard"
            alt="Tableau de bord analytique Tabléo affiché sur écran d'ordinateur — KPI temps réel : CRM client, revenus par table, performance des plats et fréquentation pour piloter un restaurant"
            sizes="(max-width: 768px) 100vw, 480px"
          />
        </div>
      </figure>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {engines.map((e) => (
          <div
            key={e.title}
            className="group rounded-[12px] bg-[#f5f5f5] p-8 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-[8px] bg-white border border-[#e5e7eb] flex items-center justify-center group-hover:bg-[#111111] group-hover:border-[#111111] transition-colors duration-200">
                <e.icon className="w-5 h-5 text-[#111111] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-semibold tracking-[-0.04em] text-[#111111]">{e.metric}</div>
                <div className="text-[11px] text-[#6b7280]">{e.metricLabel}</div>
              </div>
            </div>
            <h3 className="text-[15px] font-semibold text-[#111111] mb-2">{e.title}</h3>
            <p className="text-[13px] text-[#374151] leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RevenueSection;
