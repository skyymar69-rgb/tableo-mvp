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
  <section id="revenue" className="py-24 md:py-32 border-t border-border/50 relative overflow-hidden">
    {/* 25. Subtle pattern bg */}
    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(210, 40%, 96%) 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }} />
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px]" />
    <div className="container mx-auto px-6 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-sm font-semibold text-accent mb-3 tracking-wide uppercase">Revenue Engine</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Pas juste un menu.{" "}
          <span className="text-gradient-warm font-serif italic font-normal">Un moteur de revenus.</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Chaque interaction client est une opportunité de revenus. Tableo les capture toutes.
        </p>
      </div>

      {/* Analytics illustration */}
      <div className="max-w-4xl mx-auto mb-12 relative">
        <div className="absolute -inset-3 rounded-2xl bg-gradient-warm-subtle blur-xl opacity-60" />
        <div className="relative rounded-2xl border border-primary/20 overflow-hidden shadow-card">
          <Image
            src="/illus-analytics.svg"
            alt="Dashboard analytique Tabléo : revenus, commandes et scans QR en temps réel"
            width={760}
            height={440}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* 23. Counter animation feel, 24. Connecting accent lines, 26. Card hover scale + glow */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {engines.map((e, i) => (
          <div
            key={e.title}
            className="group rounded-2xl glass-warm p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-warm relative overflow-hidden"
          >
            {/* Subtle background orb on hover */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-3xl transition-all duration-700" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <e.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient-warm">{e.metric}</div>
                  <div className="text-xs text-muted-foreground">{e.metricLabel}</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{e.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RevenueSection;
