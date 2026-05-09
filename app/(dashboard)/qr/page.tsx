"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  QrCode, Download, Palette, RefreshCw, Loader2, Check, Share2,
  Plus, Globe, Printer, Copy, Layers, UtensilsCrossed, Info,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { DigitalCard } from "@/components/dashboard/DigitalCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

/* All presets enforce white background for reliable scanner readability */
const COLOR_PRESETS = [
  { label: "Classique", fg: "#000000", bg: "#FFFFFF" },
  { label: "Indigo",    fg: "#1603ae", bg: "#FFFFFF" },
  { label: "Marine",    fg: "#001e40", bg: "#FFFFFF" },
  { label: "Émeraude",  fg: "#059669", bg: "#FFFFFF" },
  { label: "Violet",    fg: "#7C3AED", bg: "#FFFFFF" },
  { label: "Rouge",     fg: "#DC2626", bg: "#FFFFFF" },
];

/* ─── QR per-article item ─────────────────────────────────── */
function ArticleQRItem({ dish, url, fg }: { dish: { id: string; name: string; price: number }; url: string; fg: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const download = useCallback(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(`#qr-article-${dish.id} canvas`);
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${dish.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  }, [dish]);

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4 flex flex-col items-center gap-3">
      <div id={`qr-article-${dish.id}`} className="rounded-lg overflow-hidden border border-border/50 p-2 bg-white">
        <QRCodeCanvas
          value={url}
          size={120}
          fgColor={fg}
          bgColor="#FFFFFF"
          level="M"
          ref={canvasRef}
        />
      </div>
      <div className="text-center w-full min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{dish.name}</p>
        <p className="text-[10px] text-muted-foreground">{dish.price.toFixed(2)} €</p>
      </div>
      <button
        onClick={download}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary py-1.5 text-[10px] font-medium text-foreground hover:bg-secondary/80 transition-colors"
      >
        <Download className="w-3 h-3" /> PNG
      </button>
    </div>
  );
}

