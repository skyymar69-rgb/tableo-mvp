"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Plus, Minus, X, Heart, Star, ChevronDown, Search, Wifi, Battery, Signal, ArrowLeft, Gift, Sparkles, Check, CreditCard, Banknote, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fireOrderConfetti } from "@/lib/confetti";

/* ─── Demo Data ─────────────────────────────────────────────────── */

const RESTAURANT = {
  name: "Le Petit Bistro",
  description: "Cuisine française raffinée",
  table: "Table 7",
  primaryColor: "#F89544",
  logo: null as null | string,
};

const MENU_CATEGORIES = [
  {
    id: "starters",
    name: "Entrées",
    emoji: "🥗",
    dishes: [
      { id: "d1", name: "Tartare de Bœuf", description: "Bœuf haché, câpres, cornichons, moutarde de Dijon", price: 24, labels: ["🥩"], allergens: ["Moutarde"], popular: true, veg: false },
      { id: "d2", name: "Soupe à l'Oignon", description: "Gratinée au comté, pain grillé maison", price: 12, labels: ["🌿"], allergens: ["Gluten", "Lait"], popular: false, veg: true },
      { id: "d3", name: "Foie Gras Maison", description: "Chutney de figues, brioche toastée", price: 22, labels: [], allergens: ["Gluten", "Œuf"], popular: true, veg: false },
    ],
  },
  {
    id: "mains",
    name: "Plats",
    emoji: "🍽️",
    dishes: [
      { id: "d4", name: "Saumon Mi-Cuit", description: "Risotto crémeux, épinards, sauce citronnée", price: 26, labels: ["🐟"], allergens: ["Poisson"], popular: true, veg: false },
      { id: "d5", name: "Magret de Canard", description: "Sauce aux cerises, pommes sarladaises", price: 28, labels: ["🥩"], allergens: [], popular: true, veg: false },
      { id: "d6", name: "Risotto Truffe Noire", description: "Parmesan 24 mois, huile de truffe, copeaux de truffe", price: 32, labels: ["🌿", "✨"], allergens: ["Lait", "Gluten"], popular: true, veg: true },
      { id: "d7", name: "Pavé de Cabillaud", description: "Écrasé de pommes de terre, sauce vierge", price: 24, labels: ["🐟"], allergens: ["Poisson"], popular: false, veg: false },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    emoji: "🍮",
    dishes: [
      { id: "d8", name: "Fondant Chocolat", description: "Cœur coulant, glace vanille de Madagascar", price: 12, labels: ["✨"], allergens: ["Lait", "Œuf", "Gluten"], popular: true, veg: true },
      { id: "d9", name: "Crème Brûlée", description: "Vanille Bourbon, caramel craquant", price: 9, labels: ["🌿"], allergens: ["Lait", "Œuf"], popular: false, veg: true },
      { id: "d10", name: "Tarte Tatin", description: "Pommes caramélisées, crème fraîche", price: 11, labels: [], allergens: ["Gluten", "Lait", "Œuf"], popular: false, veg: true },
    ],
  },
  {
    id: "drinks",
    name: "Boissons",
    emoji: "🍷",
    dishes: [
      { id: "d11", name: "Verre de Vin Rouge", description: "Sélection du sommelier, chaque semaine", price: 8, labels: [], allergens: ["Sulfites"], popular: true, veg: true },
      { id: "d12", name: "Eau Pétillante", description: "San Pellegrino 75cl", price: 6, labels: ["💧"], allergens: [], popular: false, veg: true },
      { id: "d13", name: "Gin Artisanal", description: "Hendrick's, eau tonique, citron vert, concombre", price: 14, labels: [], allergens: [], popular: true, veg: true },
    ],
  },
];

/* ─── Types ─────────────────────────────────────────────────────── */

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
}

type Screen = "menu" | "cart" | "tip" | "confirm" | "done";

/* ─── Components ─────────────────────────────────────────────────── */

