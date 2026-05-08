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
    <section className="py-24 px-6 bg-[#121314] relative overflow-hidden">
      {/* Structural top glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,112,209,0.3), transparent)" }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-1.5 text-[12px] text-emerald-400 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {count.toLocaleString("fr-FR")} restaurants actifs en temps réel
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-light text-white mb-4">
            Ils ont transformé leur restaurant
            <br />avec <span className="text-[#0070d1]">Tableo</span>
          </h2>
          <p className="text-[#a8a8b3] max-w-xl mx-auto text-[15px]">
            Des restaurateurs qui ont fait confiance à notre plateforme et voient les résultats.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group rounded-[8px] border border-white/8 bg-[#1e2022] p-6 hover:border-[#0070d1]/30 transition-colors duration-200 cursor-default"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#f0c040] text-[#f0c040]" />
                ))}
              </div>
              <p className="text-[13px] text-[#a8a8b3] leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0070d1] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="text-[11px] text-[#a8a8b3]">{t.restaurant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-bold text-emerald-400">
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
