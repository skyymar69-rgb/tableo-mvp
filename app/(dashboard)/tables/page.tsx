"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Grid3X3, Users, Clock, CheckCircle, Plus, X, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { Skeleton } from "@/components/ui/skeleton";

type TableStatus = "IDLE" | "FREE" | "OCCUPIED" | "RESERVED" | "CLEANING";

interface TableData {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  floor?: string;
  orders?: Array<{ id: string; total: number; status: string; createdAt: string; customer?: { name: string } | null }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  IDLE: { label: "Libre", color: "border-emerald-400/30 bg-emerald-400/5 hover:border-emerald-400/60", dot: "bg-emerald-400" },
  FREE: { label: "Libre", color: "border-emerald-400/30 bg-emerald-400/5 hover:border-emerald-400/60", dot: "bg-emerald-400" },
  OCCUPIED: { label: "Occupée", color: "border-primary/40 bg-primary/5 hover:border-primary/70", dot: "bg-primary animate-pulse" },
  RESERVED: { label: "Réservée", color: "border-blue-400/30 bg-blue-400/5 hover:border-blue-400/60", dot: "bg-blue-400" },
  CLEANING: { label: "Nettoyage", color: "border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/60", dot: "bg-yellow-400" },
};

const DEMO_TABLES: TableData[] = [
  { id: "t1", number: "T1", capacity: 2, status: "OCCUPIED" },
  { id: "t2", number: "T2", capacity: 4, status: "OCCUPIED" },
  { id: "t3", number: "T3", capacity: 4, status: "IDLE" },
  { id: "t4", number: "T4", capacity: 2, status: "OCCUPIED" },
  { id: "t5", number: "T5", capacity: 6, status: "OCCUPIED" },
  { id: "t6", number: "T6", capacity: 4, status: "RESERVED" },
  { id: "t7", number: "T7", capacity: 2, status: "OCCUPIED" },
  { id: "t8", number: "T8", capacity: 8, status: "IDLE" },
  { id: "t9", number: "T9", capacity: 2, status: "CLEANING" },
  { id: "t10", number: "Terrasse 1", capacity: 4, status: "IDLE" },
  { id: "t11", number: "Terrasse 2", capacity: 4, status: "RESERVED" },
  { id: "t12", number: "Salon VIP", capacity: 10, status: "IDLE" },
];

function useElapsedTimer(createdAt?: string) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 60_000);
    return () => clearInterval(id);
  }, []);
  if (!createdAt) return null;
  const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  if (diff <= 0) return "0min";
  return diff >= 60 ? `${Math.floor(diff / 60)}h${diff % 60 > 0 ? diff % 60 + "min" : ""}` : `${diff}min`;
}

function TableCard({ table, selected, onClick }: { table: TableData; selected: boolean; onClick: () => void }) {
  const cfg = STATUS_CONFIG[table.status] ?? STATUS_CONFIG.IDLE;
  const activeOrder = table.orders?.[0];
  const elapsed = useElapsedTimer(activeOrder?.createdAt);

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 p-4 text-left transition-all duration-200 cursor-pointer w-full",
        cfg.color,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-foreground">{table.number}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
            <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{table.capacity}</span>
        </div>
      </div>

      {table.status === "OCCUPIED" && (
        <div className="space-y-1">
          {activeOrder?.customer?.name && (
            <p className="text-[10px] text-foreground font-medium truncate">{activeOrder.customer.name}</p>
          )}
          <div className="flex items-center justify-between">
            {elapsed && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                <span>{elapsed}</span>
              </div>
            )}
            {activeOrder?.total != null && (
              <span className="text-[10px] font-bold text-primary">{activeOrder.total.toFixed(2)} €</span>
            )}
          </div>
        </div>
      )}
      {table.status === "RESERVED" && (
        <p className="text-[10px] text-blue-400">Réservation</p>
      )}
    </button>
  );
}

