"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Loader2, Globe, X, Sparkles, Link2, FileText, Image as ImageIcon, AlignLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { MenuEditor } from "@/components/menu/MenuEditor";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function MenuPage() {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [importTab, setImportTab] = useState<"url" | "pdf" | "image" | "text">("url");
  const [importUrl, setImportUrl] = useState("");
  const [importText, setImportText] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (!restaurantId) { toast.error("Restaurant non chargé"); return; }

    // Validation par onglet
    if (importTab === "url" && !importUrl.trim().startsWith("http")) {
      toast.error("Entrez une URL valide (commençant par http)");
      return;
    }
    if ((importTab === "pdf" || importTab === "image") && !importFile) {
      toast.error("Sélectionnez un fichier");
      return;
    }
    if (importTab === "text" && importText.trim().length < 20) {
      toast.error("Collez le texte de votre menu (minimum 20 caractères)");
      return;
    }

    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("restaurantId", restaurantId);
      fd.append("sourceType", importTab);
      if (importTab === "url") fd.append("url", importUrl.trim());
      else if (importTab === "pdf" || importTab === "image") fd.append("file", importFile!);
      else fd.append("text", importText);

      const res = await fetch("/api/menu/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur lors de l'import"); return; }

      const total = data.totalDishes ?? data.menu?.categories?.reduce((s: number, c: any) => s + (c.dishes?.length ?? 0), 0) ?? 0;
      if (total > 0) {
        toast.success(`✨ ${total} plats importés en ${data.menu?.categories?.length ?? 0} catégories !`);
        queryClient.invalidateQueries({ queryKey: ["menus", restaurantId] });
        setShowImportModal(false);
        setImportUrl(""); setImportText(""); setImportFile(null);
        if (data.menu?.id) setSelectedMenuId(data.menu.id);
      } else {
        toast.error("Aucun plat détecté. Vérifiez la source.");
      }
    } catch {
      toast.error("Erreur lors de l'analyse IA");
    } finally {
      setImporting(false);
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setImportFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImportFile(file);
  }, []);

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

      {/* Import IA Modal — multi-source */}
      {showImportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowImportModal(false); }}
        >
          <div
            role="dialog" aria-modal="true" aria-labelledby="modal-import-title"
            className="rounded-2xl border border-border bg-card p-6 w-full max-w-lg shadow-card animate-scale-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 id="modal-import-title" className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                  Import IA
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Importez votre menu depuis n&apos;importe quelle source</p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                aria-label="Fermer la modale d'import IA"
                className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg p-1"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-secondary p-1 mb-5 gap-1" role="tablist">
              {([
                { key: "url",   label: "Site web",  Icon: Link2 },
                { key: "pdf",   label: "PDF",        Icon: FileText },
                { key: "image", label: "Image",      Icon: ImageIcon },
                { key: "text",  label: "Texte",      Icon: AlignLeft },
              ] as const).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={importTab === key}
                  onClick={() => { setImportTab(key); setImportFile(null); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    importTab === key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            {importTab === "url" && (
              <div>
                <label htmlFor="import-url" className="text-xs font-medium text-muted-foreground mb-2 block">
                  URL du site ou de la carte en ligne
                </label>
                <input
                  id="import-url"
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://restaurant-example.com/carte"
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && !importing && handleImport()}
                />
                <p className="text-[11px] text-muted-foreground mt-2">Claude va extraire et structurer le menu depuis la page.</p>
              </div>
            )}

            {importTab === "pdf" && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  aria-label="Sélectionner un fichier PDF"
                  onChange={handleFileSelect}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Zone de dépôt de fichier PDF"
                  className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  {importFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{importFile.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setImportFile(null); }}
                        className="text-muted-foreground hover:text-foreground ml-1"
                        aria-label="Retirer le fichier"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm text-foreground font-medium">Glissez votre PDF ici</p>
                      <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {importTab === "image" && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  aria-label="Sélectionner une image"
                  onChange={handleFileSelect}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Zone de dépôt d'image"
                  className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  {importFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{importFile.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setImportFile(null); }}
                        className="text-muted-foreground hover:text-foreground ml-1"
                        aria-label="Retirer le fichier"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm text-foreground font-medium">Photo de votre carte</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — Claude lit l&apos;image</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {importTab === "text" && (
              <div>
                <label htmlFor="import-text" className="text-xs font-medium text-muted-foreground mb-2 block">
                  Collez le texte de votre carte
                </label>
                <textarea
                  id="import-text"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={"Entrées\nSoupe à l'oignon - 12€\nTartare de bœuf - 18€\n\nPlats\nMagret de canard - 28€\nRisotto truffe - 22€\n\nDesserts\nCrème brûlée - 9€"}
                  rows={9}
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none font-mono text-xs"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Claude analyse...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Importer le menu</>
                )}
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
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
