"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Download, MapPin, Star, Globe, Phone, Mail, X, Share2, CreditCard as CardIcon, ExternalLink } from "lucide-react";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { toast } from "sonner";

/* ── QR mini-composant via canvas ────────────────────────────────── */
function QRCanvas({ url, size = 120, label, color = "#F89544" }: { url: string; size?: number; label: string; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      if (cancelled) return;
      QRCode.toDataURL(url, {
        width: size * 2,
        margin: 1,
        color: { dark: "#0E1320", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      }).then((d) => { if (!cancelled) setDataUrl(d); });
    });
    return () => { cancelled = true; };
  }, [url, size]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${label.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
    toast.success(`QR "${label}" téléchargé !`);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-xl border-2 overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform"
        style={{ borderColor: color, width: size, height: size }}
        onClick={download}
        title="Cliquer pour télécharger"
      >
        {dataUrl ? (
          <img src={dataUrl} alt={label} width={size} height={size} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary animate-pulse">
            <QrCode className="w-8 h-8 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <p className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{label}</p>
    </div>
  );
}

/* ── VCard generator ─────────────────────────────────────────────── */
function buildVCard(restaurant: any, origin: string): string {
  const name = restaurant?.name ?? "Mon Restaurant";
  const phone = restaurant?.phone ?? "";
  const email = restaurant?.email ?? "";
  const address = restaurant?.address ?? "";
  const url = restaurant?.slug ? `${origin}/menu/${restaurant.slug}` : origin;

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `ORG:${name}`,
    phone ? `TEL;TYPE=WORK,VOICE:${phone}` : "",
    email ? `EMAIL;TYPE=WORK:${email}` : "",
    address ? `ADR;TYPE=WORK:;;${address};;;` : "",
    `URL:${url}`,
    `NOTE:Menu digital Tableo — ${url}`,
    "END:VCARD",
  ].filter(Boolean).join("\n");
}

/* ── Main component ──────────────────────────────────────────────── */
export function DigitalCard() {
  const [open, setOpen] = useState(false);
  const { data: restaurant } = useRestaurant();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://tableo.app";

  const menuUrl = restaurant?.slug
    ? `${origin}/menu/${restaurant.slug}`
    : `${origin}/menu/demo`;

  const mapsUrl = restaurant?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant?.name ?? "restaurant")}`;

  const reviewsUrl = restaurant?.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${restaurant.googlePlaceId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((restaurant?.name ?? "restaurant") + " avis")}`;

  const downloadVCard = () => {
    const vcf = buildVCard(restaurant, origin);
    const blob = new Blob([vcf], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(restaurant?.name ?? "restaurant").toLowerCase().replace(/\s+/g, "-")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Carte de contact téléchargée !");
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: restaurant?.name ?? "Menu", url: menuUrl });
    } else {
      await navigator.clipboard.writeText(menuUrl);
      toast.success("Lien copié !");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors hover:border-primary/30"
        title="Carte de contact numérique"
      >
        <CardIcon className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Carte digitale</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-card overflow-hidden animate-scale-in">
            {/* Header gradient */}
            <div className="relative px-6 pt-6 pb-5 bg-gradient-warm">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xl font-bold text-white shadow-warm shrink-0">
                  {restaurant?.name?.slice(0, 2).toUpperCase() ?? "T"}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{restaurant?.name ?? "Mon Restaurant"}</h2>
                  {restaurant?.address && <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.address}</p>}
                  {restaurant?.phone && <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />{restaurant.phone}</p>}
                </div>
              </div>
            </div>

            {/* QR Codes */}
            <div className="p-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">QR Codes</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <QRCanvas url={menuUrl} size={96} label="Menu digital" color="#F89544" />
                <QRCanvas url={mapsUrl} size={96} label="Google Maps" color="#4285F4" />
                <QRCanvas url={reviewsUrl} size={96} label="Laisser un avis" color="#34A853" />
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Menu", href: menuUrl, icon: Globe, color: "text-primary" },
                  { label: "Maps", href: mapsUrl, icon: MapPin, color: "text-blue-400" },
                  { label: "Avis", href: reviewsUrl, icon: Star, color: "text-emerald-400" },
                ].map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary/50 py-3 text-xs font-medium text-foreground hover:border-primary/30 hover:bg-secondary transition-all group"
                  >
                    <link.icon className={`w-4 h-4 ${link.color} group-hover:scale-110 transition-transform`} />
                    {link.label}
                    <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/50" />
                  </a>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadVCard}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-3 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger vCard
                </button>
                <button
                  onClick={share}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  Partager le menu
                </button>
              </div>

              <p className="text-center text-[10px] text-muted-foreground mt-4">
                Les QR codes sont cliquables pour télécharger en PNG haute résolution
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
