"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  TrendingUp, DollarSign, ShoppingCart, QrCode, BarChart3,
  ArrowUpRight, ArrowDownRight, Bell, Search, Calendar,
  MoreHorizontal, Sparkles, Zap, RefreshCw, Plus,
  UtensilsCrossed, Target, Users, Clock, ChevronRight,
  CheckCircle2, AlertCircle, Activity,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar,
} from "recharts";

interface DashboardData {
  restaurant: any;
  kpis: {
    revenueToday: number;
    revenueChange: string | null;
    ordersToday: number;
    ordersChange: string | null;
    scansToday: number;
    avgOrder: number;
  };
  topDishes: Array<{ id: string; name: string; orders: number; revenue: number; margin: number; trend: string }>;
  tables: Array<{ id: string; number: string; status: string; capacity: number }>;
  chartData: Array<{ date: string; revenue: number; orders: number; scans: number }>;
  activeTables: number;
  totalTables: number;
}

/* Amélioration #7 : cancelAnimationFrame au cleanup — évite les memory leaks */
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current); // annule l'animation précédente si value change rapidement
    const start     = prevRef.current;
    const end       = value;
    const duration  = 700;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplayed(start + (end - start) * ease);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  const formatted = displayed % 1 === 0
    ? Math.round(displayed).toLocaleString("fr-FR")
    : displayed.toFixed(2);

  return <span aria-live="polite" aria-atomic="true">{prefix}{formatted}{suffix}</span>;
}

