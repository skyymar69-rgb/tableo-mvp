"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store, Palette, Bell, CreditCard, Save, Loader2, Upload, Check, Shield, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRestaurant } from "@/lib/hooks/useRestaurant";

const TABS = [
  { key: "restaurant", label: "Restaurant", icon: Store },
  { key: "appearance", label: "Apparence", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "billing", label: "Abonnement", icon: CreditCard },
];

const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "CAD"];
const TIMEZONES = ["Europe/Paris", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("restaurant");
  const [saving, setSaving] = useState(false);
  /* #33 — isDirty : détecte les modifications non sauvegardées */
  const [isDirty, setIsDirty] = useState(false);
  const { data: restaurant } = useRestaurant();

  const [restaurantForm, setRestaurantForm] = useState({
    name: "Le Petit Bistro",
    description: "Restaurant gastronomique français au cœur de Paris",
    address: "12 Rue de la Paix, 75001 Paris",
    phone: "+33 1 42 00 00 00",
    email: "contact@lepetitbistro.fr",
    website: "www.lepetitbistro.fr",
    currency: "EUR",
    timezone: "Europe/Paris",
    openingHours: "12:00 - 14:30 | 19:00 - 22:30",
  });

  useEffect(() => {
    if (restaurant) {
      setRestaurantForm((p) => ({
        ...p,
        name: restaurant.name ?? p.name,
        address: restaurant.address ?? p.address,
        phone: restaurant.phone ?? p.phone,
        email: restaurant.email ?? p.email,
        currency: restaurant.currency ?? p.currency,
        timezone: restaurant.timezone ?? p.timezone,
      }));
      if (restaurant.settings) {
        setAppearanceForm((p) => ({
          ...p,
          primaryColor: restaurant.settings.primaryColor ?? p.primaryColor,
          accentColor: restaurant.settings.accentColor ?? p.accentColor,
        }));
      }
    }
  }, [restaurant]);

  const [appearanceForm, setAppearanceForm] = useState({
    primaryColor: "#F89544",
    accentColor: "#E879A0",
    logo: null as null | string,
    menuLayout: "cards",
    showPrices: true,
    showAllergens: true,
    showCalories: false,
  });

  const [notifForm, setNotifForm] = useState({
    newOrder: true,
    orderReady: true,
    lowStock: true,
    newReview: false,
    dailyReport: true,
    weeklyReport: false,
    emailNotif: true,
    pushNotif: false,
    smsNotif: false,
  });

  const save = async () => {
    setSaving(true);
    setIsDirty(false);
    try {
      if (restaurant?.id) {
        const payload: Record<string, any> = {
          name: restaurantForm.name,
          description: restaurantForm.description,
          address: restaurantForm.address,
          phone: restaurantForm.phone,
          email: restaurantForm.email,
          website: restaurantForm.website,
          currency: restaurantForm.currency,
          timezone: restaurantForm.timezone,
          openingHours: restaurantForm.openingHours,  // B4 : ajout du champ qui était perdu
          primaryColor: appearanceForm.primaryColor,
          accentColor: appearanceForm.accentColor,
          settings: {
            menuLayout: appearanceForm.menuLayout,
            showPrices: appearanceForm.showPrices,
            showAllergens: appearanceForm.showAllergens,
            showCalories: appearanceForm.showCalories,
          },
        };
        if (appearanceForm.logo) payload.logoUrl = appearanceForm.logo;
        const res = await fetch(`/api/restaurant/${restaurant.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Save failed");
      }
      toast.success("Paramètres sauvegardés !");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* #33 — dirty-dot sur le titre si modifications non sauvegardées */}
      <PageHeader
        title={
          <span className={isDirty ? "dirty-dot" : ""}>Paramètres</span>
        }
        subtitle="Configurez votre restaurant"
        actions={
          <button
            onClick={save}
            disabled={saving}
            aria-label={isDirty ? "Sauvegarder les modifications" : "Paramètres déjà à jour"}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-warm hover:scale-[1.02] transition-all disabled:opacity-50 ${isDirty ? "bg-gradient-warm text-primary-foreground" : "bg-secondary text-muted-foreground border border-border"}`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Save className="w-3.5 h-3.5" aria-hidden="true" />}
            {saving ? "Sauvegarde..." : isDirty ? "Sauvegarder *" : "Sauvegarder"}
          </button>
        }
      />

      <div className="p-6 grid lg:grid-cols-4 gap-6 max-w-6xl">
        {/* Tab nav */}
        <div className="space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left",
                activeTab === tab.key
                  ? "bg-gradient-warm text-primary-foreground shadow-warm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "restaurant" && (
            <>
              {/* Logo upload */}
              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">Logo & identité</h2>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer group relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-warm flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0 overflow-hidden group-hover:opacity-80 transition-opacity">
                      {appearanceForm.logo ? (
                        <img src={appearanceForm.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span>{restaurantForm.name ? restaurantForm.name.slice(0, 2).toUpperCase() : "T"}</span>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2_000_000) { toast.error("Logo trop volumineux (max 2 Mo)"); return; }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setAppearanceForm((p) => ({ ...p, logo: ev.target?.result as string }));
                          toast.success("Logo mis à jour !");
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Logo du restaurant</p>
                    <p className="text-[10px] text-muted-foreground">Cliquez sur l&apos;image pour changer · PNG, JPG · max 2 Mo</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">Informations générales</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Amélioration #13 : label htmlFor + input id — WCAG 1.3.1 */}
                  {[
                    { key: "name",         label: "Nom du restaurant",    full: true, type: "text"  },
                    { key: "description",  label: "Description",          full: true, type: "text"  },
                    { key: "address",      label: "Adresse",              full: true, type: "text"  },
                    { key: "phone",        label: "Téléphone",            full: false, type: "tel"  },
                    { key: "email",        label: "Email",                full: false, type: "email"},
                    { key: "website",      label: "Site web",             full: false, type: "url"  },
                    { key: "openingHours", label: "Horaires d'ouverture", full: true, type: "text"  },
                  ].map((field) => (
                    <div key={field.key} className={field.full ? "col-span-2" : ""}>
                      <label htmlFor={`setting-${field.key}`} className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        {field.label}
                      </label>
                      <input
                        id={`setting-${field.key}`}
                        type={field.type}
                        value={(restaurantForm as Record<string, string>)[field.key]}
                        onChange={(e) => { setRestaurantForm((p) => ({ ...p, [field.key]: e.target.value })); setIsDirty(true); }}
                        className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors focus-ring"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Devise</label>
                    <select
                      value={restaurantForm.currency}
                      onChange={(e) => setRestaurantForm((p) => ({ ...p, currency: e.target.value }))}
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuseau horaire</label>
                    <select
                      value={restaurantForm.timezone}
                      onChange={(e) => setRestaurantForm((p) => ({ ...p, timezone: e.target.value }))}
                      className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">Couleurs de marque</h2>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { key: "primaryColor", label: "Couleur principale" },
                    { key: "accentColor", label: "Couleur d'accent" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">{field.label}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={(appearanceForm as Record<string, unknown>)[field.key] as string}
                          onChange={(e) => setAppearanceForm((p) => ({ ...p, [field.key]: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-secondary"
                        />
                        <input
                          value={(appearanceForm as Record<string, unknown>)[field.key] as string}
                          onChange={(e) => setAppearanceForm((p) => ({ ...p, [field.key]: e.target.value }))}
                          className="flex-1 rounded-xl bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">Affichage du menu client</h2>
                <div className="space-y-3">
                  {/* Amélioration #14 : role="switch" + aria-checked + aria-labelledby — WCAG 4.1.2 */}
                  {[
                    { key: "showPrices",    label: "Afficher les prix",      desc: "Les clients verront les prix sur le menu en ligne" },
                    { key: "showAllergens", label: "Afficher les allergènes", desc: "Affiche les icônes d'allergènes sur chaque plat" },
                    { key: "showCalories",  label: "Afficher les calories",   desc: "Affiche les informations caloriques si renseignées" },
                  ].map((toggle) => {
                    const checked = !!(appearanceForm as Record<string, unknown>)[toggle.key];
                    return (
                      <div key={toggle.key} className="flex items-center justify-between gap-4 py-1">
                        <div className="min-w-0">
                          <p id={`toggle-label-${toggle.key}`} className="text-sm font-medium text-foreground">{toggle.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{toggle.desc}</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={checked}
                          aria-labelledby={`toggle-label-${toggle.key}`}
                          onClick={() => setAppearanceForm((p) => ({ ...p, [toggle.key]: !checked }))}
                          className={cn(
                            "relative shrink-0 w-10 h-5 rounded-full transition-all duration-200 focus-ring",
                            checked ? "bg-primary" : "bg-border"
                          )}
                        >
                          <span className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                            checked ? "translate-x-5" : "translate-x-0.5"
                          )} aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-border bg-gradient-card p-6 space-y-6">
              {[
                {
                  section: "Événements",
                  items: [
                    { key: "newOrder", label: "Nouvelle commande", desc: "Alerte dès qu'une commande est passée" },
                    { key: "orderReady", label: "Commande prête", desc: "Quand une commande passe en statut Prête" },
                    { key: "lowStock", label: "Stock faible", desc: "Quand un plat est presque épuisé" },
                    { key: "newReview", label: "Nouvel avis", desc: "Quand un client laisse un avis" },
                  ],
                },
                {
                  section: "Rapports",
                  items: [
                    { key: "dailyReport", label: "Rapport quotidien", desc: "Résumé des performances de la journée" },
                    { key: "weeklyReport", label: "Rapport hebdomadaire", desc: "Analyse de la semaine" },
                  ],
                },
                {
                  section: "Canaux",
                  items: [
                    { key: "emailNotif", label: "Email", desc: "Notifications par email" },
                    { key: "pushNotif", label: "Push navigateur", desc: "Notifications push dans le navigateur" },
                    { key: "smsNotif", label: "SMS", desc: "Notifications par SMS (option payante)" },
                  ],
                },
              ].map(({ section, items }) => (
                <div key={section}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section}</p>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const checked = !!(notifForm as Record<string, unknown>)[item.key];
                      return (
                        <div key={item.key} className="flex items-center justify-between py-1">
                          <div id={`notif-label-${item.key}`}>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          {/* #34 role="switch" + aria-checked pour conformité WCAG 4.1.2 */}
                          <button
                            role="switch"
                            aria-checked={checked}
                            aria-labelledby={`notif-label-${item.key}`}
                            onClick={() => setNotifForm((p) => ({ ...p, [item.key]: !checked }))}
                            className={cn(
                              "relative shrink-0 w-10 h-5 rounded-full transition-all duration-200 focus-ring",
                              checked ? "bg-primary" : "bg-secondary border border-border"
                            )}
                          >
                            <span className={cn(
                              "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                              checked ? "translate-x-5" : "translate-x-0.5"
                            )} aria-hidden="true" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "billing" && (
            <>
              <div className="rounded-2xl border border-primary/20 bg-gradient-warm-subtle p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">Plan Growth</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">Actif</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Votre abonnement se renouvelle le 19 mai 2026</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">49 €<span className="text-xs font-normal text-muted-foreground">/mois</span></p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Menus", value: "3 / 5" },
                    { label: "Tables", value: "12 / 50" },
                    { label: "Commandes/mois", value: "247 / ∞" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-background/40 p-3">
                      <p className="text-xs font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Free", price: "0 €", features: ["1 menu", "10 tables", "QR codes basiques", "Commandes limites"], current: false, cta: "Déclasser" },
                  { name: "Growth", price: "49 €", features: ["5 menus", "50 tables", "QR codes brandés", "CRM + analytics", "AI insights"], current: true, cta: "Plan actuel" },
                  { name: "Enterprise", price: "149 €", features: ["Menus illimités", "Tables illimitées", "Multi-restaurant", "API + webhooks", "Support dédié"], current: false, cta: "Passer à Enterprise" },
                ].map((plan) => (
                  <div key={plan.name} className={cn("rounded-2xl border p-5", plan.current ? "border-primary/40 bg-primary/5" : "border-border bg-gradient-card")}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-foreground">{plan.name}</p>
                      {plan.current && <Shield className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <p className="text-lg font-bold text-foreground mb-4">{plan.price}<span className="text-xs font-normal text-muted-foreground">/mois</span></p>
                    <ul className="space-y-1.5 mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={async () => {
                        if (plan.current) return;
                        const tier = plan.name.toUpperCase();
                        try {
                          const res = await fetch("/api/stripe/checkout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ tier }),
                          });
                          const data = await res.json();
                          if (data.url) window.location.href = data.url;
                          else toast.error("Erreur lors de la redirection");
                        } catch {
                          toast.error("Stripe non configuré en développement");
                        }
                      }}
                      className={cn(
                        "w-full rounded-xl py-2 text-xs font-semibold transition-all",
                        plan.current
                          ? "bg-primary/10 text-primary cursor-default"
                          : "bg-gradient-warm text-primary-foreground hover:scale-[1.02]"
                      )}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-gradient-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">Facturation</h2>
                <div className="space-y-2">
                  {[
                    { date: "19 avr. 2026", amount: "49,00 €", status: "Payée" },
                    { date: "19 mars 2026", amount: "49,00 €", status: "Payée" },
                    { date: "19 fév. 2026", amount: "49,00 €", status: "Payée" },
                  ].map((invoice) => (
                    <div key={invoice.date} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">{invoice.date}</span>
                        <span className="font-medium text-foreground">{invoice.amount}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">{invoice.status}</span>
                        <button onClick={() => toast.success("Facture téléchargée")} className="text-[10px] text-primary hover:underline">PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
