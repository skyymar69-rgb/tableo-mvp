"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Star, TrendingUp, TrendingDown, Mail, Phone, Award, Search, ChevronRight, Plus, AlertTriangle, Crown, Download, X, Send, Megaphone, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { toast } from "sonner";

const RFM_CONFIG = {
  champion: { label: "Champion", color: "text-emerald-400 bg-emerald-400/10", icon: Crown },
  loyal: { label: "Fidèle", color: "text-blue-400 bg-blue-400/10", icon: Star },
  promising: { label: "Prometteur", color: "text-primary bg-primary/10", icon: TrendingUp },
  at_risk: { label: "À risque", color: "text-yellow-400 bg-yellow-400/10", icon: AlertTriangle },
  lost: { label: "Perdu", color: "text-red-400 bg-red-400/10", icon: TrendingDown },
};

const DEMO_CUSTOMERS = [
  { id: "1", name: "Marie Dubois", email: "marie@example.fr", phone: "+33 6 12 34 56 78", totalVisits: 24, totalSpent: 1840, lastVisit: "2026-04-18", loyaltyPoints: 1840, rfmScore: "champion", tags: ["VIP", "Végétarien"] },
  { id: "2", name: "Thomas Martin", email: "thomas@example.fr", phone: "+33 6 98 76 54 32", totalVisits: 18, totalSpent: 1240, lastVisit: "2026-04-15", loyaltyPoints: 1240, rfmScore: "loyal", tags: ["Fidèle"] },
  { id: "3", name: "Sophie Leclerc", email: "sophie@example.fr", phone: "+33 6 11 22 33 44", totalVisits: 3, totalSpent: 180, lastVisit: "2026-03-01", loyaltyPoints: 180, rfmScore: "at_risk", tags: ["Nouveau"] },
  { id: "4", name: "Lucas Bernard", email: "lucas@example.fr", phone: null, totalVisits: 7, totalSpent: 560, lastVisit: "2026-04-10", loyaltyPoints: 560, rfmScore: "promising", tags: [] },
  { id: "5", name: "Emma Petit", email: "emma@example.fr", phone: "+33 6 55 44 33 22", totalVisits: 1, totalSpent: 45, lastVisit: "2026-01-15", loyaltyPoints: 45, rfmScore: "lost", tags: [] },
];