/* Amélioration #8 : SVG natif léger — 0 dépendance Recharts pour les sparklines */
function SparkLine({ data, dataKey, color }: { data: Array<Record<string, number | string>>; dataKey: string; color: string }) {
  const values = data.map((d) => Number(d[dataKey] ?? 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 100, H = 32, pad = 2;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  const area = `M${pad},${H} L${points.replace(/(\d+\.\d+|\d+),(\d+\.\d+|\d+)/g, (_, x, y) => `${x},${y} `).trim()} L${W - pad},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${dataKey})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-card text-xs">
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {p.dataKey === "revenue" ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const TABLE_STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string }> = {
  OCCUPIED: { label: "Occupée", bg: "glass-warm border-primary/30", dot: "bg-primary animate-pulse" },
  RESERVED: { label: "Réservée", bg: "bg-blue-500/10 border-blue-500/30", dot: "bg-blue-400" },
  CLEANING: { label: "Nettoyage", bg: "bg-yellow-500/10 border-yellow-500/30", dot: "bg-yellow-400" },
  IDLE: { label: "Libre", bg: "border-border bg-secondary/30", dot: "bg-muted-foreground/40" },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

/* Amélioration #19 : objectif journalier issu des settings ou paramètre */
const DEFAULT_DAILY_GOAL = 2000;

export function DashboardClient({
  data,
  restaurantId,
  dailyGoal = DEFAULT_DAILY_GOAL,
}: {
  data: DashboardData | null;
  restaurantId: string;
  dailyGoal?: number;
}) {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [kpis, setKpis] = useState(data?.kpis);
  const [liveIndicator, setLiveIndicator] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);
  const [chartType, setChartType] = useState<"revenue" | "orders">("revenue");
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    const es = new EventSource(`/api/sse?restaurantId=${restaurantId}`);

    es.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload.type === "heartbeat" && payload.kpis) {
        setLiveIndicator(true);
        setTimeout(() => setLiveIndicator(false), 1000);
        if (payload.kpis.orders > 0) {
          toast.success("Nouvelle commande reçue !", { icon: "🛎️" });
          setNotifications((prev) => [{ id: Date.now().toString(), message: "Nouvelle commande" }, ...prev].slice(0, 5));
        }
      }
    };

    return () => es.close();
  }, [restaurantId]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4 shadow-warm">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenue sur Tableo !</h2>
            <p className="text-muted-foreground">Configurez votre restaurant en 3 étapes pour commencer à recevoir des commandes.</p>
          </div>
          <div className="space-y-3 mb-8">
            {[
              { step: 1, label: "Créez votre restaurant", desc: "Nom, adresse, logo", href: "/onboarding" },
              { step: 2, label: "Ajoutez votre menu", desc: "Importez avec l'IA en 30 secondes", href: "/menu" },
              { step: 3, label: "Générez vos QR Codes", desc: "Un code par table, prêt à imprimer", href: "/qr" },
            ].map((s) => (
              <a key={s.step} href={s.href} className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-card p-4 hover:border-primary/30 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </a>
            ))}
          </div>
          <a href="/onboarding" className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] transition-all">
            <Zap className="w-4 h-4" /> Commencer la configuration
          </a>
        </div>
      </div>
    );
  }

  /* Amélioration #20 : useMemo pour éviter recalculs à chaque render */
  const revenueGoalPct = useMemo(
    () => Math.min(Math.round(((kpis?.revenueToday ?? 0) / dailyGoal) * 100), 100),
    [kpis?.revenueToday, dailyGoal]
  );
  const occupancyRate = data.totalTables > 0 ? Math.round((data.activeTables / data.totalTables) * 100) : 0;

  const kpiCards = [
    {
      label: "Revenu du jour",
      value: kpis?.revenueToday ?? 0,
      change: kpis?.revenueChange ? `${parseFloat(kpis.revenueChange) > 0 ? "+" : ""}${kpis.revenueChange}%` : null,
      up: parseFloat(kpis?.revenueChange ?? "0") >= 0,
      icon: DollarSign,
      sparkKey: "revenue",
      sparkColor: "hsl(24, 95%, 58%)",
      format: "currency",
    },
    {
      label: "Commandes",
      value: kpis?.ordersToday ?? 0,
      change: kpis?.ordersChange ? `${parseFloat(kpis.ordersChange) > 0 ? "+" : ""}${kpis.ordersChange}%` : null,
      up: parseFloat(kpis?.ordersChange ?? "0") >= 0,
      icon: ShoppingCart,
      sparkKey: "orders",
      sparkColor: "hsl(217, 91%, 60%)",
      format: "number",
    },
    {
      label: "Scans QR",
      value: kpis?.scansToday ?? 0,
      change: null,
      up: true,
      icon: QrCode,
      sparkKey: "scans",
      sparkColor: "hsl(160, 60%, 45%)",
      format: "number",
    },
    {
      label: "Panier moyen",
      value: kpis?.avgOrder ?? 0,
      change: null,
      up: true,
      icon: BarChart3,
      sparkKey: "revenue",
      sparkColor: "hsl(280, 60%, 60%)",
      format: "currency",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base font-bold text-foreground">
              {getGreeting()}, {data.restaurant.name?.split(" ")[0] ?? "Chef"} 👋
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              {data.restaurant.name}
              <span
                aria-live="polite"
                aria-label={liveIndicator ? "Données en temps réel" : "En ligne"}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${liveIndicator ? "bg-emerald-500/20 text-emerald-400" : "bg-secondary text-muted-foreground"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${liveIndicator ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} aria-hidden="true" />
                {liveIndicator ? "Live" : "En ligne"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="dashboard-search" className="sr-only">Rechercher dans le tableau de bord</label>
            <input id="dashboard-search" type="search" placeholder="Rechercher..." className="w-48 rounded-lg bg-secondary border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors focus-ring" />
          </div>
          <div className="relative">
            <button
              aria-label={notifications.length > 0 ? `Notifications — ${notifications.length} non lue${notifications.length > 1 ? "s" : ""}` : "Notifications"}
              className="relative w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              {notifications.length > 0 && <span aria-hidden="true" className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-background text-[9px] flex items-center justify-center font-bold text-primary-foreground">{notifications.length}</span>}
            </button>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            {(["today", "week", "month"] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} aria-pressed={period === p} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-ring ${period === p ? "bg-gradient-warm text-primary-foreground shadow-warm" : "text-muted-foreground hover:text-foreground"}`}>
                {p === "today" ? "Aujourd'hui" : p === "week" ? "Semaine" : "Mois"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: "Nouvelle commande", icon: Plus, href: "/orders", color: "bg-gradient-warm text-primary-foreground shadow-warm" },
            { label: "Ajouter un plat", icon: UtensilsCrossed, href: "/menu", color: "bg-secondary border border-border text-foreground" },
            { label: "Générer QR", icon: QrCode, href: "/qr", color: "bg-secondary border border-border text-foreground" },
            { label: "Voir l'analytics", icon: BarChart3, href: "/analytics", color: "bg-secondary border border-border text-foreground" },
            { label: "CRM clients", icon: Users, href: "/crm", color: "bg-secondary border border-border text-foreground" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all hover:scale-[1.02] ${action.color}`}
            >
              <action.icon className="w-3.5 h-3.5" />
              {action.label}
            </a>
          ))}
        </div>

        {/* Daily Goal Banner */}
        <div className="rounded-2xl border border-border bg-gradient-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Objectif du jour</span>
              <span className="text-xs text-muted-foreground">— {formatCurrency(dailyGoal)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">{revenueGoalPct}%</span>
              {revenueGoalPct >= 100 && <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
            </div>
          </div>
          <div
            role="progressbar"
            aria-valuenow={revenueGoalPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Objectif journalier : ${revenueGoalPct}%`}
            className="w-full h-2.5 rounded-full bg-border overflow-hidden"
          >
            <div
              className={`h-full rounded-full transition-all duration-1000 ${revenueGoalPct >= 100 ? "bg-emerald-400" : "bg-gradient-warm"}`}
              style={{ width: `${revenueGoalPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {revenueGoalPct >= 100
              ? "🎉 Objectif atteint !"
              : `${formatCurrency(kpis?.revenueToday ?? 0)} réalisés · ${formatCurrency(Math.max(dailyGoal - (kpis?.revenueToday ?? 0), 0))} restants`}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
          {kpiCards.map((k) => (
            <div key={k.label} className="group rounded-2xl border border-border bg-gradient-card p-6 transition-all duration-300 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-card cursor-default">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-gradient-warm transition-all duration-300" aria-hidden="true">
                  <k.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                {k.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                    {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {k.change}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {k.format === "currency"
                  ? <><AnimatedNumber value={k.value} />€</>
                  : <AnimatedNumber value={k.value} />
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1 mb-2">{k.label}</div>
              <div className="opacity-60">
                <SparkLine data={data.chartData} dataKey={k.sparkKey} color={k.sparkColor} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue / Orders Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {chartType === "revenue" ? "Revenu" : "Commandes"} cette semaine
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">vs. semaine précédente</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
                  <button onClick={() => setChartType("revenue")} aria-pressed={chartType === "revenue"} aria-label="Afficher le revenu" className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all focus-ring ${chartType === "revenue" ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>€</button>
                  <button onClick={() => setChartType("orders")} aria-pressed={chartType === "orders"} aria-label="Afficher les commandes" className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all focus-ring ${chartType === "orders" ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Cmds</button>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
            {/* Amélioration #21 : couleurs brand navy/indigo + gradients cohérents */}
            <ResponsiveContainer width="100%" height={200}>
              {chartType === "revenue" ? (
                <AreaChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="hsl(244,97%,35%)" stopOpacity={0.28} />
                      <stop offset="60%"  stopColor="hsl(302,30%,40%)" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="hsl(302,30%,40%)" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenu" stroke="hsl(244,97%,35%)" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "hsl(302,30%,40%)", stroke: "hsl(244,97%,35%)", strokeWidth: 2 }} />
                </AreaChart>
              ) : (
                <BarChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="hsl(212,100%,13%)" />
                      <stop offset="100%" stopColor="hsl(244,97%,35%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" name="Commandes" fill="url(#ordersGrad)" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Tables heatmap */}
          <div className="rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Tables</h3>
              <a href="/tables" className="text-xs text-primary hover:underline">Gérer →</a>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {data.tables.slice(0, 12).map((t) => {
                const cfg = TABLE_STATUS_CONFIG[t.status] ?? TABLE_STATUS_CONFIG.IDLE;
                return (
                  <div key={t.id} className={`rounded-xl p-2.5 text-center border transition-all hover:scale-105 cursor-pointer ${cfg.bg}`}>
                    <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                      {t.number}
                    </div>
                    <div className="text-[9px] mt-0.5 text-muted-foreground">{cfg.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Taux d'occupation</span>
                <span className="text-sm font-bold text-gradient-warm">{occupancyRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-gradient-warm transition-all duration-500" style={{ width: `${occupancyRate}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                {Object.entries(TABLE_STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot.replace(" animate-pulse", "")}`} />
                    <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Dishes + Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Dishes */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-foreground">Plats les plus performants</h3>
              <a href="/menu" className="text-xs text-primary font-medium hover:underline transition-all">Voir tout →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Plats les plus performants">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th scope="col" className="pb-3 font-medium">Plat</th>
                    <th scope="col" className="pb-3 font-medium text-right">Cmds</th>
                    <th scope="col" className="pb-3 font-medium text-right">Revenu</th>
                    <th scope="col" className="pb-3 font-medium text-right">Marge</th>
                    <th scope="col" className="pb-3 font-medium text-right">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topDishes.map((d, i) => {
                    const maxOrders = Math.max(...data.topDishes.map((x) => x.orders));
                    const barWidth = maxOrders > 0 ? Math.round((d.orders / maxOrders) * 100) : 0;
                    return (
                      <tr key={d.id} className="border-b border-border/50 last:border-0 row-hover">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gradient-warm-subtle flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</span>
                            <div className="min-w-0">
                              <span className="font-medium text-foreground text-xs block truncate">{d.name}</span>
                              <div className="w-24 h-1 rounded-full bg-border mt-1 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-warm" style={{ width: `${barWidth}%` }} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right text-muted-foreground tabular-nums text-xs">{d.orders}</td>
                        <td className="py-3 text-right font-medium text-foreground tabular-nums text-xs">{formatCurrency(d.revenue)}</td>
                        <td className="py-3 text-right text-muted-foreground tabular-nums text-xs">{d.margin}%</td>
                        <td className={`py-3 text-right font-medium tabular-nums text-xs ${d.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{d.trend}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
              <h3 className="text-base font-semibold text-foreground">Activité récente</h3>
            </div>
            <div className="space-y-3" aria-live="polite" aria-label="Activité récente">
              {notifications.length > 0 ? notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground">À l'instant</p>
                  </div>
                </div>
              )) : (
                <>
                  {[
                    { icon: ShoppingCart, color: "bg-emerald-500/20 text-emerald-400", msg: "Commande #1042 reçue", time: "il y a 3 min" },
                    { icon: Users, color: "bg-blue-500/20 text-blue-400", msg: "Nouveau client enregistré", time: "il y a 12 min" },
                    { icon: QrCode, color: "bg-purple-500/20 text-purple-400", msg: "QR scanné — Table 5", time: "il y a 18 min" },
                    { icon: Clock, color: "bg-yellow-500/20 text-yellow-400", msg: "Table 3 mise en attente", time: "il y a 25 min" },
                    { icon: CheckCircle2, color: "bg-emerald-500/20 text-emerald-400", msg: "Commande #1041 livrée", time: "il y a 31 min" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`} aria-hidden="true">
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{item.msg}</p>
                        <p className="text-[10px] text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <a href="/orders" className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border text-xs text-primary font-medium hover:underline">
              Voir toutes les commandes <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Amélioration #22-24 : AI Insight dynamique basé sur les vraies données */}
        <div className="rounded-2xl glass-warm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="flex items-start gap-4 relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shrink-0 shadow-warm">
              <Sparkles className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">Insight IA du jour</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wide">Live</span>
              </div>
              {data.topDishes[0] ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{data.topDishes[0].name}</strong> génère{" "}
                  <span className="text-primary font-semibold">{formatCurrency(data.topDishes[0].revenue)}</span> ce soir
                  avec une marge de <span className="font-medium text-foreground">{data.topDishes[0].margin}%</span>.
                  {data.topDishes[0].trend.startsWith("+") && (
                    <> Tendance <span className="text-emerald-400 font-medium">{data.topDishes[0].trend}</span> — suggérez-le en upsell après les entrées.</>
                  )}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ajoutez vos plats pour recevoir des recommandations personnalisées basées sur votre performance.
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <a href="/analytics?insights=1" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                  Voir tous les insights <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
                <button
                  onClick={() => toast.success("Insight appliqué au menu !")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-warm px-3 py-1.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] transition-all"
                >
                  <Zap className="w-3 h-3" /> Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
