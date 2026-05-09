"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Wand2, Eye, Loader2, Globe, X, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MenuEditor } from "@/components/menu/MenuEditor";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function MenuPage() {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["menus", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/menu?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  const menus = data?.menus ?? [];

  const publishMutation = useMutation({
    mutationFn: async ({ menuId, publish }: { menuId: string; publish: boolean }) => {
      const res = await fetch(`/api/menu/${menuId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: publish }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (_, { publish }) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success(publish ? "Menu mis en ligne !" : "Menu dépublié");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, name: newMenuName.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu créé !");
      setShowNewModal(false);
      setNewMenuName("");
      if (data?.menu?.id) setSelectedMenuId(data.menu.id);
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const handleImport = async () => {
    if (!importText.trim() || importText.length < 20) {
      toast.error("Collez le texte de votre menu (minimum 20 caractères)");
      return;
    }
    if (!restaurantId) {
      toast.error("Restaurant non chargé");
      return;
    }
    setImporting(true);
    try {
      // Utilise /api/menu/upload qui PERSISTE en DB (Menu + Categories + Dishes)
      const fd = new FormData();
      fd.append("restaurantId", restaurantId);
      fd.append("text", importText);
      const res = await fetch("/api/menu/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de l'import");
        return;
      }
      const total = data.totalDishes ?? data.menu?.categories?.reduce((s: number, c: any) => s + (c.dishes?.length ?? 0), 0) ?? 0;
      if (total > 0) {
        toast.success(`✨ ${total} plats importés en ${data.menu?.categories?.length ?? 0} catégories !`);
        queryClient.invalidateQueries({ queryKey: ["menus", restaurantId] });
        setShowImportModal(false);
        setImportText("");
        if (data.menu?.id) setSelectedMenuId(data.menu.id);
      } else {
        toast.error("Aucun plat détecté. Vérifiez le texte.");
      }
    } catch {
      toast.error("Erreur lors de l'analyse IA");
    } finally {
      setImporting(false);
    }
  };

  /* Amélioration #15 : fermeture modale sur Escape — WCAG 2.1.2 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setShowImportModal(false); setShowNewModal(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (selectedMenuId) {
    const menu = menus.find((m: any) => m.id === selectedMenuId);
    if (!menu) {
      // Le menu vient d'être supprimé : retour à la liste
      setSelectedMenuId(null);
      return null;
    }
    return <MenuEditor menu={menu} restaurantId={restaurantId} onBack={() => setSelectedMenuId(null)} />;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* #38 — PageHeader réutilisable remplace le sticky header inline */}
      <PageHeader
        title="Menus"
        subtitle={`${menus.length} menu${menus.length > 1 ? "s" : ""}`}
        actions={
          <>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> Import IA
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Nouveau menu
            </button>
          </>
        }
      />

      <div className="p-6">
        {isLoading && restaurantId ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {menus.map((menu: any) => {
              const dishCount = menu.categories?.reduce((s: number, c: any) => s + (c.dishes?.length ?? 0), 0) ?? 0;
              return (
                <div key={menu.id} className="rounded-2xl border border-border bg-gradient-card p-6 hover:border-primary/20 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground">{menu.name}</h3>
                        <button
                          onClick={() => publishMutation.mutate({ menuId: menu.id, publish: !menu.isPublished })}
                          disabled={publishMutation.isPending}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all ${menu.isPublished ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                        >
                          {menu.isPublished ? "● En ligne" : "Brouillon"}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span>{menu._count?.categories ?? menu.categories?.length ?? 0} catégories</span>
                        <span>{dishCount} plats</span>
                        {menu.isPublished && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Accessible par QR
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/menu/${restaurant?.slug ?? "demo"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
                        aria-label="Aperçu du menu"
                      >
                        <Eye className="w-3.5 h-3.5" /> Aperçu
                      </a>
                      <button
                        onClick={() => setSelectedMenuId(menu.id)}
                        className="rounded-lg bg-gradient-warm px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:scale-[1.02] transition-all"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {menus.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Aucun menu pour l&apos;instant</p>
                <p className="text-xs text-muted-foreground mb-4">Créez votre premier menu ou importez-le via IA</p>
                <button onClick={() => setShowImportModal(true)} className="inline-flex items-center gap-2 text-xs text-primary hover:underline">
                  <Sparkles className="w-3.5 h-3.5" /> Importer avec l&apos;IA
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Amélioration #15 : Import IA Modal — role="dialog" + aria-modal + aria-labelledby */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowImportModal(false); }}
        >
          <div
            role="dialog" aria-modal="true" aria-labelledby="modal-import-title"
            className="rounded-2xl border border-border bg-card p-8 w-full max-w-lg shadow-card animate-scale-in"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 id="modal-import-title" className="text-lg font-bold text-foreground">Import IA</h2>
              <button onClick={() => setShowImportModal(false)} aria-label="Fermer la modale d'import IA" className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg p-1">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Collez le texte de votre carte — Claude l&apos;analyse et structure automatiquement vos catégories et plats.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={"Entrées\nSoupe à l'oignon - 12€\nTartare de boeuf - 18€\n\nPlats\nMagret de canard - 28€\nSaumon mi-cuit - 26€\n\nDesserts\nFondant chocolat - 14€"}
              rows={10}
              className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none font-mono text-xs"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Claude analyse...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analyser avec Claude</>
                )}
              </button>
              <button onClick={() => setShowImportModal(false)} className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nouveau menu Modal — role="dialog" accessible */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowNewModal(false); }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="modal-new-title"
            className="rounded-2xl border border-border bg-card p-8 w-full max-w-sm shadow-card animate-scale-in"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="modal-new-title" className="text-lg font-bold text-foreground">Nouveau menu</h2>
              <button onClick={() => setShowNewModal(false)} aria-label="Fermer la modale de création de menu" className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg p-1">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-menu-name" className="text-xs font-medium text-muted-foreground mb-1.5 block">Nom du menu <span aria-hidden="true">*</span></label>
                <input
                  id="new-menu-name"
                  autoFocus
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="Ex: Menu Été 2026"
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors focus-ring"
                  onKeyDown={(e) => e.key === "Enter" && newMenuName.trim() && createMutation.mutate()}
                />
              </div>
              <button
                onClick={() => {
                  if (!newMenuName.trim()) { toast.error("Nom requis"); return; }
                  createMutation.mutate();
                }}
                disabled={createMutation.isPending}
                className="w-full rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {createMutation.isPending ? "Création..." : "Créer le menu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
