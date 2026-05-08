import { TrendingUp, Sparkles, Clock, Target } from "lucide-react";
import Image from "next/image";

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
  <section id="revenue" className="py-24 md:py-32 bg-[#000] relative overflow-hidden">
    {/* Structural blue glow from left */}
    <div
      className="absolute inset-y-0 left-0 w-[600px] pointer-events-none"
      style={{ background: "radial-gradient(ellipse 70% 60% at 0% 50%, rgba(0,112,209,0.08), transparent)" }}
      aria-hidden="true"
    />

    <div className="container mx-auto px-6 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[11px] font-semibold text-[#0070d1] mb-3 tracking-widest uppercase">Revenue Engine</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight text-white">
          Pas juste un menu.{" "}
          <span className="text-[#0070d1] italic">Un moteur de revenus.</span>
        </h2>
        <p className="mt-4 text-[15px] text-[#a8a8b3]">
          Chaque interaction client est une opportunité de revenus. Tableo les capture toutes.
        </p>
      </div>

      {/* Analytics illustration */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="rounded-[8px] border border-white/8 overflow-hidden">
          <Image
            src="/illus-analytics.svg"
            alt="Dashboard analytique Tabléo : revenus, commandes et scans QR en temps réel"
            width={760}
            height={440}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {engines.map((e) => (
          <div
            key={e.title}
            className="group rounded-[8px] border border-white/8 bg-[#121314] p-8 hover:border-[#0070d1]/30 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-[8px] bg-[#0070d1]/10 flex items-center justify-center group-hover:bg-[#0070d1] transition-colors duration-200">
                <e.icon className="w-5 h-5 text-[#0070d1] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-white">{e.metric}</div>
                <div className="text-[11px] text-[#a8a8b3]">{e.metricLabel}</div>
              </div>
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-2">{e.title}</h3>
            <p className="text-[13px] text-[#a8a8b3] leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RevenueSection;