export default function TablesPage() {
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ number: "", capacity: 4, floor: "" });
  const [localTables, setLocalTables] = useState<TableData[]>([]);

  const { data: apiTables, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/tables?restaurantId=${restaurantId}`);
      const json = await res.json();
      return (json.tables ?? []) as TableData[];
    },
    enabled: !!restaurantId,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    // On synchronise meme si la DB renvoie un tableau vide
    if (apiTables) setLocalTables(apiTables);
  }, [apiTables]);

  // Si la DB est chargee (apiTables defini) et vide, on affiche le vrai etat vide.
  // Sinon (avant chargement), on montre les DEMO_TABLES en preview.
  const tables = apiTables !== undefined ? localTables : DEMO_TABLES;

  const patchMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (id.startsWith("t") || id.startsWith("local-")) return;
      await fetch(`/api/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, number: addForm.number, capacity: addForm.capacity, floor: addForm.floor || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
      toast.success("Table créée !");
      setShowAddModal(false);
      setAddForm({ number: "", capacity: 4, floor: "" });
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const setStatus = (id: string, status: string) => {
    setLocalTables((prev) => prev.map((t) => t.id === id ? { ...t, status: status as TableStatus } : t));
    toast.success(`Table → ${STATUS_CONFIG[status]?.label}`);
    setSelected(null);
    patchMutation.mutate({ id, status });
  };

  const selectedTable = tables.find((t) => t.id === selected);

  const counts = useMemo(() => ({
    OCCUPIED: tables.filter((t) => t.status === "OCCUPIED").length,
    FREE: tables.filter((t) => t.status === "IDLE" || t.status === "FREE").length,
    RESERVED: tables.filter((t) => t.status === "RESERVED").length,
    CLEANING: tables.filter((t) => t.status === "CLEANING").length,
  }), [tables]);

  const filtered = useMemo(() =>
    filter === "all" ? tables : tables.filter((t) =>
      filter === "FREE" ? (t.status === "IDLE" || t.status === "FREE") : t.status === filter
    ),
    [tables, filter]
  );

  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Plan de salle"
        subtitle={
          <span className="flex items-center gap-2">
            <span>{counts.OCCUPIED} occupées · {counts.FREE} libres · {counts.RESERVED} réservées</span>
            {lastUpdate && (
              <span className="text-[10px] text-muted-foreground/50">· màj {lastUpdate}</span>
            )}
          </span>
        }
        actions={
          <>
            <button
              onClick={() => refetch()}
              aria-label="Rafraîchir les tables"
              className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Ajouter
            </button>
          </>
        }
      />

      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Occupancy bar */}
          <div className="rounded-2xl border border-border bg-gradient-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground">Taux d&apos;occupation</p>
              <p className="text-xs font-bold text-primary">
                {tables.length > 0 ? Math.round((counts.OCCUPIED / tables.length) * 100) : 0}%
              </p>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden flex">
              <div className="h-full bg-primary/80 transition-all duration-500" style={{ width: `${tables.length > 0 ? (counts.OCCUPIED / tables.length) * 100 : 0}%` }} />
              <div className="h-full bg-blue-400/60 transition-all duration-500" style={{ width: `${tables.length > 0 ? (counts.RESERVED / tables.length) * 100 : 0}%` }} />
              <div className="h-full bg-yellow-400/60 transition-all duration-500" style={{ width: `${tables.length > 0 ? (counts.CLEANING / tables.length) * 100 : 0}%` }} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
              {[
                { label: "Occupée", cls: "bg-primary/80" },
                { label: "Réservée", cls: "bg-blue-400/60" },
                { label: "Nettoyage", cls: "bg-yellow-400/60" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-sm inline-block ${l.cls}`} /> {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-secondary rounded-xl p-1 w-fit flex-wrap">
            {([["all", "Toutes"], ["FREE", "Libres"], ["OCCUPIED", "Occupées"], ["RESERVED", "Réservées"], ["CLEANING", "Nettoyage"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === key ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid — #37 : séparateurs par zone/floor */}
          {isLoading && restaurantId ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
          ) : (() => {
            /* Group tables by floor label; tables without floor go into "Salle principale" */
            const groups = filtered.reduce<Record<string, TableData[]>>((acc, t) => {
              const zone = t.floor || "Salle principale";
              if (!acc[zone]) acc[zone] = [];
              acc[zone].push(t);
              return acc;
            }, {});
            const hasMultipleZones = Object.keys(groups).length > 1;
            return (
              <div className="space-y-4">
                {Object.entries(groups).map(([zone, zoneTables]) => (
                  <div key={zone}>
                    {hasMultipleZones && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{zone}</span>
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-[10px] text-muted-foreground/60">{zoneTables.length} table{zoneTables.length > 1 ? "s" : ""}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {zoneTables.map((table) => (
                        <TableCard
                          key={table.id}
                          table={table}
                          selected={selected === table.id}
                          onClick={() => setSelected(selected === table.id ? null : table.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Right panel */}
        <div>
          {selectedTable ? (
            <div className="rounded-2xl border border-border bg-gradient-card p-6 sticky top-24 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedTable.number}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={cn("w-2 h-2 rounded-full", STATUS_CONFIG[selectedTable.status]?.dot ?? "bg-emerald-400")} />
                    <span className="text-xs text-muted-foreground">{STATUS_CONFIG[selectedTable.status]?.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{selectedTable.capacity} pers.</span>
                </div>
              </div>

              {selectedTable.orders?.[0] && (
                <div className="rounded-xl bg-secondary/50 p-3 space-y-1.5">
                  {selectedTable.orders[0].customer?.name && (
                    <div className="text-xs font-medium text-foreground">{selectedTable.orders[0].customer.name}</div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">#{selectedTable.orders[0].id.slice(-6).toUpperCase()}</span>
                    <span className="font-bold text-primary">{selectedTable.orders[0].total.toFixed(2)} €</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Changer le statut</p>
                {(["IDLE", "OCCUPIED", "RESERVED", "CLEANING"] as const)
                  .filter((s) => {
                    const norm = selectedTable.status === "FREE" ? "IDLE" : selectedTable.status;
                    return s !== norm;
                  })
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatus(selectedTable.id, status)}
                      className="w-full flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      <div className={cn("w-2 h-2 rounded-full", STATUS_CONFIG[status].dot)} />
                      {STATUS_CONFIG[status].label}
                    </button>
                  ))}
              </div>

              {selectedTable.status === "OCCUPIED" && (
                <button
                  onClick={() => { setStatus(selectedTable.id, "IDLE"); }}
                  className="w-full rounded-xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Libérer & encaisser
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-gradient-card p-8 text-center">
              <Grid3X3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Cliquez sur une table pour la gérer</p>
              <p className="text-xs text-muted-foreground/50 mt-1">⌘K pour naviguer rapidement</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-border bg-card p-8 w-full max-w-sm shadow-card animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Ajouter une table</h2>
              <button onClick={() => setShowAddModal(false)} aria-label="Fermer" className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Numéro / Nom *</label>
                <input
                  value={addForm.number}
                  onChange={(e) => setAddForm((p) => ({ ...p, number: e.target.value }))}
                  placeholder="Ex: T13 ou Terrasse 3"
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Capacité</label>
                <div className="flex items-center gap-2">
                  {[2, 4, 6, 8, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAddForm((p) => ({ ...p, capacity: n }))}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${addForm.capacity === n ? "bg-gradient-warm text-primary-foreground" : "bg-secondary border border-border text-foreground hover:border-primary/30"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Zone (optionnel)</label>
                <input
                  value={addForm.floor}
                  onChange={(e) => setAddForm((p) => ({ ...p, floor: e.target.value }))}
                  placeholder="Salle principale, Terrasse..."
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  if (!addForm.number.trim()) { toast.error("Numéro requis"); return; }
                  if (restaurantId) {
                    addMutation.mutate();
                  } else {
                    setLocalTables((p) => [...p, { id: `local-${Date.now()}`, ...addForm, status: "IDLE" as TableStatus }]);
                    toast.success("Table ajoutée !");
                    setShowAddModal(false);
                    setAddForm({ number: "", capacity: 4, floor: "" });
                  }
                }}
                disabled={addMutation.isPending}
                className="w-full rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {addMutation.isPending ? "Création..." : "Créer la table"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
