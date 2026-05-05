"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Mail, Shield, Clock, Check, X, Trash2, Crown, ChefHat, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useRestaurant } from "@/lib/hooks/useRestaurant";

const ROLE_CONFIG = {
  OWNER: { label: "Propriétaire", icon: Crown, color: "text-yellow-400 bg-yellow-400/10" },
  MANAGER: { label: "Manager", icon: UserCog, color: "text-blue-400 bg-blue-400/10" },
  STAFF: { label: "Équipe", icon: ChefHat, color: "text-primary bg-primary/10" },
};

const DEMO_STAFF = [
  { id: "1", name: "Vous-même", email: "owner@restaurant.fr", role: "OWNER", accepted: true, createdAt: "2026-01-01" },
  { id: "2", name: "Sophie Martin", email: "sophie@restaurant.fr", role: "MANAGER", accepted: true, createdAt: "2026-02-15" },
  { id: "3", name: "Lucas Bernard", email: "lucas@restaurant.fr", role: "STAFF", accepted: true, createdAt: "2026-03-10" },
  { id: "4", name: "Invitation en attente", email: "nouveau@example.fr", role: "STAFF", accepted: false, createdAt: "2026-04-18" },
];

export default function StaffPage() {
  const { data: restaurant } = useRestaurant();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("STAFF");
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Email invalide");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(`Invitation envoyée à ${inviteEmail}`);
    setInviteEmail("");
    setShowInvite(false);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Équipe</h1>
          <p className="text-xs text-muted-foreground">{DEMO_STAFF.length} membres · {restaurant?.name ?? "Votre restaurant"}</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Inviter
        </button>
      </div>

      <div className="p-6 max-w-2xl space-y-3">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Membres actifs", value: DEMO_STAFF.filter((s) => s.accepted).length, icon: Users, color: "text-primary" },
            { label: "Invitations", value: DEMO_STAFF.filter((s) => !s.accepted).length, icon: Clock, color: "text-yellow-400" },
            { label: "Rôles", value: 3, icon: Shield, color: "text-blue-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-gradient-card p-4">
              <stat.icon className={`w-4 h-4 mb-2 ${stat.color}`} />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {DEMO_STAFF.map((member) => {
          const roleCfg = ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG];
          return (
            <div key={member.id} className="rounded-2xl border border-border bg-gradient-card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                  {(member.name ?? "?").charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {member.name}
                    {!member.accepted && <span className="ml-2 text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">En attente</span>}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${roleCfg.color}`}>
                  <roleCfg.icon className="w-3 h-3" />
                  {roleCfg.label}
                </span>
                {member.role !== "OWNER" && (
                  <button
                    onClick={() => toast.success("Membre supprimé")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Supprimer le membre"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-border bg-card p-8 w-full max-w-md shadow-card animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Inviter un membre</h2>
              <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Adresse email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="collegue@restaurant.fr"
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rôle</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["MANAGER", "STAFF"] as const).map((role) => {
                    const cfg = ROLE_CONFIG[role];
                    return (
                      <button
                        key={role}
                        onClick={() => setInviteRole(role)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${inviteRole === role ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
                      >
                        <cfg.icon className="w-4 h-4" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={handleInvite}
                disabled={sending}
                className="w-full rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Envoi...</>
                ) : (
                  <><Mail className="w-4 h-4" /> Envoyer l&apos;invitation</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
