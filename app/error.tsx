"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2">Une erreur est survenue</h1>
      <p className="text-sm text-muted-foreground mb-2 max-w-sm">
        {error.message || "Quelque chose s'est mal passé. Notre équipe a été notifiée."}
      </p>
      {error.digest && <p className="text-[10px] text-muted-foreground/50 mb-8 font-mono">Ref: {error.digest}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-gradient-warm px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Réessayer
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
        >
          <Home className="w-4 h-4" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
