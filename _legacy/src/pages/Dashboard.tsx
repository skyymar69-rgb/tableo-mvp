import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  TrendingUp, DollarSign, ShoppingCart, QrCode,
  BarChart3, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Bell, Search, Calendar,
} from "lucide-react";

const kpis = [
  { label: "Revenu du jour", value: "2 847€", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Commandes", value: "142", change: "+8.3%", up: true, icon: ShoppingCart },
  { label: "Scans QR", value: "523", change: "+23.1%", up: true, icon: QrCode },
  { label: "Panier moyen", value: "20.05€", change: "-2.1%", up: false, icon: BarChart3 },
];

const topDishes = [
  { name: "Saumon Mi-Cuit", orders: 38, revenue: "912€", margin: "72%", trend: "+5%" },
  { name: "Fondant Chocolat", orders: 34, revenue: "476€", margin: "85%", trend: "+12%" },
  { name: "Risotto Truffe", orders: 29, revenue: "812€", margin: "68%", trend: "+3%" },
  { name: "Gin Artisanal", orders: 27, revenue: "324€", margin: "90%", trend: "+18%" },
  { name: "Tartare Boeuf", orders: 24, revenue: "552€", margin: "65%", trend: "-2%" },
];

const tables = [
  { id: "T1", status: "active", revenue: "186€", orders: 3 },
  { id: "T2", status: "active", revenue: "124€", orders: 2 },
  { id: "T3", status: "idle", revenue: "0€", orders: 0 },
  { id: "T4", status: "active", revenue: "248€", orders: 4 },
  { id: "T5", status: "active", revenue: "92€", orders: 1 },
  { id: "T6", status: "idle", revenue: "0€", orders: 0 },
  { id: "T7", status: "active", revenue: "310€", orders: 5 },
  { id: "T8", status: "idle", revenue: "0€", orders: 0 },
];

const chartData = [35, 42, 38, 56, 48, 62, 55, 70, 65, 78, 72, 85];
const chartLabels = ["10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"];

const MiniChart = () => {
  const max = Math.max(...chartData);
  const h = 120;
  const w = 100;
  const points = chartData.map((v, i) => `${(i / (chartData.length - 1)) * w},${h - (v / max) * h}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(24, 95%, 58%)" />
          <stop offset="50%" stopColor="hsl(340, 82%, 62%)" />
          <stop offset="100%" stopColor="hsl(270, 60%, 55%)" />
        </linearGradient>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(24, 95%, 58%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(24, 95%, 58%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#fillGrad)" />
      <polyline points={points} fill="none" stroke="url(#chartGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      {chartData.map((v, i) => (
        <circle
          key={i}
          cx={(i / (chartData.length - 1)) * w}
          cy={h - (v / max) * h}
          r="2"
          fill="hsl(24, 95%, 58%)"
          opacity="0.6"
        />
      ))}
    </svg>
  );
};

const Dashboard = () => {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Header with search + notifications */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Le Petit Bistro • Vue en temps réel</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-48 rounded-lg bg-secondary border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              {/* Notification bell */}
              <button className="relative w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              </button>
              {/* Period pills */}
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                {(["today", "week", "month"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      period === p ? "bg-gradient-warm text-primary-foreground shadow-warm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p === "today" ? "Aujourd'hui" : p === "week" ? "Semaine" : "Mois"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPIs with hover effects */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((k) => (
              <div key={k.label} className="group rounded-2xl border border-border bg-gradient-card p-6 transition-all duration-300 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-gradient-warm transition-all duration-300">
                    <k.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                    {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {k.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{k.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue chart with data points */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Revenu en temps réel</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Aujourd'hui vs hier</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </div>
              </div>
              <MiniChart />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                {chartLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>

            {/* Table status with pulse on active */}
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Tables actives</h3>
              <div className="grid grid-cols-4 gap-2">
                {tables.map((t) => (
                  <div
                    key={t.id}
                    className={`rounded-xl p-3 text-center border transition-all hover:scale-105 cursor-pointer ${
                      t.status === "active"
                        ? "glass-warm"
                        : "border-border bg-secondary/30"
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                      {t.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      {t.id}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${t.status === "active" ? "text-primary" : "text-muted-foreground"}`}>
                      {t.status === "active" ? t.revenue : "Libre"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Taux d'occupation</span>
                <span className="text-sm font-bold text-gradient-warm">62.5%</span>
              </div>
            </div>
          </div>

          {/* Top dishes with row hover */}
          <div className="rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-foreground">Plats les plus performants</h3>
              <button className="text-xs text-primary font-medium hover:underline transition-all">Voir tout →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Plat</th>
                    <th className="pb-3 font-medium text-right">Commandes</th>
                    <th className="pb-3 font-medium text-right">Revenu</th>
                    <th className="pb-3 font-medium text-right">Marge</th>
                    <th className="pb-3 font-medium text-right">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {topDishes.map((d, i) => (
                    <tr key={d.name} className="border-b border-border/50 last:border-0 row-hover">
                      <td className="py-3 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gradient-warm-subtle flex items-center justify-center text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="font-medium text-foreground">{d.name}</span>
                      </td>
                      <td className="py-3 text-right text-muted-foreground tabular-nums">{d.orders}</td>
                      <td className="py-3 text-right font-medium text-foreground tabular-nums">{d.revenue}</td>
                      <td className="py-3 text-right text-muted-foreground tabular-nums">{d.margin}</td>
                      <td className={`py-3 text-right font-medium tabular-nums ${d.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                        {d.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights with border gradient */}
          <div className="mt-6 rounded-2xl glass-warm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="flex items-start gap-4 relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">💡 Insight IA</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Le <strong className="text-foreground">Fondant Chocolat</strong> a une marge de 85% et une tendance de +12%.
                  Nous recommandons de l'ajouter comme suggestion automatique après les plats principaux — potentiel de <span className="text-primary font-semibold">+340€/jour</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