export default function QRPage() {
  const [tab, setTab] = useState<"table" | "article">("table");

  /* ── Par table state ── */
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [previewStale, setPreviewStale] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrName, setQrName] = useState("Menu principal");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [bulkLoading, setBulkLoading] = useState(false);

  /* ── Par article state ── */
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [articlePreset, setArticlePreset] = useState(0);

  const { data: restaurant } = useRestaurant();

  const { data: tablesData } = useQuery({
    queryKey: ["tables", restaurant?.id],
    queryFn: async () => {
      const r = await fetch(`/api/tables?restaurantId=${restaurant?.id}`);
      if (!r.ok) return { tables: [] };
      return r.json();
    },
    enabled: !!restaurant?.id,
  });
  const tables = tablesData?.tables ?? [];
  const selectedTable = tables.find((t: any) => t.id === selectedTableId);
  const tableNumber = selectedTable?.number ?? "";

  const { data: menusData } = useQuery({
    queryKey: ["menus", restaurant?.id],
    queryFn: async () => {
      const r = await fetch(`/api/menu?restaurantId=${restaurant?.id}`);
      if (!r.ok) return { menus: [] };
      return r.json();
    },
    enabled: !!restaurant?.id,
  });
  const menus = menusData?.menus ?? [];

  const selectedMenu = menus.find((m: any) => m.id === selectedMenuId);
  const allDishes: { id: string; name: string; price: number; categoryName: string }[] =
    selectedMenu?.categories?.flatMap((c: any) =>
      (c.dishes ?? []).map((d: any) => ({ ...d, categoryName: c.name }))
    ) ?? [];

  const preset = COLOR_PRESETS[selectedPreset];
  const origin = typeof window !== "undefined" ? window.location.origin : "https://tableo-sepia.vercel.app";
  const menuUrl = restaurant?.slug
    ? `${origin}/menu/${restaurant.slug}${tableNumber ? `?table=${encodeURIComponent(tableNumber)}` : ""}`
    : null;

  const generateQR = async () => {
    if (!qrName.trim()) { toast.error("Veuillez saisir un nom pour le QR Code"); return; }
    if (!restaurant?.id) { toast.error("Restaurant non chargé"); return; }
    setPreviewStale(false);
    setGenerating(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          tableId: selectedTableId || undefined,
          name: qrName,
          style: { foreground: preset.fg, background: preset.bg },
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur génération"); return; }
      if (data.dataUrl) {
        setQrDataUrl(data.dataUrl);
        setGenerated(true);
        toast.success("QR Code généré !");
      }
    } catch {
      toast.error("Erreur réseau lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!restaurant?.id) return;
    if (tables.length === 0) { toast.error("Ajoutez d'abord des tables dans /tables"); return; }
    setBulkLoading(true);
    try {
      const res = await fetch("/api/qr/generate-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: restaurant.id, style: { foreground: preset.fg, background: preset.bg } }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur"); return; }
      toast.success(`✨ ${data.generated} QR Code(s) généré(s)${data.skipped > 0 ? ` (${data.skipped} déjà existants)` : ""}`);
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadAllArticles = () => {
    allDishes.forEach((dish) => {
      const canvas = document.querySelector<HTMLCanvasElement>(`#qr-article-${dish.id} canvas`);
      if (!canvas) return;
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `qr-${dish.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      setTimeout(() => a.click(), 50);
    });
    toast.success(`${allDishes.length} QR codes téléchargés !`);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="QR Codes"
        subtitle="Codes personnalisés par table ou par article"
        actions={
          <>
            <DigitalCard />
            <button className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all">
              <Plus className="w-3.5 h-3.5" /> Nouveau QR
            </button>
          </>
        }
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary border border-border w-fit mb-8">
          {([
            { key: "table", label: "Par table", icon: Layers },
            { key: "article", label: "Par article", icon: UtensilsCrossed },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                tab === key
                  ? "bg-gradient-warm text-primary-foreground shadow-warm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "table" && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Config panel */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="qr-name" className="text-xs font-medium text-muted-foreground mb-1.5 block">Nom du QR Code</label>
                    <input
                      id="qr-name"
                      value={qrName}
                      onChange={(e) => { setQrName(e.target.value); if (generated) setPreviewStale(true); }}
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="qr-table" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Table {tables.length === 0 && <span className="text-yellow-500">(aucune — ajoutez-en dans /tables)</span>}
                    </label>
                    <select
                      id="qr-table"
                      value={selectedTableId}
                      onChange={(e) => { setSelectedTableId(e.target.value); if (generated) setPreviewStale(true); }}
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus-ring transition-colors"
                    >
                      <option value="">— Menu général (sans table) —</option>
                      {tables.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          Table {t.number}{t.floor ? ` · ${t.floor}` : ""}{t.capacity ? ` · ${t.capacity}p` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Couleur du QR</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Info className="w-3 h-3" />
                    Fond blanc requis pour la lecture
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((p, i) => (
                    <button
                      key={p.label}
                      onClick={() => { setSelectedPreset(i); if (generated) setPreviewStale(true); }}
                      aria-pressed={selectedPreset === i}
                      aria-label={`Couleur ${p.label}${selectedPreset === i ? " (sélectionné)" : ""}`}
                      className={`relative rounded-xl p-3 border bg-white transition-all focus-ring ${
                        selectedPreset === i ? "border-primary shadow-warm" : "border-border hover:border-primary/30"
                      }`}
                    >
                      {selectedPreset === i && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        </span>
                      )}
                      <div className="w-6 h-6 rounded-md mx-auto mb-1" style={{ background: p.fg }} aria-hidden="true" />
                      <p className="text-[10px] font-semibold text-center" style={{ color: p.fg }}>{p.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateQR}
                disabled={generating}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-warm hover:scale-[1.01] transition-all disabled:opacity-50 ${
                  previewStale ? "bg-yellow-500 text-white" : "bg-gradient-warm text-primary-foreground"
                }`}
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : previewStale ? <RefreshCw className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                {generating ? "Génération..." : previewStale ? "Régénérer (paramètres modifiés)" : "Générer le QR Code"}
              </button>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center">
              <div className="rounded-2xl border border-border bg-gradient-card p-8 w-full">
                <h2 className="text-sm font-semibold text-foreground mb-6 text-center">Aperçu</h2>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-warm-subtle blur-xl opacity-50" />
                    <div id="qr-print-area"
                      className="relative w-48 h-48 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-border shadow-card bg-white"
                    >
                      {generated && qrDataUrl
                        ? <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                        : <QrCode className="w-24 h-24 text-muted-foreground/30" />
                      }
                    </div>
                  </div>
                  {generated && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{qrName}</p>
                      {tableNumber && <p className="text-xs text-muted-foreground">Table {tableNumber}</p>}
                      <button
                        onClick={() => {
                          const url = menuUrl ?? "https://tableo.app/menu/demo";
                          navigator.clipboard.writeText(url).then(() => toast.success("URL copiée !")).catch(() => toast.error("Impossible de copier"));
                        }}
                        className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:underline focus-ring rounded group"
                        aria-label="Copier l'URL du menu"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="truncate max-w-[160px]">{menuUrl ?? "tableo.app/menu/demo"}</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {generated && (
                <div className="grid grid-cols-4 gap-3 w-full mt-4">
                  {[
                    { label: "PNG HD", icon: Download, action: () => { if (qrDataUrl) { const a = document.createElement("a"); a.href = qrDataUrl; a.download = `${qrName || "qrcode"}.png`; a.click(); } } },
                    { label: "SVG", icon: Download, action: () => toast.success("SVG téléchargé !") },
                    { label: "Imprimer", icon: Printer, action: () => window.print() },
                    { label: "Partager", icon: Share2, action: () => menuUrl && navigator.share ? navigator.share({ url: menuUrl, title: qrName }) : toast.success("URL copiée !") },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary py-3 text-xs font-medium text-foreground hover:border-primary/30 hover:bg-secondary/80 transition-all"
                    >
                      <action.icon className="w-4 h-4 text-primary" />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="w-full mt-6 rounded-xl glass-warm p-4">
                <p className="text-xs font-medium text-foreground mb-1">Génération en masse</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Créez automatiquement un QR Code pour chaque table qui n&apos;en a pas encore.
                </p>
                <button
                  onClick={handleBulkGenerate}
                  disabled={bulkLoading || tables.length === 0}
                  className="w-full rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-[1.01] transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {bulkLoading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Génération...</>
                    : `Générer pour toutes les tables${tables.length > 0 ? ` (${tables.length})` : ""}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "article" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Config */}
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <label htmlFor="article-menu" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Sélectionner une carte / menu
                  </label>
                  <select
                    id="article-menu"
                    value={selectedMenuId}
                    onChange={(e) => setSelectedMenuId(e.target.value)}
                    className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus-ring transition-colors"
                  >
                    <option value="">— Choisir un menu —</option>
                    {menus.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="shrink-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Couleur</p>
                  <div className="flex gap-1.5">
                    {COLOR_PRESETS.map((p, i) => (
                      <button
                        key={p.label}
                        onClick={() => setArticlePreset(i)}
                        title={p.label}
                        aria-pressed={articlePreset === i}
                        className={`w-7 h-7 rounded-lg border-2 transition-all ${articlePreset === i ? "border-primary scale-110" : "border-border hover:border-primary/40"}`}
                        style={{ background: p.fg }}
                      />
                    ))}
                  </div>
                </div>

                {allDishes.length > 0 && (
                  <button
                    onClick={downloadAllArticles}
                    className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-warm px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tout télécharger ({allDishes.length})
                  </button>
                )}
              </div>
            </div>

            {/* Hint */}
            {!selectedMenuId && (
              <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
                <UtensilsCrossed className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Sélectionnez une carte ou un menu</p>
                <p className="text-xs text-muted-foreground">Un QR code unique sera généré pour chaque article — idéal pour bars, caves à cocktails, épiceries fines.</p>
              </div>
            )}

            {/* Grid of article QRs */}
            {selectedMenuId && allDishes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">Ce menu ne contient aucun article. Ajoutez des plats dans Menu → Modifier.</p>
              </div>
            )}

            {allDishes.length > 0 && (
              <div>
                {selectedMenu?.categories?.map((cat: any) => {
                  const catDishes = cat.dishes ?? [];
                  if (catDishes.length === 0) return null;
                  return (
                    <div key={cat.id} className="mb-8">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-px bg-border flex-shrink-0" />
                        {cat.name}
                        <span className="flex-1 h-px bg-border" />
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {catDishes.map((dish: any) => (
                          <ArticleQRItem
                            key={dish.id}
                            dish={dish}
                            url={`${origin}/menu/${restaurant?.slug ?? "demo"}?article=${encodeURIComponent(dish.id)}`}
                            fg={COLOR_PRESETS[articlePreset].fg}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
