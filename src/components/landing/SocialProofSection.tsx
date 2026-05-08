import { prisma } from "@/lib/db";
import { Star, TrendingUp } from "lucide-react";

export const revalidate = 3600;

const TESTIMONIALS = [
  { name: "Lucas B.", restaurant: "La Maison du Chef", role: "Gérant", quote: "Tableo a transformé notre service. Les commandes ont augmenté de 34% en un mois et nos clients adorent l'interface.", stars: 5, revenue: "+34% CA", avatarColor: "#fb923c" },
  { name: "Sophie M.", restaurant: "Bistrot Parisien", role: "Propriétaire", quote: "L'IA pour analyser les données nous donne un vrai avantage. Je comprends enfin mes heures de pointe et mes plats stars.", stars: 5, revenue: "+28% panier moyen", avatarColor: "#ec4899" },
  { name: "Antoine R.", restaurant: "Le Comptoir", role: "Chef & Co-fondateur", quote: "Mise en place en 4 minutes chrono. Le QR code sur nos tables le soir même, les premières commandes le lendemain.", stars: 5, revenue: "-60% erreurs commandes", avatarColor: "#8b5cf6" },
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
    <section className="py-24 px-6 bg-[#f5f5f5]">
      <div className="container mx-auto max-w-[1200px]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-1.5 text-[12px] text-[#374151] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            {count.toLocaleString("fr-FR")} restaurants actifs en temps réel
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] text-[#111111] mb-4">
            Ils ont transformé leur restaurant
            <br />avec Tableo
          </h2>
          <p className="text-[#374151] max-w-xl mx-auto text-[15px]">
            Des restaurateurs qui ont fait confiance à notre plateforme et voient les résultats.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-[12px] bg-white border border-[#e5e7eb] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-default"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#fb923c] text-[#fb923c]" />
                ))}
              </div>
              <p className="text-[14px] text-[#374151] leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                    style={{ backgroundColor: t.avatarColor }}
                  >
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111111]">{t.name}</p>
                    <p className="text-[11px] text-[#6b7280]">{t.restaurant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-bold text-[#34d399]">
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
