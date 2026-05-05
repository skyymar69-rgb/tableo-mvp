"use client";

import { Heart, Plus, Star, Globe2, Wifi, Battery, Signal } from "lucide-react";
import Image from "next/image";

const dishes = [
  { img: "/placeholder.svg", name: "Saumon Mi-Cuit", desc: "Micro-pousses, crème citronnée", price: "24€", tag: "Populaire", rating: "4.9" },
  { img: "/placeholder.svg", name: "Fondant Chocolat", desc: "Feuille d'or, coulis de fruits rouges", price: "14€", tag: "Upsell IA", rating: "4.8" },
  { img: "/placeholder.svg", name: "Gin Artisanal", desc: "Romarin, pamplemousse rose", price: "12€", tag: "Happy Hour", rating: "4.7" },
];

const MobilePreviewSection = () => (
  <section className="py-24 md:py-32 border-t border-border/50">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Expérience Mobile</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Un menu qui donne envie.{" "}
            <span className="text-muted-foreground">Comme une app premium.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Navigation style Netflix, cartes visuelles, recommandations IA, re-commande en 1 clic. Vos clients n'ont jamais vu un menu aussi beau.
          </p>
          <div className="space-y-4">
            {[
              { icon: Globe2, text: "Multi-langues automatique", detail: "12+ langues détectées" },
              { icon: Heart, text: "Favoris et re-commande en 1 clic", detail: "Mémorisation intelligente" },
              { icon: Star, text: "Recommandations IA personnalisées", detail: "+28% de panier moyen" },
            ].map((f) => (
              <div key={f.text} className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-warm-subtle flex items-center justify-center shrink-0 group-hover:bg-gradient-warm transition-all duration-300">
                  <f.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{f.text}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* QR scan illustration */}
          <div className="relative w-full max-w-[320px]">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-warm-subtle blur-xl opacity-50" />
            <div className="relative rounded-2xl border border-primary/20 overflow-hidden shadow-card">
              <Image
                src="/illus-scan.svg"
                alt="Client scannant un QR code Tabléo sur sa table de restaurant"
                width={640}
                height={420}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="relative w-[300px] group">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-warm-subtle blur-2xl group-hover:blur-3xl transition-all duration-700" />
            <div className="absolute -inset-px rounded-[33px] bg-gradient-to-b from-border/50 to-transparent pointer-events-none" />
            <div className="relative rounded-[32px] border-2 border-border bg-card overflow-hidden shadow-card transition-transform duration-700 group-hover:-translate-y-2">
              <div className="flex justify-center pt-2">
                <div className="w-20 h-5 rounded-full bg-background border border-border" />
              </div>
              <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground">
                <span className="font-medium">9:41</span>
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-3" />
                </div>
              </div>
              <div className="px-5 pb-3">
                <h3 className="text-base font-bold text-foreground">Le Petit Bistro</h3>
                <p className="text-xs text-muted-foreground">Table 7 • Menu du soir</p>
              </div>
              <div className="flex gap-2 px-5 pb-4 overflow-hidden">
                {["Entrées", "Plats", "Desserts", "Boissons"].map((c, i) => (
                  <span key={c} className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${i === 0 ? "bg-gradient-warm text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {c}
                  </span>
                ))}
              </div>
              <div className="mx-5 mb-3 rounded-xl glass-warm p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">Recommandé pour vous</span>
                </div>
                <p className="text-xs text-muted-foreground">Basé sur vos préférences précédentes</p>
              </div>
              <div className="space-y-3 px-5 pb-6">
                {dishes.map((d) => (
                  <div key={d.name} className="flex gap-3 rounded-xl bg-secondary/50 p-3 hover:bg-secondary/80 transition-colors">
                    <div className="w-16 h-16 rounded-lg bg-secondary/80 flex items-center justify-center text-2xl shrink-0">🍽️</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground truncate">{d.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-warm text-primary-foreground font-medium shrink-0">{d.tag}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{d.desc}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-gradient-warm">{d.price}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-primary text-primary" />{d.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-muted-foreground hover:text-accent transition-colors cursor-pointer" />
                          <button className="w-6 h-6 rounded-full bg-gradient-warm flex items-center justify-center hover:scale-110 transition-transform">
                            <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pb-2">
                <div className="flex gap-1">
                  <div className="w-4 h-1 rounded-full bg-primary" />
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
              <div className="border-t border-border px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Votre commande</p>
                  <p className="text-sm font-bold text-foreground">50€ • 3 articles</p>
                </div>
                <button className="rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-105 transition-transform">
                  Commander
                </button>
              </div>
              <div className="flex justify-center py-2">
                <div className="w-28 h-1 rounded-full bg-foreground/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MobilePreviewSection;
