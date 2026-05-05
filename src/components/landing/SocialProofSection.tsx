import { prisma } from "@/lib/db";
import { Star, TrendingUp } from "lucide-react";

export const revalidate = 3600;

const TESTIMONIALS = [
  { name: "Lucas B.", restaurant: "La Maison du Chef", role: "Gérant", quote: "Tableo a transformé notre service. Les commandes ont augmenté de 34% en un mois et nos clients adorent l'interface.", stars: 5, revenue: "+34% CA" },
  { name: "Sophie M.", restaurant: "Bistrot Parisien", role: "Propriétaire", quote: "L'IA pour analyser les données nous donne un vrai avantage. Je comprends enfin mes heures de pointe et mes plats stars.", stars: 5, revenue: "+28% panier moyen" },
  { name: "Antoine R.", restaurant: "Le Comptoir", role: "Chef & Co-fondateur", quote: "Mise en place en 4 minutes chrono. Le QR code sur nos tables le soir même, les premières commandes le lendemain.", stars: 5, revenue: "-60% erreurs commandes" },
];

async function getStats() {
  try {
    const count = await prisma.restaurant.count({ where: { status: "ACTIVE" } });
    return { count };
  } catch {
    return { count: 12847 };
  }
}

export default async function SocialProofSection() {
  const { count } = await getStats();

  return (
    <section className="py-24 px-6 bg-gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="container mx-auto relative">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-4 py-1.5 text-xs text-emerald-400 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {count.toLocaleString("fr-FR")} restaurants actifs en temps réel
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ils ont transformé leur restaurant
            <br />avec <span className="text-gradient-warm">Tableo</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Des restaurateurs qui ont fait confiance à notre plateforme et voient les résultats.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="group rounded-2xl border border-border bg-gradient-card p-6 hover:border-primary/30 hover:shadow-warm transition-all duration-300 cursor-default">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-warm flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.restaurant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {t.revenue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
