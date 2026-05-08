"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Clock, Check, ChefHat, Truck, X, RefreshCw, LayoutList, Columns, AlertCircle } from "lucide-react";
import { formatCurrency, formatElapsed } from "@/lib/utils";
import { toast } from "sonner";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { Skeleton } from "@/components/ui/skeleton";
import { fireOrderConfetti } from "@/lib/confetti";
import { PageHeader } from "@/components/dashboard/PageHeader";

const STATUS_CONFIG = {
  PENDING: { label: "En attente", color: "bg-yellow-400/15 text-yellow-400", icon: Clock },
  CONFIRMED: { label: "Confirmée", color: "bg-blue-400/15 text-blue-400", icon: Check },
  PREPARING: { label: "En préparation", color: "bg-primary/15 text-primary", icon: ChefHat },
  READY: { label: "Prête", color: "bg-emerald-400/15 text-emerald-400", icon: Check },
  DELIVERED: { label: "Livrée", color: "bg-emerald-500/15 text-emerald-500", icon: Truck },
  CANCELLED: { label: "Annulée", color: "bg-red-400/15 text-red-400", icon: X },
};

const NEXT_STATUS: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

type OrderItem = { name: string; qty: number; price: number };
type Order = { id: string; rawId: string; table: string; status: string; total: number; items: OrderItem[]; createdAt: string; createdAtIso: string; customer: string | null };

/* Demo orders use relative past times so elapsed timers work */
const now = Date.now();
const DEMO_ORDERS: Order[] = [
  { id: "ORD-001", rawId: "demo-1", table: "T4", status: "PREPARING", total: 86.50, items: [{ name: "Saumon Mi-Cuit", qty: 2, price: 26 }, { name: "Fondant Chocolat", qty: 2, price: 14 }, { name: "Verre de vin", qty: 2, price: 6.25 }], createdAt: "20:14", createdAtIso: new Date(now - 25 * 60_000).toISOString(), customer: null },
  { id: "ORD-002", rawId: "demo-2", table: "T7", status: "PENDING",   total: 34.00, items: [{ name: "Risotto Truffe", qty: 1, price: 28 }, { name: "Eau minérale", qty: 1, price: 6 }], createdAt: "20:21", createdAtIso: new Date(now - 7 * 60_000).toISOString(), customer: "Marie D." },
  { id: "ORD-003", rawId: "demo-3", table: "T2", status: "READY",     total: 112.00, items: [{ name: "Tartare Boeuf", qty: 3, price: 24 }, { name: "Gin Artisanal", qty: 4, price: 12 }], createdAt: "19:58", createdAtIso: new Date(now - 38 * 60_000).toISOString(), customer: null },
  { id: "ORD-004", rawId: "demo-4", table: "T1", status: "DELIVERED", total: 67.00, items: [{ name: "Magret de Canard", qty: 2, price: 28 }, { name: "Dessert du chef", qty: 1, price: 11 }], createdAt: "19:30", createdAtIso: new Date(now - 57 * 60_000).toISOString(), customer: "Thomas M." },
  { id: "ORD-005", rawId: "demo-5", table: "T5", status: "CONFIRMED", total: 45.50, items: [{ name: "Soupe à l'oignon", qty: 2, price: 12 }, { name: "Saumon Mi-Cuit", qty: 1, price: 26 }], createdAt: "20:28", createdAtIso: new Date(now - 3 * 60_000).toISOString(), customer: null },
];

