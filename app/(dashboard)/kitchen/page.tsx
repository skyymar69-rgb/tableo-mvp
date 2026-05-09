"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChefHat, Clock, Check, AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";
import { formatElapsed } from "@/lib/utils";
import { toast } from "sonner";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";

type OrderItem = { name: string; qty: number; notes?: string };
type KitchenOrder = {
  id: string;
  rawId: string;
  table: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY";
  items: OrderItem[];
  createdAtIso: string;
  notes?: string;
};

const STATUS_CONFIG = {
  PENDING:   { label: "À préparer", ring: "ring-yellow-400/60", bg: "bg-yellow-400/8",  dot: "bg-yellow-400" },
  CONFIRMED: { label: "À préparer", ring: "ring-blue-400/60",   bg: "bg-blue-400/8",    dot: "bg-blue-400" },
  PREPARING: { label: "En cours",   ring: "ring-primary/60",    bg: "bg-primary/8",     dot: "bg-primary animate-pulse" },
  READY:     { label: "Prête",      ring: "ring-emerald-400/60",bg: "bg-emerald-400/8", dot: "bg-emerald-400" },
};

const DEMO_ORDERS: KitchenOrder[] = [
  { id: "#001042", rawId: "demo-1", table: "T4", status: "PREPARING", items: [{ name: "Saumon Mi-Cuit", qty: 2 }, { name: "Fondant Chocolat", qty: 2 }], createdAtIso: new Date(Date.now() - 14 * 60_000).toISOString() },
  { id: "#001043", rawId: "demo-2", table: "T7", status: "PENDING",   items: [{ name: "Risotto Truffe", qty: 1 }, { name: "Tartare Bœuf", qty: 2, notes: "Sans oignon" }], createdAtIso: new Date(Date.now() - 3 * 60_000).toISOString() },
  { id: "#001044", rawId: "demo-3", table: "T2", status: "PREPARING", items: [{ name: "Magret de Canard", qty: 3 }, { name: "Gin Artisanal", qty: 2 }], createdAtIso: new Date(Date.now() - 22 * 60_000).toISOString() },
  { id: "#001045", rawId: "demo-4", table: "T5", status: "CONFIRMED", items: [{ name: "Soupe à l'oignon", qty: 2 }, { name: "Crème brûlée", qty: 1, notes: "Allergie noix" }], createdAtIso: new Date(Date.now() - 1 * 60_000).toISOString() },
];

function adaptOrder(o: any): KitchenOrder {
  return {
    id: `#${o.id.slice(-6).toUpperCase()}`,
    rawId: o.id,
    table: o.table ? `T${o.table.number}` : "—",
    status: o.status,
    items: (o.items ?? []).map((i: any) => ({ name: i.dish?.name ?? "Plat", qty: i.quantity, notes: i.notes ?? undefined })),
    createdAtIso: o.createdAt,
    notes: o.notes ?? undefined,
  };
}

function ElapsedTimer({ iso }: { iso: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  const urgent = min >= 20;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold tabular-nums", urgent ? "text-red-400" : "text-muted-foreground")}>
      <Clock className="w-3 h-3" aria-hidden="true" />
      {min < 1 ? "< 1 min" : `${min} min`}
      {urgent && <AlertCircle className="w-3 h-3 text-red-400 animate-badge-pulse" aria-hidden="true" />}
    </span>
  );
}

