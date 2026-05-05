"use client";
import Link from "next/link";
import { Home, ArrowLeft, Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-2xl animate-pulse-slow" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-warm flex items-center justify-center shadow-warm">
          <Utensils className="w-12 h-12 text-primary-foreground" />
        </div>
      </div>

      <p className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase">Erreur 404</p>
      <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
        Table introuvable
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-10">
        Cette page n&apos;existe pas ou a été déplacée. Revenez au tableau de bord pour continuer.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-warm px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all"
        >
          <Home className="w-4 h-4" />
          Tableau de bord
        </Link>
        {/* #47 — router.back() safe (pas de javascript: href) */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-all focus-ring"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Retour
        </button>
      </div>
    </div>
  );
}
