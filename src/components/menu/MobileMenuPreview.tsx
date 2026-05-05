"use client";

import { useState } from "react";
import { Plus, Heart, Star, Wifi, Battery, Signal } from "lucide-react";
import { DISH_LABEL_EMOJI } from "@/lib/utils";

interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  labels: string[];
}

interface Category {
  id: string;
  name: string;
  dishes: Dish[];
}

export function MobileMenuPreview({ categories }: { categories: Category[] }) {
  const [activeCat, setActiveCat] = useState(0);

  const activeDishes = categories[activeCat]?.dishes.filter((d) => d.isAvailable) ?? [];

  return (
    <div className="relative group">
      <div className="absolute -inset-4 rounded-[40px] bg-gradient-warm-subtle blur-2xl opacity-40" />
      <div className="relative rounded-[32px] border-2 border-border bg-card overflow-hidden shadow-card max-h-[600px]">
        {/* Dynamic island */}
        <div className="flex justify-center pt-2">
          <div className="w-20 h-5 rounded-full bg-background border border-border" />
        </div>
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-1 text-[10px] text-muted-foreground">
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1"><Signal className="w-2.5 h-2.5" /><Wifi className="w-2.5 h-2.5" /><Battery className="w-3 h-2.5" /></div>
        </div>
        {/* Restaurant header */}
        <div className="px-4 pb-2">
          <h3 className="text-sm font-bold text-foreground">Le Petit Bistro</h3>
          <p className="text-[10px] text-muted-foreground">Table 7 • Menu du soir</p>
        </div>
        {/* Category tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(i)}
              className={`shrink-0 text-[10px] px-2.5 py-1.5 rounded-full font-medium transition-all ${i === activeCat ? "bg-gradient-warm text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {/* Dishes */}
        <div className="px-3 pb-4 space-y-2 overflow-y-auto max-h-[380px]">
          {activeDishes.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">Aucun plat disponible</p>
          ) : activeDishes.map((d) => (
            <div key={d.id} className="flex gap-2.5 rounded-xl bg-secondary/50 p-2.5">
              <div className="w-14 h-14 rounded-lg bg-secondary/80 flex items-center justify-center text-xl shrink-0">🍽️</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground truncate">{d.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {d.labels.slice(0, 2).map((l) => <span key={l} className="text-[10px]">{DISH_LABEL_EMOJI[l]}</span>)}
                    </div>
                  </div>
                  <Heart className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                {d.description && <p className="text-[9px] text-muted-foreground truncate mt-0.5">{d.description}</p>}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] font-bold text-gradient-warm">{d.price.toFixed(2)}€</span>
                  <button className="w-5 h-5 rounded-full bg-gradient-warm flex items-center justify-center hover:scale-110 transition-transform">
                    <Plus className="w-3 h-3 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between bg-card">
          <p className="text-[10px] font-medium text-foreground">Panier vide</p>
          <button className="rounded-lg bg-gradient-warm px-3 py-1.5 text-[10px] font-semibold text-primary-foreground">Commander</button>
        </div>
        {/* Home indicator */}
        <div className="flex justify-center py-1.5">
          <div className="w-20 h-1 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
