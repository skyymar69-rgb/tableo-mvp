"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      toast.success("Email envoyé si le compte existe");
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">T</span>
        </div>
        <span className="text-xl font-bold text-foreground">Tableo</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-lg font-bold text-foreground mb-2">Email envoyé</h1>
            <p className="text-sm text-muted-foreground mb-6">Si un compte existe pour <span className="text-foreground font-medium">{email}</span>, vous recevrez un lien de réinitialisation dans quelques minutes.</p>
            <Link href="/login" className="text-xs text-primary hover:underline">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">Mot de passe oublié ?</h1>
            <p className="text-sm text-muted-foreground mb-6">Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  required
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>
            <div className="mt-5 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