function adaptOrder(o: any): Order {
  return {
    id: `#${o.id.slice(-6).toUpperCase()}`,
    rawId: o.id,
    table: o.table ? `T${o.table.number}` : "—",
    status: o.status,
    total: o.total,
    createdAt: new Date(o.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    createdAtIso: o.createdAt,
    customer: o.customer?.name ?? null,
    items: (o.items ?? []).map((i: any) => ({ name: i.dish?.name ?? "Plat", qty: i.quantity, price: i.unitPrice })),
  };
}

export default function OrdersPage() {
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;

  const { data: apiOrders, refetch, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/orders?restaurantId=${restaurantId}`);
      const json = await res.json();
      return (json.orders ?? []).map(adaptOrder) as Order[];
    },
    enabled: !!restaurantId,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false, // amélioration #9 : pas de polling si onglet inactif
  });

  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");

  useEffect(() => {
    if (apiOrders && apiOrders.length > 0) setOrders(apiOrders);
  }, [apiOrders]);

  const advance = async (rawId: string) => {
    let nextStatus = "";
    setOrders((prev) => prev.map((o) => {
      if (o.rawId !== rawId) return o;
      const next = NEXT_STATUS[o.status];
      if (!next) return o;
      nextStatus = next;
      if (next === "DELIVERED") fireOrderConfetti();
      toast.success(`→ ${STATUS_CONFIG[next as keyof typeof STATUS_CONFIG].label}`);
      return { ...o, status: next };
    }));
    if (restaurantId && nextStatus && !rawId.startsWith("demo-")) {
      try {
        const res = await fetch(`/api/orders/${rawId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        console.error("[orders] advance failed:", err);
        toast.error("Impossible de mettre à jour la commande");
      }
    }
  };

  const cancel = async (rawId: string) => {
    setOrders((prev) => prev.map((o) => o.rawId === rawId ? { ...o, status: "CANCELLED" } : o));
    setSelectedId(null);
    toast.error("Commande annulée");
    if (restaurantId && !rawId.startsWith("demo-")) {
      try {
        const res = await fetch(`/api/orders/${rawId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELLED" }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        console.error("[orders] cancel failed:", err);
        toast.error("Impossible d'annuler la commande");
      }
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const selected = orders.find((o) => o.rawId === selectedId);

  const counts = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    PREPARING: orders.filter((o) => o.status === "PREPARING").length,
    READY: orders.filter((o) => o.status === "READY").length,
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* #37 — PageHeader réutilisable remplace le sticky header inline */}
      <PageHeader
        title="Commandes"
        subtitle={`${orders.length} commande${orders.length > 1 ? "s" : ""} aujourd'hui`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {Object.entries(counts).map(([status, count]) => count > 0 && (
                <span key={status} className={`text-[10px] px-2 py-1 rounded-full font-semibold ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].color}`}>
                  {count} {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
                </span>
              ))}
            </div>
            <div role="group" aria-label="Vue des commandes" className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                aria-label="Vue liste"
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all focus-ring ${view === "list" ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutList className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setView("kanban")}
                aria-pressed={view === "kanban"}
                aria-label="Vue kanban"
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all focus-ring ${view === "kanban" ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Columns className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <button
              onClick={() => refetch()}
              aria-label="Actualiser les commandes"
              className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        }
      />

      {view === "kanban" ? (
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED"] as const).map((status) => {
              const cfg = STATUS_CONFIG[status];
              const col = orders.filter((o) => o.status === status);
              return (
                <div key={status} className="w-72 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-muted-foreground">{col.length}</span>
                  </div>
                  <div className="space-y-3">
                    {/* Amélioration #18 : article sémantique + button accessible */}
                    {col.map((order) => {
                      const nextStatus = NEXT_STATUS[order.status];
                      return (
                        <article
                          key={order.rawId}
                          className="rounded-xl border border-border bg-gradient-card p-4 hover:border-primary/20 hover:shadow-card transition-all card-hover-premium"
                          aria-label={`Commande ${order.id}, table ${order.table}, ${formatCurrency(order.total)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-foreground">{order.id}</span>
                            <time className="text-xs text-muted-foreground">{order.createdAt}</time>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">Table {order.table}{order.customer ? ` • ${order.customer}` : ""}</p>
                          <p className="text-[11px] text-muted-foreground/70 mb-3 line-clamp-2">{order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{formatCurrency(order.total)}</span>
                            {nextStatus && (
                              <button
                                onClick={() => advance(order.rawId)}
                                aria-label={`Passer la commande ${order.id} à "${STATUS_CONFIG[nextStatus as keyof typeof STATUS_CONFIG].label}"`}
                                className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors focus-ring rounded px-1"
                              >
                                → {STATUS_CONFIG[nextStatus as keyof typeof STATUS_CONFIG].label}
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                    {col.length === 0 && (
                      <div className="rounded-xl border border-dashed border-border p-6 text-center">
                        <p className="text-xs text-muted-foreground/50">Aucune commande</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* #27 — Compteur par statut dans les onglets filtres */}
          <div className="flex items-center gap-1 bg-secondary rounded-xl p-1 w-fit flex-wrap">
            {[
              ["all",       "Toutes",       orders.length],
              ["PENDING",   "En attente",   orders.filter(o => o.status === "PENDING").length],
              ["PREPARING", "En cuisine",   orders.filter(o => o.status === "PREPARING").length],
              ["READY",     "Prêtes",       orders.filter(o => o.status === "READY").length],
              ["DELIVERED", "Livrées",      orders.filter(o => o.status === "DELIVERED").length],
            ].map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key as string)}
                aria-pressed={filter === key}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-ring ${filter === key ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
                {(count as number) > 0 && (
                  <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${filter === key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-border text-muted-foreground"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {ordersLoading && restaurantId && [...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-gradient-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            ))}
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
              const nextStatus = NEXT_STATUS[order.status];
              const isSelected = selectedId === order.rawId;
              /* #28 — Calcul urgence : >20min en PENDING/PREPARING */
              const elapsedMs = Date.now() - new Date(order.createdAtIso).getTime();
              const elapsedMin = Math.floor(elapsedMs / 60_000);
              const isUrgent = ["PENDING", "PREPARING"].includes(order.status) && elapsedMin >= 20;
              return (
                <article key={order.rawId} className={`rounded-2xl border bg-gradient-card transition-all hover:border-primary/20 ${isSelected ? "border-primary/40 shadow-warm" : isUrgent ? "border-red-500/40 urgent" : "border-border"}`}>
                  {/* #33 clickable region as accessible button */}
                  <button
                    onClick={() => setSelectedId(isSelected ? null : order.rawId)}
                    aria-expanded={isSelected}
                    aria-label={`Commande ${order.id}, table ${order.table}, ${order.status}`}
                    className="w-full text-left p-5 focus-ring rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">{order.id}</span>
                        <span className="text-xs font-medium text-muted-foreground">Table {order.table}</span>
                        {order.customer && <span className="text-xs text-muted-foreground">• {order.customer}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* #28 — Timer écoulé + indicateur d'urgence */}
                        {["PENDING", "PREPARING", "CONFIRMED"].includes(order.status) && (
                          <span className={`flex items-center gap-1 text-[10px] font-medium tabular-nums ${isUrgent ? "text-red-400 animate-badge-pulse" : "text-muted-foreground"}`}>
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            {formatElapsed(order.createdAtIso)}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                          <cfg.icon className="w-2.5 h-2.5" aria-hidden="true" />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(order.total)}</span>
                    </div>
                  </button>
                  {nextStatus && (
                    <div className="px-5 pb-4 flex justify-end">
                      <button
                        onClick={() => advance(order.rawId)}
                        aria-label={`Passer la commande ${order.id} à ${STATUS_CONFIG[nextStatus as keyof typeof STATUS_CONFIG].label}`}
                        className="rounded-lg bg-gradient-warm px-3 py-1.5 text-[10px] font-semibold text-primary-foreground hover:scale-[1.02] transition-all"
                      >
                        → {STATUS_CONFIG[nextStatus as keyof typeof STATUS_CONFIG].label}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div>
          {selected ? (
            <div className="rounded-2xl border border-border bg-gradient-card p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-1">{selected.id}</h3>
              <p className="text-xs text-muted-foreground mb-4">Table {selected.table} • {selected.createdAt}</p>
              <div className="space-y-2 mb-4">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.qty}× {item.name}</span>
                    <span className="text-muted-foreground tabular-nums">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-base font-bold text-foreground">{formatCurrency(selected.total)}</span>
              </div>
              <div className="mt-4 space-y-2">
                {NEXT_STATUS[selected.status] && (
                  <button onClick={() => advance(selected.rawId)} className="w-full rounded-xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground hover:scale-[1.01] transition-all">
                    Passer à : {STATUS_CONFIG[NEXT_STATUS[selected.status] as keyof typeof STATUS_CONFIG].label}
                  </button>
                )}
                <button onClick={() => cancel(selected.rawId)} className="w-full rounded-xl border border-destructive/30 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  Annuler la commande
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-gradient-card p-8 text-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Cliquez sur une commande pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
