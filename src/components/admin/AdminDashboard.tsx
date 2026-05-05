"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, Building2, ShoppingBag, DollarSign, TrendingUp,
  ArrowLeft, Shield, Search, Crown, Zap, Star,
  AlertCircle, CheckCircle2, Clock, ChevronRight, RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-secondary text-muted-foreground",
  GROWTH: "bg-blue-500/20 text-blue-400",
  ENTERPRISE: "bg-purple-500/20 text-purple-400",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-400",
  ONBOARDING: "bg-yellow-500/20 text-yellow-400",
  SUSPENDED: "bg-red-500/20 text-red-400",
};

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-orange-500/20 text-orange-400",
  MANAGER: "bg-blue-500/20 text-blue-400",
  STAFF: "bg-secondary text-muted-foreground",
  ADMIN: "bg-purple-500/20 text-purple-400",
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color ?? "bg-secondary"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      {sub && <div className="text-xs text-primary font-medium mt-0.5">{sub}</div>}
    </div>
  );
}

export function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [userSearch, setUserSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tab, setTab] = useState<"overview" | "users" | "restaurants">("overview");
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(userSearch), 400);
    return () => clearTimeout(t);
  }, [userSearch]);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Accès refusé");
      return res.json();
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?q=${debouncedSearch}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    enabled: tab === "users",
  });

  const promoteUser = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Rôle mis à jour");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => refetchStats()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit">
          {(["overview", "users", "restaurants"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-gradient-warm text-primary-foreground shadow-warm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t === "overview" ? "Vue d'ensemble" : t === "users" ? "Utilisateurs" : "Restaurants"}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            {statsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : stats ? (
              <>
                {/* KPI Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} label="Utilisateurs total" value={stats.users.total} sub={`+${stats.users.today} aujourd'hui`} color="bg-blue-500/20 text-blue-400" />
                  <StatCard icon={Building2} label="Restaurants actifs" value={stats.restaurants.active} sub={`${stats.restaurants.total} au total`} color="bg-emerald-500/20 text-emerald-400" />
                  <StatCard icon={ShoppingBag} label="Commandes total" value={stats.orders.total.toLocaleString("fr-FR")} sub={`${stats.orders.today} aujourd'hui`} color="bg-orange-500/20 text-orange-400" />
                  <StatCard icon={DollarSign} label="Revenu plateforme" value={formatCurrency(stats.revenue.total)} sub={`${formatCurrency(stats.revenue.today)} aujourd'hui`} color="bg-purple-500/20 text-purple-400" />
                </div>

                {/* Growth + Subscriptions */}
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-border bg-gradient-card p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" /> Croissance utilisateurs
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Aujourd'hui", value: stats.users.today },
                        { label: "7 derniers jours", value: stats.users.last7 },
                        { label: "30 derniers jours", value: stats.users.last30 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-bold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-gradient-card p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-400" /> Abonnements
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "FREE", value: stats.subscriptions.free, color: "bg-secondary" },
                        { label: "GROWTH", value: stats.subscriptions.growth, color: "bg-blue-500/30" },
                        { label: "ENTERPRISE", value: stats.subscriptions.enterprise, color: "bg-purple-500/30" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${stats.subscriptions.free + stats.subscriptions.growth + stats.subscriptions.enterprise > 0 ? Math.round((item.value / (stats.subscriptions.free + stats.subscriptions.growth + stats.subscriptions.enterprise)) * 100) : 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-20">{item.label}</span>
                          <span className="text-sm font-bold text-foreground w-8 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-gradient-card p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" /> Statuts restaurants
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Actifs", value: stats.restaurants.active, icon: CheckCircle2, color: "text-emerald-400" },
                        { label: "En onboarding", value: stats.restaurants.onboarding, icon: Clock, color: "text-yellow-400" },
                        { label: "Suspendus", value: stats.restaurants.suspended, icon: AlertCircle, color: "text-red-400" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Users + Restaurants */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-border bg-gradient-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">Derniers inscrits</h3>
                      <button onClick={() => setTab("users")} className="text-xs text-primary hover:underline">Voir tout →</button>
                    </div>
                    <div className="space-y-3">
                      {stats.recentUsers?.map((u: any) => (
                        <div key={u.id} className="flex items-center justify-between gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                            {u.name?.charAt(0) ?? u.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{u.name ?? "—"}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${TIER_COLORS[u.subscription?.tier ?? "FREE"]}`}>
                            {u.subscription?.tier ?? "FREE"}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {format(new Date(u.createdAt), "dd/MM", { locale: fr })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-gradient-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">Derniers restaurants</h3>
                      <button onClick={() => setTab("restaurants")} className="text-xs text-primary hover:underline">Voir tout →</button>
                    </div>
                    <div className="space-y-3">
                      {stats.recentRestaurants?.map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                            {r.name?.charAt(0) ?? "R"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{r.owner?.email}</p>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[r.status]}`}>
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Accès refusé ou erreur de chargement.</p>
              </div>
            )}
          </>
        )}

        {tab === "users" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full max-w-sm rounded-xl bg-secondary border border-border pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
              {usersLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-secondary animate-pulse" />)}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-6 py-3 font-medium">Utilisateur</th>
                      <th className="px-4 py-3 font-medium">Rôle</th>
                      <th className="px-4 py-3 font-medium">Abonnement</th>
                      <th className="px-4 py-3 font-medium">Restaurants</th>
                      <th className="px-4 py-3 font-medium">Inscrit le</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.users?.map((u: any) => (
                      <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                              {u.name?.charAt(0) ?? u.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{u.name ?? "—"}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TIER_COLORS[u.subscription?.tier ?? "FREE"]}`}>
                            {u.subscription?.tier ?? "FREE"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.restaurants?.length ?? 0}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            defaultValue={u.role}
                            onChange={(e) => promoteUser.mutate({ userId: u.id, role: e.target.value })}
                            className="text-[10px] bg-secondary border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none"
                          >
                            {["OWNER", "MANAGER", "STAFF", "ADMIN"].map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === "restaurants" && (
          <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
            {statsLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-secondary animate-pulse" />)}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Restaurant</th>
                    <th className="px-4 py-3 font-medium">Propriétaire</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentRestaurants?.map((r: any) => (
                    <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                            {r.name?.charAt(0) ?? "R"}
                          </div>
                          <span className="text-xs font-medium text-foreground">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{r.owner?.email ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {format(new Date(r.createdAt), "dd/MM/yyyy", { locale: fr })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
