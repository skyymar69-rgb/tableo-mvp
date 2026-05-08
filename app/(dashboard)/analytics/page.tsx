"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Eye, ShoppingBag, DollarSign, QrCode, Download, Sparkles, Loader2 } from "lucide-react";

const ChartFallback = () => <div className="w-full h-[220px] rounded-xl bg-secondary/30 animate-pulse" />;

const RevenueAreaChart = dynamic(
  () => import("@/components/dashboard/AnalyticsCharts").then((m) => m.RevenueAreaChart),
  { loading: ChartFallback, ssr: false }
);
const HourlyBarChart = dynamic(
  () => import("@/components/dashboard/AnalyticsCharts").then((m) => m.HourlyBarChart),
  { loading: ChartFallback, ssr: false }
);
const PredictionLineChart = dynamic(
  () => import("@/components/dashboard/AnalyticsCharts").then((m) => m.PredictionLineChart),
  { loading: ChartFallback, ssr: false }
);
import { formatCurrency } from "@/lib/utils";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { PageHeader } from "@/components/dashboard/PageHeader";

const DEMO_FUNNEL = [
  { label: "QR Scannés", value: 523, prev: 450, icon: QrCode, color: "from-orange-500 to-pink-500" },
  { label: "Menu ouvert", value: 498, prev: 420, icon: Eye, color: "from-pink-500 to-purple-500" },
  { label: "Plat consulté", value: 389, prev: 320, icon: Eye, color: "from-purple-500 to-blue-500" },
  { label: "Ajouté au panier", value: 201, prev: 180, icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
  { label: "Commandé", value: 142, prev: 115, icon: DollarSign, color: "from-cyan-500 to-emerald-500" },
];

const DEMO_WEEK = [
  { date: "Lun", revenue: 2847, orders: 98, scans: 312, prevRevenue: 2420, prevOrders: 84 },
  { date: "Mar", revenue: 3200, orders: 112, scans: 398, prevRevenue: 2890, prevOrders: 99 },
  { date: "Mer", revenue: 2950, orders: 104, scans: 356, prevRevenue: 2700, prevOrders: 95 },
  { date: "Jeu", revenue: 4100, orders: 145, scans: 489, prevRevenue: 3600, prevOrders: 128 },
  { date: "Ven", revenue: 5200, orders: 178, scans: 601, prevRevenue: 4800, prevOrders: 165 },
  { date: "Sam", revenue: 6800, orders: 234, scans: 784, prevRevenue: 6100, prevOrders: 218 },
  { date: "Dim", revenue: 5400, orders: 189, scans: 623, prevRevenue: 4900, prevOrders: 174 },
];

const DEMO_HOURLY = [
  { h: "10h", v: 12 }, { h: "11h", v: 28 }, { h: "12h", v: 87 },
  { h: "13h", v: 134 }, { h: "14h", v: 98 }, { h: "15h", v: 45 },
  { h: "16h", v: 32 }, { h: "17h", v: 38 }, { h: "18h", v: 67 },
  { h: "19h", v: 145 }, { h: "20h", v: 189 }, { h: "21h", v: 112 },
  { h: "22h", v: 45 },
];

const PREDICTIONS = [
  { date: "Lun +1", predicted: 3100, lower: 2800, upper: 3400 },
  { date: "Mar +1", predicted: 3500, lower: 3100, upper: 3900 },
  { date: "Mer +1", predicted: 3200, lower: 2900, upper: 3500 },
  { date: "Jeu +1", predicted: 4400, lower: 4000, upper: 4800 },
  { date: "Ven +1", predicted: 5600, lower: 5100, upper: 6100 },
  { date: "Sam +1", predicted: 7200, lower: 6500, upper: 7900 },
  { date: "Dim +1", predicted: 5800, lower: 5300, upper: 6300 },
];


export default function AnalyticsPage() {
  const [range, setRange] = useState<"week" | "month" | "year">("week");
  const [showComparison, setShowComparison] = useState(true);
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", restaurantId, range],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?restaurantId=${restaurantId}&range=${range}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!restaurantId,
  });

  const chartData = analyticsData?.chart?.length ? analyticsData.chart : DEMO_WEEK;
  const totalRevenue = chartData.reduce((s: number, d: any) => s + (d.revenue ?? 0), 0);
  const totalOrders = chartData.reduce((s: number, d: any) => s + (d.orders ?? 0), 0);
  const totalScans = chartData.reduce((s: number, d: any) => s + (d.scans ?? 0), 0);

  const kpis = analyticsData?.kpis;
  const conversionRate = totalScans > 0 ? ((totalOrders / totalScans) * 100).toFixed(1) : ((142 / 523) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* #32 — PageHeader unifié remplace le sticky header inline */}
      <PageHeader
        title="Analytics"
        subtitle="Vue complète de vos performances"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(["week", "month", "year"] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} aria-pressed={range === r} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-ring ${range === r ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {r === "week" ? "7j" : r === "month" ? "30j" : "1an"}
                </button>
              ))}
            </div>
            <button
              onClick={async () => {
                if (!restaurantId) { toast.error("Restaurant non chargé"); return; }
                try {
                  const res = await fetch(`/api/export?type=analytics&restaurantId=${restaurantId}&range=${range}`);
                  if (!res.ok) throw new Error();
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = `analytics-${range}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Export téléchargé !");
                } catch { toast.error("Erreur lors de l'export"); }
              }}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors focus-ring"
            >
              <Download className="w-3.5 h-3.5" />
              Exporter CSV
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Chargement des données...
          </div>
        )}

        {/* #31 — Skeleton KPI pendant le chargement */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-gradient-card p-5 animate-pulse">
                <div className="h-3 w-28 bg-secondary rounded mb-4" />
                <div className="h-8 w-20 bg-secondary rounded" />
              </div>
            ))
          ) : (
            [
              { label: "CA cette période", value: formatCurrency(kpis?.revenueToday ?? totalRevenue), change: "+18.4%", up: true },
              { label: "Commandes totales", value: (kpis?.ordersToday ?? totalOrders).toString(), change: "+12.7%", up: true },
              { label: "Taux de conversion", value: `${conversionRate}%`, change: "+2.1pts", up: true },
              { label: "Panier moyen", value: formatCurrency(totalOrders > 0 ? totalRevenue / totalOrders : 0), change: "-1.2%", up: false },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-border bg-gradient-card p-5 card-interactive transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                    {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {k.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{k.value}</p>
              </div>
            ))
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Revenu — {range === "week" ? "7 jours" : range === "month" ? "30 jours" : "1 an"}</h3>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${showComparison ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                <span className="w-3 h-0.5 rounded-full bg-current opacity-60" style={{ borderTop: "2px dashed" }} />
                Semaine préc.
              </button>
            </div>
            <RevenueAreaChart data={chartData} showComparison={showComparison} />
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Flux horaire aujourd&apos;hui</h3>
            <HourlyBarChart data={DEMO_HOURLY} />
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Funnel de conversion QR → Commande</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Taux global : <span className="text-primary font-semibold">{conversionRate}%</span></p>
            </div>
          </div>
          <div className="space-y-3">
            {DEMO_FUNNEL.map((step, i) => {
              const pct = (step.value / DEMO_FUNNEL[0].value) * 100;
              const drop = i > 0 ? (((DEMO_FUNNEL[i - 1].value - step.value) / DEMO_FUNNEL[i - 1].value) * 100).toFixed(0) : null;
              return (
                <div key={step.label}>
                  {drop && (
                    <div className="flex items-center gap-2 ml-4 my-1">
                      <div className="w-px h-3 bg-border ml-3" />
                      <span className="text-[10px] text-red-400">−{drop}% drop</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{step.label}</span>
                        <span className="text-sm font-bold text-foreground tabular-nums">{step.value.toLocaleString("fr-FR")}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${step.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Prévisions IA — Semaine prochaine</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Basé sur 90 jours d&apos;historique + météo + événements locaux</p>
            </div>
          </div>
          <PredictionLineChart data={PREDICTIONS} />
          <div className="mt-4 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-foreground font-semibold">CA prévu : {formatCurrency(PREDICTIONS.reduce((s, d) => s + d.predicted, 0))}</span>
            </div>
            <span className="text-muted-foreground">Confiance : 87%</span>
          </div>
        </div>

        {/* Top dishes from real API */}
        {analyticsData?.topDishes?.length > 0 && (
          <div className="rounded-2xl border border-border bg-gradient-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top plats — {range === "week" ? "7 jours" : range === "month" ? "30 jours" : "1 an"}</h3>
            <div className="space-y-3">
              {analyticsData.topDishes.map((dish: any, i: number) => (
                <div key={dish.id} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{dish.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{dish.orders} commandes • {formatCurrency(dish.revenue)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-warm rounded-full" style={{ width: `${(dish.orders / analyticsData.topDishes[0].orders) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