export default function CRMPage() {
  const { data: restaurant } = useRestaurant();
  const restaurantId = restaurant?.id;
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [segment, setSegment] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"totalVisits" | "totalSpent" | "loyaltyPoints" | "lastVisit">("totalSpent");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [exporting, setExporting] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [campaignSegment, setCampaignSegment] = useState("all");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [campaignType, setCampaignType] = useState<"promo" | "reactivation" | "newsletter">("promo");
  const [sending, setSending] = useState(false);
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("crm-customer-notes") ?? "{}"); } catch { return {}; }
    }
    return {};
  });
  const [editingNote, setEditingNote] = useState("");

  const CAMPAIGN_TEMPLATES = {
    promo: { subject: "🎉 Offre exclusive pour vous", message: "Bonjour {prénom},\n\nNous avons une offre spéciale pour vous : -15% sur votre prochaine visite avec le code FIDELE15.\n\nValable jusqu'au dimanche prochain.\n\nÀ bientôt,\nL'équipe {restaurant}" },
    reactivation: { subject: "Vous nous manquez ! 😊", message: "Bonjour {prénom},\n\nCela fait un moment que nous ne vous avons pas vu. Revenez nous rendre visite et profitez d'un dessert offert.\n\nÀ très bientôt,\nL'équipe {restaurant}" },
    newsletter: { subject: "Nos nouveautés du moment 🍽️", message: "Bonjour {prénom},\n\nDécouvrez nos nouvelles créations du chef ce mois-ci. Réservez dès maintenant pour ne pas manquer nos nouveautés.\n\nÀ bientôt,\nL'équipe {restaurant}" },
  };

  const applyTemplate = (type: keyof typeof CAMPAIGN_TEMPLATES) => {
    setCampaignType(type);
    setCampaignSubject(CAMPAIGN_TEMPLATES[type].subject);
    setCampaignMessage(CAMPAIGN_TEMPLATES[type].message);
  };

  const sendCampaign = async () => {
    if (!campaignSubject.trim() || !campaignMessage.trim()) { toast.error("Objet et message requis"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setShowCampaign(false);
    setCampaignSubject(""); setCampaignMessage("");
    const count = campaignSegment === "all" ? customers.length : segmentCounts(campaignSegment);
    toast.success(`Campagne envoyée à ${count} client${count > 1 ? "s" : ""} !`);
  };

  const handleSearchChange = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(value), 250);
  }, []);

  const exportCSV = async () => {
    if (!restaurantId) { toast.error("Restaurant non chargé"); return; }
    setExporting(true);
    try {
      const res = await fetch(`/api/export?type=customers&restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clients-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export CSV téléchargé !");
    } catch {
      toast.error("Erreur lors de l'export");
    } finally {
      setExporting(false);
    }
  };

  const { data } = useQuery({
    queryKey: ["customers", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/customers?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  const customers = (data?.customers?.length ? data.customers : DEMO_CUSTOMERS).map((c: any) => ({
    ...c,
    rfmScore: c.rfmScore ?? c.rfm ?? "promising",
    lastVisit: c.lastVisit ? new Date(c.lastVisit).toLocaleDateString("fr-FR") : "—",
  }));

  const stats = data?.stats ?? {
    total: DEMO_CUSTOMERS.length,
    avgSpent: DEMO_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / DEMO_CUSTOMERS.length,
    atRiskCount: 2,
    totalPoints: DEMO_CUSTOMERS.reduce((s, c) => s + c.loyaltyPoints, 0),
  };

  const toggleSort = useCallback((key: typeof sortKey) => {
    if (key === sortKey) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }, [sortKey]);

  const filtered = useMemo(() => customers.filter((c: any) => {
    const matchSearch = !search || (c.name ?? "").toLowerCase().includes(search.toLowerCase()) || (c.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchSeg = segment === "all" || c.rfmScore === segment;
    return matchSearch && matchSeg;
  }).sort((a: any, b: any) => {
    const av = sortKey === "lastVisit" ? new Date(a[sortKey] ?? 0).getTime() : (a[sortKey] ?? 0);
    const bv = sortKey === "lastVisit" ? new Date(b[sortKey] ?? 0).getTime() : (b[sortKey] ?? 0);
    return sortDir === "desc" ? bv - av : av - bv;
  }), [customers, search, segment, sortKey, sortDir]);

  const selectedCustomer = useMemo(() => customers.find((c: any) => c.id === selected), [customers, selected]);

  const saveNote = useCallback((customerId: string, note: string) => {
    const updated = { ...customerNotes, [customerId]: note };
    setCustomerNotes(updated);
    if (typeof window !== "undefined") localStorage.setItem("crm-customer-notes", JSON.stringify(updated));
    toast.success("Note sauvegardée !");
  }, [customerNotes]);

  const segmentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of customers) map[(c as any).rfmScore] = (map[(c as any).rfmScore] ?? 0) + 1;
    return (key: string) => map[key] ?? 0;
  }, [customers]);

  // Sync note input when selected customer changes
  useEffect(() => {
    setEditingNote(selected ? (customerNotes[selected] ?? "") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">CRM Clients</h1>
          <p className="text-xs text-muted-foreground">{stats.total} clients • Segmentation RFM automatique</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCampaign(true)} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
            <Megaphone className="w-3.5 h-3.5 text-primary" /> Campagne email
          </button>
          <button
            onClick={exportCSV}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
            aria-label="Exporter les clients en CSV"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            {exporting ? "Export..." : "Exporter CSV"}
          </button>
          <button onClick={() => toast.success("Import CSV disponible prochainement")} className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all">
            <Plus className="w-3.5 h-3.5" /> Importer
          </button>
        </div>
      </div>

      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total clients", value: stats.total, icon: Users, color: "text-primary" },
              { label: "CA moyen/client", value: formatCurrency(stats.avgSpent), icon: TrendingUp, color: "text-emerald-400" },
              { label: "Points émis", value: stats.totalPoints.toLocaleString("fr-FR"), icon: Award, color: "text-yellow-400" },
              { label: "À risque", value: stats.atRiskCount, icon: AlertTriangle, color: "text-red-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-gradient-card p-4">
                <stat.icon className={`w-4 h-4 mb-2 ${stat.color}`} />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input onChange={(e) => handleSearchChange(e.target.value)} placeholder="Rechercher un client..." className="w-full rounded-xl bg-secondary border border-border pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1 flex-wrap">
              {[["all", "Tous"], ["champion", "Champions"], ["loyal", "Fidèles"], ["promising", "Prometteurs"], ["at_risk", "À risque"], ["lost", "Perdus"]].map(([key, label]) => (
                <button key={key} onClick={() => setSegment(key)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${segment === key ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                  {key !== "all" && <span className="ml-1 opacity-50">({segmentCounts(key)})</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium text-right">
                    <button onClick={() => toggleSort("totalVisits")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Visites {sortKey === "totalVisits" ? (sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    <button onClick={() => toggleSort("totalSpent")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      CA total {sortKey === "totalSpent" ? (sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Segment</th>
                  <th className="px-4 py-3 font-medium text-right">
                    <button onClick={() => toggleSort("loyaltyPoints")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Points {sortKey === "loyaltyPoints" ? (sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                    </button>
                  </th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => {
                  const rfm = c.rfmScore as keyof typeof RFM_CONFIG;
                  const rfmConfig = RFM_CONFIG[rfm] ?? RFM_CONFIG.promising;
                  return (
                    <tr key={c.id} onClick={() => setSelected(c.id)} className={`border-b border-border/50 last:border-0 cursor-pointer hover:bg-secondary/20 transition-colors ${selected === c.id ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                            {(c.name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{c.name ?? "Anonyme"}</p>
                            <p className="text-xs text-muted-foreground">{c.email ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">{c.totalVisits}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">{formatCurrency(c.totalSpent)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium ${rfmConfig.color}`}>
                          <rfmConfig.icon className="w-2.5 h-2.5" />
                          {rfmConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-primary font-semibold tabular-nums">{c.loyaltyPoints}</td>
                      <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          {selectedCustomer ? (
            <div className="rounded-2xl border border-border bg-gradient-card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center text-base font-bold text-primary-foreground">
                  {(selectedCustomer.name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedCustomer.name ?? "Anonyme"}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${(RFM_CONFIG[selectedCustomer.rfmScore as keyof typeof RFM_CONFIG] ?? RFM_CONFIG.promising).color}`}>
                    {(RFM_CONFIG[selectedCustomer.rfmScore as keyof typeof RFM_CONFIG] ?? RFM_CONFIG.promising).label}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { icon: Mail, value: selectedCustomer.email ?? "Non renseigné" },
                  { icon: Phone, value: selectedCustomer.phone ?? "Non renseigné" },
                ].map((info, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <info.icon className="w-3.5 h-3.5 shrink-0 text-primary" />
                    {info.value}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Visites", value: selectedCustomer.totalVisits },
                  { label: "CA total", value: formatCurrency(selectedCustomer.totalSpent) },
                  { label: "Points fidélité", value: selectedCustomer.loyaltyPoints },
                  { label: "Dernière visite", value: selectedCustomer.lastVisit },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
              {selectedCustomer.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedCustomer.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
                  ))}
                </div>
              )}
              <div className="space-y-2 mb-4">
                <button onClick={() => toast.success("Email envoyé !")} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground hover:scale-[1.01] transition-all">
                  <Mail className="w-3.5 h-3.5" /> Envoyer une offre
                </button>
                <button onClick={() => toast.success("Points ajoutés !")} className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
                  <Award className="w-3.5 h-3.5 text-primary" /> Offrir des points
                </button>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Notes internes</p>
                <textarea
                  value={editingNote}
                  onChange={(e) => setEditingNote(e.target.value)}
                  placeholder="Préférences, allergies, remarques..."
                  rows={3}
                  className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
                <button
                  onClick={() => selectedCustomer && saveNote(selectedCustomer.id, editingNote)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-secondary/60 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  Sauvegarder la note
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-gradient-card p-8 text-center">
              <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Sélectionnez un client pour voir son profil</p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Modal */}
      {showCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Nouvelle campagne email</span>
              </div>
              <button onClick={() => setShowCampaign(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Templates */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Templates rapides</p>
                <div className="grid grid-cols-3 gap-2">
                  {([["promo", "Promo", "🎉"], ["reactivation", "Réactivation", "💌"], ["newsletter", "Newsletter", "📰"]] as const).map(([type, label, emoji]) => (
                    <button
                      key={type}
                      onClick={() => applyTemplate(type)}
                      className={`rounded-xl border py-2.5 text-xs font-medium transition-all ${campaignType === type ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}
                    >
                      <span className="block text-base mb-0.5">{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Segment cible */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Segment cible</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all", "Tous les clients"], ["champion", "Champions"], ["loyal", "Fidèles"], ["at_risk", "À risque"], ["lost", "Perdus"]].map(([key, label]) => {
                    const count = key === "all" ? customers.length : segmentCounts(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setCampaignSegment(key)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${campaignSegment === key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        {label} <span className="opacity-60">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Objet */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Objet de l'email</label>
                <input
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="Objet de l'email..."
                  className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Message <span className="text-muted-foreground/50 font-normal">({"{prénom}"} et {"{restaurant}"} seront remplacés)</span>
                </label>
                <textarea
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Corps du message..."
                  rows={6}
                  className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowCampaign(false)} className="flex-1 rounded-xl border border-border py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                Annuler
              </button>
              <button
                onClick={sendCampaign}
                disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {sending ? (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {sending ? "Envoi..." : `Envoyer à ${campaignSegment === "all" ? customers.length : segmentCounts(campaignSegment)} client(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
