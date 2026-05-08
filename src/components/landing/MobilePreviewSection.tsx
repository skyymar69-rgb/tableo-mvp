"use client";

import { Heart, Plus, Star, Globe2, Wifi, Battery, Signal } from "lucide-react";
import Image from "next/image";

const dishes = [
  { img: "/placeholder.svg", name: "Saumon Mi-Cuit", desc: "Micro-pousses, crème citronnée", price: "24€", tag: "Populaire", rating: "4.9" },
  { img: "/placeholder.svg", name: "Fondant Chocolat", desc: "Feuille d'or, coulis de fruits rouges", price: "14€", tag: "Upsell IA", rating: "4.8" },
  { img: "/placeholder.svg", name: "Gin Artisanal", desc: "Romarin, pamplemousse rose", price: "12€", tag: "Happy Hour", rating: "4.7" },
];

const MobilePreviewSection = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="container mx-auto px-6 max-w-[1200px]">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[11px] font-semibold text-[#6b7280] mb-3 tracking-widest uppercase">Expérience Mobile</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] mb-6 text-[#111111]">
            Un menu qui donne envie.{" "}
            <span className="text-[#6b7280]">Comme une app premium.</span>
          </h2>
          <p className="text-[#374151] text-[15px] mb-8 leading-relaxed">
            Navigation style Netflix, cartes visuelles, recommandations IA, re-commande en 1 clic. Vos clients n&apos;ont jamais vu un menu aussi beau.
          </p>
          <div className="space-y-4">
            {[
              { icon: Globe2, text: "Multi-langues automatique", detail: "12+ langues détectées" },
              { icon: Heart, text: "Favoris et re-commande en 1 clic", detail: "Mémorisation intelligente" },
              { icon: Star, text: "Recommandations IA personnalisées", detail: "+28% de panier moyen" },
            ].map((f) => (
              <div key={f.text} className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-[8px] bg-[#f5f5f5] border border-[#e5e7eb] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:border-[#111111] transition-colors duration-200">
                  <f.icon className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#111111]">{f.text}</span>
                  <p className="text-[12px] text-[#6b7280] mt-0.5">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* QR scan illustration */}
          <div className="relative w-full max-w-[320px]">
            <div className="rounded-[12px] border border-[#e5e7eb] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <Image
                src="/illus-scan.svg"
                alt="Client scannant un QR code Tabléo sur sa table de restaurant"
                width={640}
                height={420}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative w-[300px] group">
            <div className="relative rounded-[32px] border border-[#e5e7eb] bg-white overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-transform duration-500 group-hover:-translate-y-2">
              <div className="flex justify-center pt-2">
                <div className="w-20 h-5 rounded-full bg-[#f5f5f5] border border-[#e5e7eb]" />
              </div>
              <div className="flex items-center justify-between px-6 py-2 text-[11px] text-[#6b7280]">
                <span className="font-medium">9:41</span>
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-3" />
                </div>
              </div>
              <div className="px-5 pb-3">
                <h3 className="text-[15px] font-semibold text-[#111111]">Le Petit Bistro</h3>
                <p className="text-[12px] text-[#6b7280]">Table 7 • Menu du soir</p>
              </div>
              <div className="flex gap-2 px-5 pb-4 overflow-hidden">
                {["Entrées", "Plats", "Desserts", "Boissons"].map((c, i) => (
                  <span key={c} className={`shrink-0 text-[11px] px-3 py-1.5 rounded-full font-medium transition-all ${i === 0 ? "bg-[#111111] text-white" : "bg-[#f5f5f5] text-[#374151]"}`}>
                    {c}
                  </span>
                ))}
              </div>
              <div className="mx-5 mb-3 rounded-[8px] bg-[#f5f5f5] p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3 h-3 text-[#111111]" />
                  <span className="text-[11px] font-medium text-[#111111]">Recommandé pour vous</span>
                </div>
                <p className="text-[11px] text-[#6b7280]">Basé sur vos préférences précédentes</p>
              </div>
              <div className="space-y-3 px-5 pb-6">
                {dishes.map((d) => (
                  <div key={d.name} className="flex gap-3 rounded-[8px] bg-[#f5f5f5] p-3 hover:bg-[#eef2f6] transition-colors">
                    <div className="w-16 h-16 rounded-[6px] bg-[#e5e7eb] flex items-center justify-center text-2xl shrink-0">🍽️</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-semibold text-[#111111] truncate">{d.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#111111] text-white font-medium shrink-0">{d.tag}</span>
                      </div>
                      <p className="text-[11px] text-[#6b7280] truncate">{d.desc}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[#111111]">{d.price}</span>
                          <span className="text-[10px] text-[#6b7280] flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-[#fb923c] text-[#fb923c]" />{d.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-[#6b7280] hover:text-red-400 transition-colors cursor-pointer" />
                          <button className="w-6 h-6 rounded-full bg-[#111111] flex items-center justify-center hover:bg-[#242424] transition-colors">
                            <Plus className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pb-2">
                <div className="flex gap-1">
                  <div className="w-4 h-1 rounded-full bg-[#111111]" />
                  <div className="w-1 h-1 rounded-full bg-[#e5e7eb]" />
                  <div className="w-1 h-1 rounded-full bg-[#e5e7eb]" />
                </div>
              </div>
              <div className="border-t border-[#e5e7eb] px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#6b7280]">Votre commande</p>
                  <p className="text-[13px] font-bold text-[#111111]">50€ • 3 articles</p>
                </div>
                <button className="rounded-full bg-[#111111] hover:bg-[#242424] px-4 py-2 text-[11px] font-semibold text-white transition-colors">
                  Commander
                </button>
              </div>
              <div className="flex justify-center py-2">
                <div className="w-28 h-1 rounded-full bg-[#111111]/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MobilePreviewSection;
