"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, X, Check, CheckCheck, ShoppingBag, TrendingUp, AlertTriangle, Zap, Star } from "lucide-react";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  ORDER_NEW: { icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
  ORDER_READY: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  REVENUE_MILESTONE: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  LOW_STOCK: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  NEW_REVIEW: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  SYSTEM: { icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10" },
};

const DEMO_NOTIFS = [
  { id: "n1", type: "ORDER_NEW", title: "Nouvelle commande", message: "Table 4 — 86,50 €", read: false, createdAt: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: "n2", type: "ORDER_READY", title: "Commande prête", message: "Commande #ORD-003 prête à être servie", read: false, createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: "n3", type: "REVENUE_MILESTONE", title: "Objectif atteint 🎉", message: "Vous avez dépassé 5 000 € ce mois-ci !", read: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "n4", type: "LOW_STOCK", title: "Stock faible", message: "Saumon Mi-Cuit — plus que 3 portions", read: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "à l'instant";
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)} h`;
  return `il y a ${Math.floor(diff / 86400000)} j`;
}

export function NotificationsDrawer() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?restaurantId=${restaurantId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!restaurantId,
    refetchInterval: 30_000,
  });

  const notifications = data?.notifications?.length ? data.notifications : DEMO_NOTIFS;
  const unread = notifications.filter((n: any) => !n.read).length;

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notifications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await fetch("/api/notifications/read-all", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ restaurantId }) });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={drawerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full top-0 ml-2 w-80 rounded-2xl border border-border bg-card shadow-card overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unread > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{unread}</span>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={() => markAllRead.mutate()} className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Tout lire
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Aucune notification</p>
              </div>
            ) : notifications.map((n: any) => {
              const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.SYSTEM;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && markRead.mutate(n.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer hover:bg-secondary/30 transition-colors",
                    !n.read && "bg-primary/3"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                    <cfg.icon className={cn("w-3.5 h-3.5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-xs font-medium truncate", n.read ? "text-muted-foreground" : "text-foreground")}>{n.title}</p>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
