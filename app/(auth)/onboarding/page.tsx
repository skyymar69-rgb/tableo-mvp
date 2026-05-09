"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChefHat, QrCode, Sparkles, Check, ArrowRight, Loader2, Download,
  MapPin, Phone, Users, Clock, Globe, Star, Mail, Hash, Store,
} from "lucide-react";
import { toast } from "sonner";
import { fireMilestoneConfetti } from "@/lib/confetti";

const STEPS = [
  { id: 1, title: "Votre restaurant", icon: ChefHat },
  { id: 2, title: "Votre menu", icon: Sparkles },
  { id: 3, title: "Votre QR Code", icon: QrCode },
];

const ESTABLISHMENT_TYPES = [
  "Restaurant", "Bistro / Brasserie", "Gastronomique", "Pizzeria",
  "Sushi / Japonais", "Burger / Fast-casual", "Asiatique", "Libanais / Oriental",
  "Végétalien / Bio", "Bar à cocktails", "Bar à vins / Cave", "Pub / Bar sportif",
  "Discothèque / Club", "Rooftop / Terrasse bar", "Hôtel restaurant",
  "Food truck", "Traiteur / Épicerie fine", "Boulangerie / Café", "Autre",
];

const SEATING_OPTIONS = ["1–20", "21–50", "51–100", "100+"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantSlug, setRestaurantSlug] = useState("demo");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    zipCode: "",
    email: "",
    phone: "",
    establishmentType: "",
    seating: "",
    website: "",
    openingHours: "",
  });

  /* Au mount : récupérer le restaurant auto-créé pour pré-remplir et avoir l'id */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/restaurant");
        if (!res.ok) return;
        const { restaurants } = await res.json();
        const r = restaurants?.[0];
        if (r) {
          setRestaurantId(r.id);
          setRestaurantSlug(r.slug);
          // Pré-remplir uniquement si déjà rempli (revisite onboarding)
          setForm((p) => ({
            ...p,
            name: p.name || (r.name?.startsWith("Restaurant de ") ? "" : r.name ?? ""),
            description: p.description || r.description || "",
            address: p.address || r.address || "",
            city: p.city || r.city || "",
            email: p.email || r.email || "",
            phone: p.phone || r.phone || "",
            establishmentType: p.establishmentType || r.cuisineType || "",
            seating: p.seating || r.seating || "",
            website: p.website || r.website || "",
            openingHours: p.openingHours || r.openingHours || "",
          }));
        }
      } catch (err) {
        console.warn("[onboarding] restaurant prefill failed:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (step === 3) generateQR();
  }, [step, restaurantSlug]);

  const generateQR = async () => {
    try {
      const QRCode = (await import("qrcode")).default;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tableo.app";
      const url = `${appUrl}/menu/${restaurantSlug}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: { dark: "#0E1320", light: "#FFFFFF" },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.warn("[onboarding] QR generation failed:", err);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${restaurantSlug}.png`;
    a.click();
    toast.success("QR Code téléchargé !");
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!form.name.trim()) {
        toast.error("Veuillez entrer le nom de votre restaurant");
        return;
      }

      setLoading(true);

      // Si pas d'id (rare : auto-provisioning a échoué), on POST pour en créer un
      if (!restaurantId) {
        try {
          const res = await fetch("/api/restaurant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.name.trim() }),
          });
          if (!res.ok) throw new Error("create failed");
          const { restaurant } = await res.json();
          setRestaurantId(restaurant.id);
          setRestaurantSlug(restaurant.slug);
        } catch {
          toast.error("Impossible de créer le restaurant. Réessayez.");
          setLoading(false);
          return;
        }
      }

      // PATCH avec tous les champs du form
      try {
        const id = restaurantId ?? (await fetch("/api/restaurant").then(r => r.json()).then(j => j.restaurants?.[0]?.id));
        if (!id) throw new Error("no id");
        const res = await fetch(`/api/restaurant/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            address: [form.address.trim(), form.zipCode.trim()].filter(Boolean).join(", ") || null,
            city: form.city.trim() || null,
            email: form.email.trim() || null,
            phone: form.phone.trim() || null,
            website: form.website.trim() || null,
            cuisineType: form.establishmentType || null,
            seating: form.seating || null,
            openingHours: form.openingHours.trim() || null,
            status: "ACTIVE",
          }),
        });
        if (!res.ok) throw new Error("patch failed");
        const { restaurant } = await res.json();
        if (restaurant?.slug) setRestaurantSlug(restaurant.slug);
      } catch {
        toast.error("Impossible de sauvegarder. Réessayez.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    fireMilestoneConfetti();
    toast.success("🎉 Votre restaurant est prêt !");
    router.push("/dashboard");
  };

  const completionPct = Math.round(
    ([form.name, form.address, form.city, form.email, form.phone, form.establishmentType, form.description]
      .filter(Boolean).length / 7) * 100
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 noise-overlay">
      <div className="absolute inset-0 bg-hero-glow" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-xl font-bold text-foreground">Tableo</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s.id ? "bg-emerald-500 text-white" :
                step === s.id ? "bg-gradient-warm text-primary-foreground shadow-warm" :
                "bg-secondary text-muted-foreground"
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
              {i < STEPS.length - 1 && (
                <div className={`w-10 h-0.5 ${step > s.id ? "bg-emerald-500" : "bg-border"} transition-colors duration-500`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border border-border bg-gradient-card p-8 shadow-card animate-fade-up">
          {step === 1 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <ChefHat className="w-10 h-10 text-primary" />
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Profil complété</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-warm transition-all duration-500" style={{ width: `${completionPct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-primary">{completionPct}%</span>
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold text-foreground mb-1">Votre établissement</h1>
              <p className="text-sm text-muted-foreground mb-6">Renseignez les informations de base — plus c'est complet, mieux les clients vous trouvent.</p>

              <div className="space-y-4">
                {/* Nom + type */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Nom de l'établissement <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Ex: Le Bar des Artistes, Sky Club..."
                      autoFocus
                      className="w-full rounded-xl bg-secondary border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Type d'établissement + capacité */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type d'établissement</label>
                    <select
                      value={form.establishmentType}
                      onChange={(e) => setForm((p) => ({ ...p, establishmentType: e.target.value }))}
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="">Choisir...</option>
                      {ESTABLISHMENT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      <Users className="inline w-3 h-3 mr-1" />Capacité
                    </label>
                    <select
                      value={form.seating}
                      onChange={(e) => setForm((p) => ({ ...p, seating: e.target.value }))}
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="">Nombre de places...</option>
                      {SEATING_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Adresse rue */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    <MapPin className="inline w-3 h-3 mr-1" />Adresse (rue)
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="12 Rue de la Paix"
                    className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Code postal + Ville */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      <Hash className="inline w-3 h-3 mr-1" />Code postal
                    </label>
                    <input
                      value={form.zipCode}
                      onChange={(e) => setForm((p) => ({ ...p, zipCode: e.target.value }))}
                      placeholder="75001"
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Ville <span className="text-destructive">*</span>
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Paris"
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      <Mail className="inline w-3 h-3 mr-1" />Email de contact
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      type="email"
                      placeholder="contact@monbar.fr"
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      <Phone className="inline w-3 h-3 mr-1" />Téléphone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+33 1 23 45 67 89"
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Site web + Horaires */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      <Globe className="inline w-3 h-3 mr-1" />Site web
                    </label>
                    <input
                      value={form.website}
                      onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                      placeholder="www.monbar.fr"
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      <Clock className="inline w-3 h-3 mr-1" />Horaires
                    </label>
                    <input
                      value={form.openingHours}
                      onChange={(e) => setForm((p) => ({ ...p, openingHours: e.target.value }))}
                      placeholder="Mar-Dim 18h-2h"
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Décrivez votre établissement en quelques mots..."
                    rows={2}
                    className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h1 className="text-xl font-bold text-foreground mb-1">Créez votre menu</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Importez votre carte via IA en quelques secondes, ou construisez-la manuellement depuis le dashboard.
              </p>

              <div className="space-y-3 mb-4">
                {[
                  {
                    icon: Sparkles,
                    title: "Import IA (recommandé)",
                    desc: "Collez votre menu texte → Claude le structure automatiquement",
                    href: "/menu",
                    accent: true,
                  },
                  {
                    icon: Star,
                    title: "Éditeur drag & drop",
                    desc: "Créez catégories et plats manuellement avec notre éditeur visuel",
                    href: "/menu",
                    accent: false,
                  },
                ].map((opt) => (
                  <a
                    key={opt.title}
                    href={opt.href}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-all group hover:border-primary/30 ${opt.accent ? "glass-warm" : "border-border bg-secondary/30"}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${opt.accent ? "bg-gradient-warm" : "bg-secondary"}`}>
                      <opt.icon className={`w-4 h-4 ${opt.accent ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto shrink-0 transition-colors" />
                  </a>
                ))}
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Vous pouvez aussi sauter cette étape et le configurer plus tard.
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <QrCode className="w-10 h-10 text-primary mb-4" />
              <h1 className="text-xl font-bold text-foreground mb-1">Votre QR Code est prêt !</h1>
              <p className="text-sm text-muted-foreground mb-6">Imprimez-le et placez-le sur vos tables pour que vos clients puissent scanner votre menu.</p>
              <div className="flex flex-col items-center gap-4 py-2">
                {qrDataUrl ? (
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-2xl bg-gradient-warm-subtle blur-xl opacity-50 animate-pulse-slow" />
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="relative w-40 h-40 rounded-2xl border-2 border-primary/20 shadow-warm"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-2xl bg-secondary border-2 border-border flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{form.name || "Votre Restaurant"}</p>
                  <p className="text-xs text-primary mt-0.5">tableo.app/menu/{restaurantSlug}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={downloadQR}
                  disabled={!qrDataUrl}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> Télécharger PNG
                </button>
                <button
                  onClick={() => toast.success("Disponible dans QR Codes → Gérer")}
                  className="flex-1 rounded-xl bg-secondary border border-border py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Toutes les tables
                </button>
              </div>
            </>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Finalisation...</>
            ) : step === 3 ? (
              <><Check className="w-4 h-4" /> Accéder au dashboard</>
            ) : (
              <>Continuer <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-1.5 mt-6">
          {STEPS.map((s) => (
            <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${step === s.id ? "w-6 bg-primary" : step > s.id ? "w-3 bg-emerald-500" : "w-3 bg-border"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
