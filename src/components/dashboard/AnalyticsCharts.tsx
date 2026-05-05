"use client";

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-card text-xs">
      <p className="font-medium text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {p.dataKey === "revenue" || p.dataKey === "predicted" || p.dataKey === "prevRevenue" ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export function RevenueAreaChart({ data, showComparison }: { data: any[]; showComparison: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev7" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(24,95%,58%)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(24,95%,58%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
        <Tooltip content={<CustomTooltip />} />
        {showComparison && (
          <Area type="monotone" dataKey="prevRevenue" name="Semaine préc." stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} />
        )}
        <Area type="monotone" dataKey="revenue" name="Revenu" stroke="hsl(24,95%,58%)" strokeWidth={2} fill="url(#rev7)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HourlyBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="h" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="v" name="Commandes" fill="hsl(24,95%,58%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PredictionLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(270,60%,55%)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="hsl(270,60%,55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="upper" name="Max" stroke="none" fill="url(#predGrad)" />
        <Line type="monotone" dataKey="predicted" name="Prévision" stroke="hsl(270,60%,55%)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="lower" name="Min" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="3 3" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