export default function KitchenPage() {
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;

  const { data: apiOrders, refetch, isLoading } = useQuery({
    queryKey: ["kitchen-orders", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/orders?restaurantId=${restaurantId}&status=PENDING,CONFIRMED,PREPARING`);
      const json = await res.json();
      return (json.orders ?? []).map(adaptOrder) as KitchenOrder[];
    },
    enabled: !!restaurantId,
    refetchInterval: 8_000,
    refetchIntervalInBackground: false,
  });

  const orders = apiOrders ?? DEMO_ORDERS;

  const patchOrder = async (rawId: string, status: string) => {
    if (rawId.startsWith("demo-")) return;
    try {
      const res = await fetch(`/api/orders/${rawId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      refetch();
    } catch (err) {
      console.error("[kitchen] patch failed:", err);
      toast.error("Erreur de mise à jour");
    }
  };

  const markReady = (rawId: string) => {
    toast.success("Commande marquée Prête !");
    patchOrder(rawId, "READY");
  };

  const startPreparing = (rawId: string) => {
    toast.success("Préparation lancée !");
    patchOrder(rawId, "PREPARING");
  };

  const pending = useMemo(() => orders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED"), [orders]);
  const preparing = useMemo(() => orders.filter((o) => o.status === "PREPARING"), [orders]);
  const ready = useMemo(() => orders.filter((o) => o.status === "READY"), [orders]);

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-primary" aria-hidden="true" />
            Mode Cuisine
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wide">Live</span>
          </span>
        }
        subtitle={
          <span className="flex items-center gap-1.5">
            <Link href="/orders" className="hover:text-foreground transition-colors">← Commandes</Link>
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-yellow-400">{pending.length}</span> à préparer ·
              <span className="font-semibold text-primary">{preparing.length}</span> en cours ·
              <span className="font-semibold text-emerald-400">{ready.length}</span> prêtes
            </div>
            <button
              onClick={() => refetch()}
              aria-label="Rafraîchir les commandes cuisine"
              className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        }
      />

      {/* Kanban Kitchen */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* À préparer */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <h2 className="text-sm font-semibold text-foreground">À préparer</h2>
            <span className="text-xs text-muted-foreground ml-auto">{pending.length}</span>
          </div>
          <div className="space-y-4">
            {pending.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="text-xs text-muted-foreground">Aucune commande en attente</p>
              </div>
            )}
            {pending.map((order) => (
              <KitchenCard key={order.rawId} order={order} onAction={() => startPreparing(order.rawId)} actionLabel="Commencer" />
            ))}
          </div>
        </div>

        {/* En préparation */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <h2 className="text-sm font-semibold text-foreground">En préparation</h2>
            <span className="text-xs text-muted-foreground ml-auto">{preparing.length}</span>
          </div>
          <div className="space-y-4">
            {preparing.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="text-xs text-muted-foreground">Aucune commande en cours</p>
              </div>
            )}
            {preparing.map((order) => (
              <KitchenCard key={order.rawId} order={order} onAction={() => markReady(order.rawId)} actionLabel="Prête ✓" actionVariant="success" />
            ))}
          </div>
        </div>

        {/* Prêtes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-semibold text-foreground">Prêtes à servir</h2>
            <span className="text-xs text-muted-foreground ml-auto">{ready.length}</span>
          </div>
          <div className="space-y-4">
            {ready.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="text-xs text-muted-foreground">Aucune commande prête</p>
              </div>
            )}
            {ready.map((order) => (
              <KitchenCard key={order.rawId} order={order} onAction={undefined} actionLabel="" done />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KitchenCard({ order, onAction, actionLabel, actionVariant = "default", done = false }: {
  order: KitchenOrder;
  onAction?: () => void;
  actionLabel: string;
  actionVariant?: "default" | "success";
  done?: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const ms = Date.now() - new Date(order.createdAtIso).getTime();
  const urgent = !done && Math.floor(ms / 60_000) >= 20;

  return (
    <article
      className={cn(
        "rounded-2xl border-2 bg-gradient-card p-5 transition-all",
        urgent ? "border-red-400/50 urgent" : `ring-2 ${cfg.ring} border-transparent`,
        done && "opacity-60"
      )}
      aria-label={`Commande ${order.id}, table ${order.table}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-base font-bold text-foreground">{order.id}</p>
          <p className="text-xs text-muted-foreground">Table {order.table}</p>
        </div>
        <ElapsedTimer iso={order.createdAtIso} />
      </div>

      <ul className="space-y-2 mb-4" aria-label="Articles de la commande">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={cn(
              "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold",
              done ? "bg-secondary text-muted-foreground" : "bg-gradient-warm text-primary-foreground"
            )}>
              {item.qty}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              {item.notes && (
                <p className="text-[11px] text-yellow-400 mt-0.5 font-medium">{item.notes}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {order.notes && (
        <div className="rounded-lg bg-yellow-400/10 border border-yellow-400/20 px-3 py-2 mb-3">
          <p className="text-xs text-yellow-400 font-medium">Note : {order.notes}</p>
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className={cn(
            "w-full rounded-xl py-2.5 text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99]",
            actionVariant === "success"
              ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/25"
              : "bg-gradient-warm text-primary-foreground"
          )}
        >
          {actionLabel}
        </button>
      )}
      {done && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold py-1">
          <Check className="w-3.5 h-3.5" /> Prête
        </div>
      )}
    </article>
  );
}
