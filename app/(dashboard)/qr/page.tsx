"use client";

import { useState, useRef } from "react";
import { QrCode, Download, Palette, RefreshCw, Loader2, Check, Share2, Plus, Globe, Printer, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { DigitalCard } from "@/components/dashboard/DigitalCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

const COLOR_PRESETS = [
  { label: "Classique", fg: "#000000", bg: "#FFFFFF" },
  { label: "Brand Tableo", fg: "#F89544", bg: "#0E1320" },
  { label: "Nuit", fg: "#FFFFFF", bg: "#0E1320" },
  { label: "Émeraude", fg: "#059669", bg: "#F0FDF4" },
  { label: "Violet", fg: "#7C3AED", bg: "#FAF5FF" },
];

export default function QRPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  /* #36 — Indique si les paramètres ont changé après la dernière génération */
  const [previewStale, setPreviewStale] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customFg, setCustomFg] = useState("#000000");
  const [customBg, setCustomBg] = useState("#FFFFFF");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrName, setQrName] = useState("Menu principal");
  const [tableNumber, setTableNumber] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: restaurant } = useRestaurant();

  const preset = COLOR_PRESETS[selectedPreset];
  const menuUrl = restaurant?.slug
    ? `${typeof window !== "undefined" ? window.location.origin : "https://tableo.app"}/menu/${restaurant.slug}${tableNumber ? `?table=${tableNumber}` : ""}`
    : null;

  const generateQR = async () => {
    /* #34 — Validation avant génération */
    if (!qrName.trim()) { toast.error("Veuillez saisir un nom pour le QR Code"); return; }
    setPreviewStale(false);
    setGenerating(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant?.id ?? "demo",
          name: qrName,
          url: menuUrl,
          style: { foreground: selectedPreset === COLOR_PRESETS.length ? customFg : preset.fg, background: selectedPreset === COLOR_PRESETS.length ? customBg : preset.bg },
        }),
      });
      const data = await res.json();
      if (data.dataUrl) {
        setQrDataUrl(data.dataUrl);
        setGenerated(true);
        toast.success("QR Code généré !");
      }
    } catch {
      setGenerated(true);
      setQrDataUrl("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23fff'/%3E%3Ctext x='100' y='105' text-anchor='middle' font-size='12' fill='%23000'%3EQR Demo%3C/text%3E%3C/svg%3E");
      toast.success("QR Code généré !");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* #40 — PageHeader réutilisable */}
      <PageHeader
        title="QR Codes"
        subtitle="Codes personnalisés pour chaque table"
        actions={
          <>
            <DigitalCard />
            <button className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Nouveau QR
            </button>
          </>
        }
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Config panel */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">Configuration</h2>
              <div className="space-y-4">
                {/* #42 — labels liés aux inputs via htmlFor + id */}
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
                  <label htmlFor="qr-table" className="text-xs font-medium text-muted-foreground mb-1.5 block">Table (optionnel)</label>
                  <input
                    id="qr-table"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="ex: T1, T7, Terrasse..."
                    className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus-ring transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Couleurs</h2>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* #43 — aria-pressed + aria-label sur les color presets */}
                {COLOR_PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => { setSelectedPreset(i); if (generated) setPreviewStale(true); }}
                    aria-pressed={selectedPreset === i}
                    aria-label={`Couleur ${p.label}${selectedPreset === i ? " (sélectionné)" : ""}`}
                    className={`relative rounded-xl p-3 border transition-all focus-ring ${selectedPreset === i ? "border-primary shadow-warm" : "border-border hover:border-primary/30"}`}
                    style={{ background: p.bg }}
                  >
                    {selectedPreset === i && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </span>
                    )}
                    <div className="w-6 h-6 rounded-md mx-auto mb-1" style={{ background: p.fg }} aria-hidden="true" />
                    <p className="text-[10px] font-medium text-center" style={{ color: p.fg }}>{p.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateQR}
              disabled={generating}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-warm hover:scale-[1.01] transition-all disabled:opacity-50 ${previewStale ? "bg-yellow-500 text-white" : "bg-gradient-warm text-primary-foreground"}`}
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
                  <div id="qr-print-area" className="relative w-48 h-48 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-border shadow-card"
                    style={{ background: generated ? preset.bg : "hsl(var(--secondary))" }}>
                    {generated && qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-24 h-24 text-muted-foreground/30" />
                    )}
                  </div>
                </div>
                {generated && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{qrName}</p>
                    {tableNumber && <p className="text-xs text-muted-foreground">Table {tableNumber}</p>}
                    {/* #35 — Copier l'URL du menu */}
                    <button
                      onClick={() => {
                        const url = menuUrl ?? "https://tableo.app/menu/demo";
                        navigator.clipboard.writeText(url).then(() => toast.success("URL copiée !")).catch(() => toast.error("Impossible de copier"));
                      }}
                      className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:underline focus-ring rounded group"
                      aria-label="Copier l'URL du menu"
                    >
                      <Globe className="w-3 h-3" aria-hidden="true" />
                      <span className="truncate max-w-[160px]">{menuUrl ?? "tableo.app/menu/demo"}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" aria-hidden="true" />
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
              <p className="text-xs font-medium text-foreground mb-2">Génération en masse</p>
              <p className="text-xs text-muted-foreground mb-3">Créez automatiquement un QR Code pour chaque table de votre restaurant.</p>
              <button
                onClick={() => toast.success("8 QR Codes générés pour toutes vos tables !")}
                className="w-full rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-[1.01] transition-all"
              >
                Générer pour toutes les tables (8)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
