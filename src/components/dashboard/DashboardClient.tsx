"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign, ShoppingCart, QrCode, BarChart3,
  ArrowUpRight, ArrowDownRight, Bell, Search, Calendar,
  Sparkles, Zap, RefreshCw, Plus, Edit2, X,
  UtensilsCrossed, Target, Users, Clock, ChevronRight,
  CheckCircle2, Activity, Wifi, WifiOff, TableIcon,
} from "lucide-react";
import { formatCurrency, formatRelative, isMac } from "@/lib/utils";
import { toast } from "sonner";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

/* #33 — AnimatedNumber inchangé, performant */
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const start     = prevRef.current;
    const end       = value;
    const duration  = 700;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
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

/* #12 — SparkLine : gradient ID unique par dataKey pour éviter les collisions SVG entre cartes */
function SparkLine({ data, dataKey, color }: { data: Array<Record<string, number | string>>; dataKey: string; color: string }) {
  const values = data.map((d) => Number(d[dataKey] ?? 0));
  /* #34 — Si une seule valeur, dupliquer pour éviter division par 0 */
  if (values.length < 2) {
    const v = values[0] ?? 0;
    return (
      <svg viewBox="0 0 100 32" className="w-full" aria-hidden="true" preserveAspectRatio="none">
        <line x1="2" y1="16" x2="98" y2="16" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 100, H = 32, pad = 2;

  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y] as [number, number];
  });

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `M${pts[0][0]},${H} ${pts.map(([x, y]) => `L${x},${y}`).join(" ")} L${pts[pts.length - 1][0]},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${dataKey})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* #37 — CustomTooltip amélioré avec formatage EUR + unités contextuelles */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-card text-xs min-w-[120px]">
      <p className="text-muted-foreground mb-2 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}</span>
          </div>
          <span className="font-bold text-foreground">
            {p.dataKey === "revenue" ? formatCurrency(p.value) : p.value.toLocaleString("fr-FR")}
          </span>
        </div>
      ))}
    </div>
  );
};

const TABLE_STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string }> = {
  OCCUPIED: { label: "Occupée",   bg: "glass-warm border-primary/30",        dot: "bg-primary animate-pulse" },
  RESERVED: { label: "Réservée",  bg: "bg-blue-500/10 border-blue-500/30",   dot: "bg-blue-400" },
  CLEANING: { label: "Nettoyage", bg: "bg-yellow-500/10 border-yellow-500/30", dot: "bg-yellow-400" },
  IDLE:     { label: "Libre",     bg: "border-border bg-secondary/30",        dot: "bg-muted-foreground/40" },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

/* #50 — Date du jour en français */
function getTodayLabel(): string {
  return format(new Date(), "EEEE d MMMM", { locale: fr });
}

const DEFAULT_DAILY_GOAL = 2000;

/* #13 — KPICard cliquable : lien vers la page associée */
function KPICard({
  label, value, change, up, icon: Icon, sparkKey, sparkColor, format: fmt, chartData, href,
}: {
  label: string; value: number; change: string | null; up: boolean;
  icon: React.ElementType; sparkKey: string; sparkColor: string;
  format: "currency" | "number";
  chartData: Array<Record<string, number | string>>;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-gradient-warm transition-all duration-300" aria-hidden="true">
          <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              up ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}
            aria-label={`Variation : ${change}`}
          >
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div className="stat-value text-foreground">
        {fmt === "currency"
          ? <><AnimatedNumber value={value} />€</>
          : <AnimatedNumber value={value} />
        }
      </div>
      <div className="text-xs text-muted-foreground mt-1 mb-2">{label}</div>
      <div className="opacity-60">
        <SparkLine data={chartData} dataKey={sparkKey} color={sparkColor} />
      </div>
    </>
  );

  const cls = "group rounded-2xl border border-border bg-gradient-card p-6 transition-all duration-300 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-card card-contained block";

  return href
    ? <a href={href} className={cls}>{inner}</a>
    : <div className={`${cls} cursor-default`}>{inner}</div>;
}

export function DashboardClient({
  data,
  restaurantId,
  dailyGoal = DEFAULT_DAILY_GOAL,
}: {
  data: DashboardData | null;
  restaurantId: string;
  dailyGoal?: number;
}) {
  const router = useRouter();
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [kpis, setKpis] = useState(data?.kpis);
  const [sseConnected, setSseConnected] = useState(false);
  const [liveIndicator, setLiveIndicator] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; time: string }>>([]);
  const [chartType, setChartType] = useState<"revenue" | "orders">("revenue");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [periodChartData, setPeriodChartData] = useState<DashboardData["chartData"] | null>(null);
  const [periodLoading, setPeriodLoading] = useState(false);
  /* #14 — Objectif éditable avec persistence localStorage */
  const [goalValue, setGoalValue] = useState<number>(() => {
    if (typeof window === "undefined") return dailyGoal;
    return Number(localStorage.getItem("tableo-daily-goal") ?? dailyGoal);
  });
  const [goalEditing, setGoalEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(String(dailyGoal));
  /* #15 — Timestamp dernière actualisation */
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  /* #16 — Confetti objectif déjà célébré (évite répétition) */
  const goalCelebratedRef = useRef(false);
  /* #17 — Platform keyboard hint */
  const modKey = isMac() ? "⌘" : "Ctrl";

  /* #18 — SSE avec auto-reconnect backoff */
  useEffect(() => {
    if (!restaurantId) return;
    let retryDelay = 5_000;
    let retryTimer: ReturnType<typeof setTimeout>;
    let es: EventSource;

    const connect = () => {
      es = new EventSource(`/api/sse?restaurantId=${restaurantId}`);

      es.onopen = () => { setSseConnected(true); retryDelay = 5_000; };
      es.onerror = () => {
        setSseConnected(false);
        es.close();
        retryTimer = setTimeout(() => {
          retryDelay = Math.min(retryDelay * 1.5, 30_000);
          connect();
        }, retryDelay);
      };

      es.onmessage = (e) => {
        const payload = JSON.parse(e.data);
        if (payload.type === "heartbeat" && payload.kpis) {
          setLiveIndicator(true);
          setLastUpdated(new Date());
          setTimeout(() => setLiveIndicator(false), 1000);
          if (payload.kpis.orders > 0) {
            toast.success("Nouvelle commande reçue !", { icon: "🛎️" });
            const id = Date.now().toString();
            setNotifications((prev) => [
              { id, message: "Nouvelle commande", time: "À l'instant" },
              ...prev,
            ].slice(0, 5));
            /* #19 — Auto-dismiss notification après 8s */
            setTimeout(() => {
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 8_000);
          }
        }
      };
    };

    connect();
    return () => { es?.close(); clearTimeout(retryTimer); };
  }, [restaurantId]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    router.refresh();
    setLastUpdated(new Date());
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
    toast.success("Données actualisées !");
  }, [router]);

  /* #20 — Raccourcis clavier ⌘N / ⌘M / ⌘R */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = isMac() ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key === "n") { e.preventDefault(); router.push("/orders"); }
      if (e.key === "m") { e.preventDefault(); router.push("/menu"); }
      if (e.key === "r" && !e.shiftKey) { e.preventDefault(); handleRefresh(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [router, handleRefresh]);

  /* Fetch chart data when period changes (week/month use analytics API) */
  useEffect(() => {
    if (period === "today" || !restaurantId) {
      setPeriodChartData(null);
      return;
    }
    let cancelled = false;
    setPeriodLoading(true);
    fetch(`/api/analytics?restaurantId=${restaurantId}&range=${period === "week" ? "week" : "month"}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.chart?.length) setPeriodChartData(json.chart);
        else setPeriodChartData(null);
      })
      .catch(() => setPeriodChartData(null))
      .finally(() => { if (!cancelled) setPeriodLoading(false); });
    return () => { cancelled = true; };
  }, [period, restaurantId]);

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
              <a key={s.step} href={s.href} className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-card p-4 hover:border-primary/30 transition-all group card-interactive">
                <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
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

  /* #21 — Pourcentage d'objectif basé sur goalValue éditable */
  const revenueGoalPct = useMemo(
    () => Math.min(Math.round(((kpis?.revenueToday ?? 0) / goalValue) * 100), 100),
    [kpis?.revenueToday, goalValue]
  );

  /* #22 — Confetti quand l'objectif est atteint (1 seule fois) */
  useEffect(() => {
    if (revenueGoalPct >= 100 && !goalCelebratedRef.current) {
      goalCelebratedRef.current = true;
      import("@/lib/confetti").then(({ fireOrderConfetti }) => fireOrderConfetti()).catch(() => {});
    }
  }, [revenueGoalPct]);
  const occupancyRate = data.totalTables > 0 ? Math.round((data.activeTables / data.totalTables) * 100) : 0;

  const kpiCards = useMemo(() => [
    {
      label: "Revenu du jour",
      value: kpis?.revenueToday ?? 0,
      change: kpis?.revenueChange ? `${parseFloat(kpis.revenueChange) > 0 ? "+" : ""}${kpis.revenueChange}%` : null,
      up: parseFloat(kpis?.revenueChange ?? "0") >= 0,
      icon: DollarSign,
      sparkKey: "revenue",
      sparkColor: "hsl(24, 95%, 58%)",
      format: "currency" as const,
      href: "/analytics",
    },
    {
      label: "Commandes",
      value: kpis?.ordersToday ?? 0,
      change: kpis?.ordersChange ? `${parseFloat(kpis.ordersChange) > 0 ? "+" : ""}${kpis.ordersChange}%` : null,
      up: parseFloat(kpis?.ordersChange ?? "0") >= 0,
      icon: ShoppingCart,
      sparkKey: "orders",
      sparkColor: "hsl(217, 91%, 60%)",
      format: "number" as const,
      href: "/orders",
    },
    {
      label: "Scans QR",
      value: kpis?.scansToday ?? 0,
      change: null,
      up: true,
      icon: QrCode,
      sparkKey: "scans",
      sparkColor: "hsl(160, 60%, 45%)",
      format: "number" as const,
      href: "/qr",
    },
    {
      label: "Panier moyen",
      value: kpis?.avgOrder ?? 0,
      change: null,
      up: true,
      icon: BarChart3,
      sparkKey: "revenue",
      sparkColor: "hsl(280, 60%, 60%)",
      format: "currency" as const,
      href: "/analytics",
    },
  ], [kpis]);

  const chartPeriodLabel = period === "today" ? "aujourd'hui" : period === "week" ? "cette semaine" : "ce mois";
  const activeChartData = periodChartData ?? data?.chartData ?? [];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            {/* #50 — Date du jour en français */}
            <h1 className="text-base font-bold text-foreground">
              {getGreeting()}, {data.restaurant.name?.split(" ")[0] ?? "Chef"} 👋
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="capitalize">{getTodayLabel()}</span>
              {/* #15 — Timestamp dernière actualisation */}
              <span className="text-[10px] text-muted-foreground/50">· màj {formatRelative(lastUpdated)}</span>
              {/* #40 — SSE connection status */}
              <span
                aria-live="polite"
                aria-label={sseConnected ? (liveIndicator ? "Données en temps réel" : "Connecté") : "Hors ligne"}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                  liveIndicator
                    ? "bg-emerald-500/20 text-emerald-400"
                    : sseConnected
                    ? "bg-secondary text-muted-foreground"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {sseConnected
                  ? <Wifi className="w-2.5 h-2.5" aria-hidden="true" />
                  : <WifiOff className="w-2.5 h-2.5" aria-hidden="true" />}
                {liveIndicator ? "Live" : sseConnected ? "En ligne" : "Déconnecté"}
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

          {/* #39 — Bouton Refresh */}
          <button
            onClick={handleRefresh}
            aria-label="Actualiser les données"
            disabled={isRefreshing}
            className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-ring disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>

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
              <button
                key={p}
                onClick={() => !periodLoading && setPeriod(p)}
                aria-pressed={period === p}
                aria-disabled={periodLoading}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-ring ${
                  period === p ? "bg-gradient-warm text-primary-foreground shadow-warm" : "text-muted-foreground hover:text-foreground"
                } ${periodLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                {p === "today" ? "Aujourd'hui" : p === "week" ? "Semaine" : "Mois"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions — #36 : hints clavier */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: "Nouvelle commande", icon: Plus,           href: "/orders",    color: "bg-gradient-warm text-primary-foreground shadow-warm", hint: `${modKey}N` },
            { label: "Ajouter un plat",   icon: UtensilsCrossed,href: "/menu",      color: "bg-secondary border border-border text-foreground",    hint: `${modKey}M` },
            { label: "Générer QR",        icon: QrCode,          href: "/qr",        color: "bg-secondary border border-border text-foreground",    hint: null },
            { label: "Analytics",         icon: BarChart3,       href: "/analytics", color: "bg-secondary border border-border text-foreground",    hint: null },
            { label: "CRM clients",       icon: Users,           href: "/crm",       color: "bg-secondary border border-border text-foreground",    hint: null },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${action.color}`}
            >
              <action.icon className="w-3.5 h-3.5" aria-hidden="true" />
              {action.label}
              {action.hint && (
                <kbd className="hidden lg:inline-flex text-[9px] opacity-60 border border-current/20 rounded px-1 py-0.5 ml-0.5">
                  {action.hint}
                </kbd>
              )}
            </a>
          ))}
        </div>

        {/* Daily Goal Banner — #14 objectif éditable */}
        <div className="rounded-2xl border border-border bg-gradient-card p-4 card-contained">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">Objectif du jour</span>
              {goalEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = parseFloat(goalInput.replace(",", "."));
                    if (!isNaN(v) && v > 0) {
                      setGoalValue(v);
                      localStorage.setItem("tableo-daily-goal", String(v));
                    }
                    setGoalEditing(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-24 rounded-md bg-secondary border border-primary/40 px-2 py-0.5 text-xs text-foreground focus:outline-none focus:border-primary"
                    aria-label="Modifier l'objectif journalier"
                  />
                  <span className="text-xs text-muted-foreground">€</span>
                  <button type="submit" className="text-[10px] font-semibold text-primary hover:underline focus-ring rounded px-1">OK</button>
                  <button type="button" onClick={() => setGoalEditing(false)} className="text-[10px] text-muted-foreground hover:text-foreground focus-ring rounded px-1">Annuler</button>
                </form>
              ) : (
                <button
                  onClick={() => { setGoalInput(String(goalValue)); setGoalEditing(true); }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-ring rounded group"
                  aria-label="Modifier l'objectif journalier"
                >
                  <span>— {formatCurrency(goalValue)}</span>
                  <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground tabular-nums">{revenueGoalPct}%</span>
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
              className={`h-full rounded-full transition-all duration-1000 animate-progress-in ${revenueGoalPct >= 100 ? "bg-emerald-400" : "bg-gradient-warm"}`}
              style={{ width: `${revenueGoalPct}%`, ["--progress-width" as string]: `${revenueGoalPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {revenueGoalPct >= 100
              ? "🎉 Objectif atteint !"
              : `${formatCurrency(kpis?.revenueToday ?? 0)} réalisés · ${formatCurrency(Math.max(goalValue - (kpis?.revenueToday ?? 0), 0))} restants`}
          </p>
        </div>

        {/* KPI Cards — #33 composant extrait */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
          {kpiCards.map((k) => (
            <KPICard key={k.label} {...k} chartData={data.chartData} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue / Orders Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-6 card-contained">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground capitalize flex items-center gap-2">
                  {chartType === "revenue" ? "Revenu" : "Commandes"} {chartPeriodLabel}
                  {periodLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" aria-label="Chargement" />
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">vs. période précédente</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
                  <button onClick={() => setChartType("revenue")} aria-pressed={chartType === "revenue"} aria-label="Afficher le revenu" className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all focus-ring ${chartType === "revenue" ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>€ Revenu</button>
                  <button onClick={() => setChartType("orders")} aria-pressed={chartType === "orders"} aria-label="Afficher les commandes" className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all focus-ring ${chartType === "orders" ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Commandes</button>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              {chartType === "revenue" ? (
                <AreaChart data={activeChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                <BarChart data={activeChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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

          {/* Tables */}
          <div className="rounded-2xl border border-border bg-gradient-card p-6 card-contained">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-primary" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground">Tables</h3>
                {/* #47 — Taux d'occupation en badge */}
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  occupancyRate >= 80 ? "bg-emerald-500/15 text-emerald-500"
                  : occupancyRate >= 40 ? "bg-yellow-500/15 text-yellow-500"
                  : "bg-secondary text-muted-foreground"
                }`}>
                  {occupancyRate}%
                </span>
              </div>
              <a href="/tables" className="text-xs text-primary hover:underline focus-ring rounded">Gérer →</a>
            </div>

            {/* #42 — Capacité affichée dans chaque case table */}
            {data.tables.length === 0 ? (
              /* #46 — Empty state tables */
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <TableIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center">Aucune table configurée</p>
                <a href="/tables" className="text-xs text-primary font-medium hover:underline">Ajouter des tables →</a>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {data.tables.slice(0, 12).map((t) => {
                  const cfg = TABLE_STATUS_CONFIG[t.status] ?? TABLE_STATUS_CONFIG.IDLE;
                  return (
                    <div
                      key={t.id}
                      className={`rounded-xl p-2 text-center border transition-all hover:scale-105 cursor-pointer ${cfg.bg}`}
                      title={`Table ${t.number} — ${cfg.label}${t.capacity ? ` · ${t.capacity} places` : ""}`}
                    >
                      <div className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                        {t.number}
                      </div>
                      {/* #42 — Capacité */}
                      {t.capacity && (
                        <div className="text-[9px] mt-0.5 text-muted-foreground/70 tabular-nums">{t.capacity}p</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Taux d'occupation</span>
                <span className="text-sm font-bold text-gradient-warm tabular-nums">{occupancyRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden" role="presentation">
                <div className="h-full rounded-full bg-gradient-warm transition-all duration-500" style={{ width: `${occupancyRate}%` }} />
              </div>
              {/* #48 — légende statuts compacte */}
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
          <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-6 card-contained">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-foreground">Plats les plus performants</h3>
              <a href="/menu" className="text-xs text-primary font-medium hover:underline transition-all focus-ring rounded">Voir tout →</a>
            </div>
            <div className="overflow-x-auto scroll-smooth-x">
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
                    const isTrendUp = d.trend.startsWith("+");
                    return (
                      <tr key={d.id} className="border-b border-border/50 last:border-0 row-hover">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gradient-warm-subtle flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</span>
                            <div className="min-w-0">
                              <span className="font-medium text-foreground text-xs block truncate">{d.name}</span>
                              {/* #43 — Barre de popularité relative */}
                              <div className="w-20 h-1.5 rounded-full bg-border mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${isTrendUp ? "bg-gradient-warm" : "bg-muted-foreground/40"}`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right text-muted-foreground tabular-nums text-xs">{d.orders}</td>
                        <td className="py-3 text-right font-semibold text-foreground tabular-nums text-xs">{formatCurrency(d.revenue)}</td>
                        <td className="py-3 text-right tabular-nums text-xs">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                            d.margin >= 80 ? "bg-emerald-500/10 text-emerald-500"
                            : d.margin >= 60 ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                          }`}>
                            {d.margin}%
                          </span>
                        </td>
                        <td className={`py-3 text-right font-medium tabular-nums text-xs ${isTrendUp ? "text-emerald-500" : "text-red-400"}`}>
                          <span className="inline-flex items-center gap-0.5">
                            {isTrendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {d.trend}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-2xl border border-border bg-gradient-card p-6 card-contained">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground">Activité récente</h3>
              </div>
              {/* #23 — Bouton "Tout effacer" si notifications actives */}
              {notifications.length > 0 && (
                <button
                  onClick={() => setNotifications([])}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors focus-ring rounded"
                  aria-label="Effacer toutes les notifications"
                >
                  Tout effacer
                </button>
              )}
            </div>
            <div className="space-y-3" aria-live="polite" aria-label="Activité récente">
              {notifications.length > 0 ? notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 animate-scale-in group">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                  {/* #23 — Dismiss individuel */}
                  <button
                    onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-5 h-5 rounded-md hover:bg-secondary flex items-center justify-center focus-ring"
                    aria-label={`Fermer la notification : ${n.message}`}
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )) : (
                /* #45 — Activity feed placeholder amélioré */
                <>
                  {[
                    { icon: ShoppingCart, color: "bg-emerald-500/20 text-emerald-400", msg: "Commande #1042 reçue",     time: "il y a 3 min" },
                    { icon: Users,        color: "bg-blue-500/20 text-blue-400",       msg: "Nouveau client enregistré", time: "il y a 12 min" },
                    { icon: QrCode,       color: "bg-purple-500/20 text-purple-400",   msg: "QR scanné — Table 5",       time: "il y a 18 min" },
                    { icon: Clock,        color: "bg-yellow-500/20 text-yellow-400",   msg: "Table 3 mise en attente",   time: "il y a 25 min" },
                    { icon: CheckCircle2, color: "bg-emerald-500/20 text-emerald-400", msg: "Commande #1041 livrée",     time: "il y a 31 min" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`} aria-hidden="true">
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{item.msg}</p>
                        <p className="text-[10px] text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <a href="/orders" className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border text-xs text-primary font-medium hover:underline focus-ring rounded">
              Voir toutes les commandes <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* AI Insight — #41 amélioré */}
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
                {/* #41 — Badge confiance */}
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                  Haute confiance
                </span>
              </div>
              {data.topDishes[0] ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{data.topDishes[0].name}</strong> génère{" "}
                  <span className="text-primary font-semibold">{formatCurrency(data.topDishes[0].revenue)}</span> avec une marge de{" "}
                  <span className="font-medium text-foreground">{data.topDishes[0].margin}%</span>.{" "}
                  {data.topDishes[0].trend.startsWith("+") ? (
                    <>Tendance <span className="text-emerald-500 font-semibold">{data.topDishes[0].trend}</span> — suggérez-le en upsell après les entrées pour maximiser le ticket moyen.</>
                  ) : (
                    <>Tendance <span className="text-red-400 font-semibold">{data.topDishes[0].trend}</span> — pensez à une promotion flash pour relancer les ventes.</>
                  )}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ajoutez vos plats pour recevoir des recommandations personnalisées basées sur votre performance.
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <a href="/analytics?insights=1" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline focus-ring rounded">
                  Voir tous les insights <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
                <button
                  onClick={() => toast.success("Insight appliqué au menu !")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-warm px-3 py-1.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] transition-all focus-ring"
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