function DishCard({ dish, qty, onAdd, onRemove, onFavorite, isFav }: {
  dish: (typeof MENU_CATEGORIES[0]["dishes"])[0];
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onFavorite: () => void;
  isFav: boolean;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-3.5 hover:border-white/20 transition-all">
      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0 relative overflow-hidden">
        <span>{dish.labels[0] ?? "🍽️"}</span>
        {dish.popular && (
          <div className="absolute top-0 right-0 bg-[#F89544] rounded-bl-lg px-1">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{dish.name}</p>
            <p className="text-[10px] text-white/50 leading-tight mt-0.5 line-clamp-2">{dish.description}</p>
          </div>
          <button onClick={onFavorite} className="shrink-0">
            <Heart className={cn("w-4 h-4 transition-colors", isFav ? "fill-rose-400 text-rose-400" : "text-white/30")} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold" style={{ color: "#F89544" }}>{dish.price.toFixed(2)} €</span>
          <div className="flex items-center gap-2">
            {qty > 0 ? (
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-1 py-0.5">
                <button onClick={onRemove} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="text-sm font-bold text-white w-4 text-center">{qty}</span>
                <button onClick={onAdd} className="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" style={{ background: "#F89544" }}>
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <button onClick={onAdd} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-all hover:scale-110" style={{ background: "#F89544" }}>
                <Plus className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */

export default function PublicMenuPage() {
  const params = useParams();
  const slug = params.restaurantId as string;

  const { data: publicData } = useQuery({
    queryKey: ["public-menu", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/menu/${slug}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!slug && slug !== "demo",
  });

  const restaurantInfo = publicData?.restaurant ?? null;
  const publicMenu = publicData?.menu ?? null;

  const RESTAURANT_DATA = restaurantInfo ? {
    ...RESTAURANT,
    name: restaurantInfo.name,
    primaryColor: restaurantInfo.primaryColor ?? RESTAURANT.primaryColor,
  } : RESTAURANT;

  const menuCategories = publicMenu?.categories?.length
    ? publicMenu.categories.map((cat: any, i: number) => ({
        id: cat.id,
        name: cat.name,
        emoji: ["🥗", "🍽️", "🍮", "🍷"][i % 4],
        dishes: cat.dishes.map((d: any) => ({
          id: d.id,
          name: d.name,
          description: d.description ?? "",
          price: d.price,
          labels: d.labels?.slice(0, 2).map((l: string) => {
            const emojiMap: Record<string, string> = { VEGAN: "🌿", VEGETARIAN: "🥬", SPICY: "🌶️", GLUTEN_FREE: "✓", BESTSELLER: "⭐", CHEF_SPECIAL: "👨‍🍳" };
            return emojiMap[l] ?? "🍽️";
          }) ?? [],
          allergens: d.allergens ?? [],
          popular: d.popular ?? false,
          veg: d.veg ?? false,
        })),
      }))
    : MENU_CATEGORIES;

  const [activecat, setActiveCat] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [screen, setScreen] = useState<Screen>("menu");
  const [search, setSearch] = useState("");
  const [tip, setTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "cash">("card");
  const [loyaltyEmail, setLoyaltyEmail] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [excludedAllergens, setExcludedAllergens] = useState<Set<string>>(new Set());
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);

  const allAllergens = Array.from(new Set(
    menuCategories.flatMap((c: any) => c.dishes.flatMap((d: any) => d.allergens ?? []))
  )).sort() as string[];

  // Persist favorites to localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`tableo-favs-${slug}`);
    if (stored) setFavorites(new Set(JSON.parse(stored)));
  }, [slug]);

  const toggleFavorite = useCallback((dishId: string) => {
    setFavorites((f) => {
      const s = new Set(f);
      s.has(dishId) ? s.delete(dishId) : s.add(dishId);
      localStorage.setItem(`tableo-favs-${slug}`, JSON.stringify([...s]));
      return s;
    });
  }, [slug]);

  const toggleAllergen = (allergen: string) => {
    setExcludedAllergens((prev) => {
      const s = new Set(prev);
      s.has(allergen) ? s.delete(allergen) : s.add(allergen);
      return s;
    });
  };

  const filterDishes = (dishes: any[]) =>
    excludedAllergens.size === 0
      ? dishes
      : dishes.filter((d) => !(d.allergens ?? []).some((a: string) => excludedAllergens.has(a)));

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tipAmount = tip !== null ? tip / 100 * subtotal : customTip ? parseFloat(customTip) || 0 : 0;
  const total = subtotal + tipAmount;

  const addToCart = (dish: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.dishId === dish.id);
      if (existing) return prev.map((i) => i.dishId === dish.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, qty: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.dishId === dishId);
      if (!item) return prev;
      if (item.qty === 1) return prev.filter((i) => i.dishId !== dishId);
      return prev.map((i) => i.dishId === dishId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const cartQty = (dishId: string) => cart.find((i) => i.dishId === dishId)?.qty ?? 0;

  const allDishes = menuCategories.flatMap((c: any) => c.dishes);
  const searchResults = search
    ? allDishes.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()))
    : [];

  const placeOrder = () => {
    setScreen("done");
    fireOrderConfetti();
    toast.success("Commande envoyée en cuisine !");
  };

  if (screen === "done") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1320] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-400/20 flex items-center justify-center mb-6 animate-bounce">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Commande envoyée !</h1>
        <p className="text-white/60 text-sm mb-2">Votre commande est en préparation</p>
        <p className="text-white/40 text-xs mb-8">{RESTAURANT_DATA.table} • {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
        <div className="w-full max-w-xs bg-white/5 rounded-2xl border border-white/10 p-5 mb-6 text-left">
          {cart.map((item) => (
            <div key={item.dishId} className="flex justify-between text-sm text-white/80 py-1">
              <span>{item.qty}× {item.name}</span>
              <span className="text-white/50">{(item.price * item.qty).toFixed(2)} €</span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold text-white">
            <span>Total payé</span>
            <span style={{ color: "#F89544" }}>{total.toFixed(2)} €</span>
          </div>
        </div>
        {loyaltyEmail && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-6">
            <Gift className="w-4 h-4" />
            <span>Points fidélité ajoutés à {loyaltyEmail}</span>
          </div>
        )}
        <button
          onClick={() => { setCart([]); setScreen("menu"); setTip(null); }}
          className="rounded-2xl px-8 py-3 text-sm font-semibold text-white"
          style={{ background: "#F89544" }}
        >
          Retour au menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1320] flex flex-col max-w-md mx-auto relative">
      {/* Status bar simulation */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-white/40 shrink-0">
        <span className="font-semibold">9:41</span>
        <div className="flex items-center gap-1"><Signal className="w-2.5 h-2.5" /><Wifi className="w-2.5 h-2.5" /><Battery className="w-3 h-2.5" /></div>
      </div>

      {/* ── MENU SCREEN ── */}
      {screen === "menu" && (
        <>
          {/* Header */}
          <div className="px-5 pt-2 pb-4 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h1 className="text-lg font-bold text-white">{RESTAURANT_DATA.name}</h1>
                <p className="text-xs text-white/50">{RESTAURANT_DATA.table} • {RESTAURANT_DATA.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAllergenFilter(!showAllergenFilter)}
                  className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-colors", showAllergenFilter || excludedAllergens.size > 0 ? "bg-[#F89544]/20 text-[#F89544]" : "bg-white/10 text-white/70")}
                >
                  <Filter className="w-4 h-4" />
                  {excludedAllergens.size > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F89544] text-white text-[9px] font-bold flex items-center justify-center">{excludedAllergens.size}</span>}
                </button>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <Search className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>
            {showAllergenFilter && allAllergens.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">Exclure les allergènes :</p>
                <div className="flex flex-wrap gap-1.5">
                  {allAllergens.map((allergen) => (
                    <button
                      key={allergen}
                      onClick={() => toggleAllergen(allergen)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                        excludedAllergens.has(allergen)
                          ? "bg-red-500/20 border-red-500/40 text-red-300 line-through"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      )}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
                {excludedAllergens.size > 0 && (
                  <button onClick={() => setExcludedAllergens(new Set())} className="text-[10px] text-white/30 hover:text-white/50 mt-2 transition-colors">
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}
            {showSearch && (
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un plat..."
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Category tabs */}
          {!search && (
            <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-none shrink-0">
              {menuCategories.map((cat: any, i: number) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(i)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-medium transition-all",
                    i === activecat
                      ? "text-white shadow-lg"
                      : "bg-white/10 text-white/60 hover:text-white"
                  )}
                  style={i === activecat ? { background: "#F89544" } : {}}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Dishes */}
          <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3">
            {search ? (
              (() => {
                const results = filterDishes(searchResults);
                return results.length === 0 ? (
                  <p className="text-center text-white/40 text-sm py-12">Aucun résultat pour &ldquo;{search}&rdquo;</p>
                ) : results.map((dish) => (
                  <DishCard
                    key={dish.id} dish={dish} qty={cartQty(dish.id)}
                    onAdd={() => addToCart(dish)} onRemove={() => removeFromCart(dish.id)}
                    onFavorite={() => toggleFavorite(dish.id)}
                    isFav={favorites.has(dish.id)}
                  />
                ));
              })()
            ) : (
              (() => {
                const dishes = filterDishes(menuCategories[activecat]?.dishes ?? []);
                return dishes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/40 text-sm">Aucun plat sans {[...excludedAllergens].join(", ")}</p>
                    <button onClick={() => setExcludedAllergens(new Set())} className="text-[#F89544] text-xs mt-2 hover:underline">Retirer les filtres</button>
                  </div>
                ) : dishes.map((dish: any) => (
                  <DishCard
                    key={dish.id} dish={dish} qty={cartQty(dish.id)}
                    onAdd={() => addToCart(dish)} onRemove={() => removeFromCart(dish.id)}
                    onFavorite={() => toggleFavorite(dish.id)}
                    isFav={favorites.has(dish.id)}
                  />
                ));
              })()
            )}
          </div>

          {/* Cart FAB */}
          {totalItems > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
              <button
                onClick={() => setScreen("cart")}
                className="w-full flex items-center justify-between rounded-2xl px-5 py-4 shadow-2xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #F89544, #E879A0)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-bold">{totalItems}</span>
                  </div>
                  <span className="text-sm">Voir mon panier</span>
                </div>
                <span className="text-base font-bold">{subtotal.toFixed(2)} €</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── CART SCREEN ── */}
      {screen === "cart" && (
        <>
          <div className="px-5 pt-2 pb-4 flex items-center gap-3 shrink-0">
            <button onClick={() => setScreen("menu")} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-base font-bold text-white flex-1">Mon panier</h2>
            <span className="text-xs text-white/50">{RESTAURANT_DATA.table}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Votre panier est vide</p>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.dishId} className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-white/50">{item.price.toFixed(2)} € / unité</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-1 py-0.5">
                      <button onClick={() => removeFromCart(item.dishId)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-sm font-bold text-white w-4 text-center">{item.qty}</span>
                      <button onClick={() => addToCart({ id: item.dishId, name: item.name, price: item.price })} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#F89544" }}>
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-white/80 tabular-nums w-16 text-right">{(item.price * item.qty).toFixed(2)} €</span>
                  </div>
                ))}

                {/* Notes */}
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Instructions spéciales (allergies, préférences...)</label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="ex: sans noix, cuisson bien cuit..."
                    rows={2}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                  />
                </div>

                {/* Loyalty */}
                <div className="rounded-2xl bg-gradient-to-br from-[#F89544]/10 to-[#E879A0]/10 border border-[#F89544]/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4" style={{ color: "#F89544" }} />
                    <span className="text-sm font-semibold text-white">Programme fidélité</span>
                  </div>
                  <p className="text-xs text-white/50 mb-2">Gagnez {Math.floor(subtotal)} points sur cette commande</p>
                  <input
                    value={loyaltyEmail}
                    onChange={(e) => setLoyaltyEmail(e.target.value)}
                    placeholder="Votre email pour cumuler des points"
                    className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>

                {/* Summary */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>Sous-total</span>
                    <span className="tabular-nums">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2 mt-2">
                    <span>Total</span>
                    <span style={{ color: "#F89544" }} className="tabular-nums">{subtotal.toFixed(2)} €</span>
                  </div>
                </div>

                <button
                  onClick={() => setScreen("tip")}
                  className="w-full rounded-2xl py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #F89544, #E879A0)" }}
                >
                  Continuer → Paiement
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ── TIP SCREEN ── */}
      {screen === "tip" && (
        <>
          <div className="px-5 pt-2 pb-4 flex items-center gap-3 shrink-0">
            <button onClick={() => setScreen("cart")} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-base font-bold text-white flex-1">Pourboire</h2>
          </div>

          <div className="flex-1 px-5 space-y-6">
            <div className="text-center py-4">
              <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: "#F89544" }} />
              <p className="text-white/60 text-sm">L&apos;équipe vous remercie pour votre générosité !</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[0, 10, 15, 20, 25, null].map((pct, i) => (
                <button
                  key={i}
                  onClick={() => { setTip(pct); setCustomTip(""); }}
                  className={cn(
                    "rounded-2xl border py-4 text-center transition-all",
                    tip === pct && pct !== null
                      ? "border-[#F89544] bg-[#F89544]/20 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                  )}
                >
                  {pct === null ? (
                    <span className="text-sm font-medium">Autre</span>
                  ) : pct === 0 ? (
                    <span className="text-sm font-medium">Pas de<br />pourboire</span>
                  ) : (
                    <>
                      <p className="text-xl font-bold" style={tip === pct ? { color: "#F89544" } : {}}>{pct}%</p>
                      <p className="text-xs text-white/50">{(pct / 100 * subtotal).toFixed(2)} €</p>
                    </>
                  )}
                </button>
              ))}
            </div>

            {tip === null && (
              <div className="relative">
                <input
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  placeholder="Montant personnalisé (€)"
                  type="number"
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#F89544]/50"
                />
              </div>
            )}

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-sm" style={{ color: "#F89544" }}>
                  <span>Pourboire ({tip !== null ? tip + "%" : "personnalisé"})</span>
                  <span>+{tipAmount.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2">
                <span>Total</span>
                <span style={{ color: "#F89544" }}>{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={() => setScreen("confirm")}
              className="w-full rounded-2xl py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #F89544, #E879A0)" }}
            >
              Continuer → Paiement
            </button>

            <button onClick={() => setScreen("confirm")} className="w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors pb-4">
              Passer sans pourboire
            </button>
          </div>
        </>
      )}

      {/* ── CONFIRM SCREEN ── */}
      {screen === "confirm" && (
        <>
          <div className="px-5 pt-2 pb-4 flex items-center gap-3 shrink-0">
            <button onClick={() => setScreen("tip")} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-base font-bold text-white flex-1">Confirmer & Payer</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
            {/* Order recap */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Récapitulatif</p>
              {cart.map((item) => (
                <div key={item.dishId} className="flex justify-between text-sm text-white/80 py-1">
                  <span>{item.qty}× {item.name}</span>
                  <span className="tabular-nums">{(item.price * item.qty).toFixed(2)} €</span>
                </div>
              ))}
              <div className="border-t border-white/10 mt-3 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-white/50">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: "#F89544" }}>
                    <span>Pourboire</span>
                    <span>+{tipAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-1">
                  <span>Total</span>
                  <span style={{ color: "#F89544" }}>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-3">
                {([["card", "Carte bancaire", CreditCard], ["cash", "Espèces", Banknote]] as const).map(([method, label, Icon]) => (
                  <button
                    key={method}
                    onClick={() => setPayMethod(method)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border py-4 transition-all",
                      payMethod === method
                        ? "border-[#F89544] bg-[#F89544]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", payMethod === method ? "text-[#F89544]" : "text-white/50")} />
                    <span className={cn("text-xs font-medium", payMethod === method ? "text-white" : "text-white/50")}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {payMethod === "card" && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                <CreditCard className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-xs text-white/50">Le terminal de paiement sera apporté à votre table</p>
              </div>
            )}

            {payMethod === "cash" && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-xs text-white/50">Le serveur viendra encaisser votre commande</p>
              </div>
            )}

            <button
              onClick={placeOrder}
              className="w-full rounded-2xl py-4 text-base font-bold text-white shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #F89544, #E879A0)" }}
            >
              Envoyer la commande · {total.toFixed(2)} €
            </button>

            <p className="text-center text-[10px] text-white/30 pb-4">
              En confirmant, vous acceptez de payer ce montant au restaurant.
            </p>
          </div>
        </>
      )}

      {/* Home indicator */}
      <div className="flex justify-center py-2 shrink-0">
        <div className="w-24 h-1 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
