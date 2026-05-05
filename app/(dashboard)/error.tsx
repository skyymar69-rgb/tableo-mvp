"use client";

/**
 * #48 — Error boundary scoped au dashboard layout
 * Catches les erreurs dans les pages dashboard sans crasher la sidebar/nav
 */
import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5">
        <AlertTriangle className="w-7 h-7 text-destructive" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-bold text-foreground mb-1.5">
        Cette page a rencontré une erreur
      </h2>
      <p className="text-sm text-muted-foreground mb-1.5 max-w-sm">
        {error.message || "Quelque chose s'est mal passé. Réessayez ou revenez au tableau de bord."}
      </p>
      {error.digest && (
        <p className="text-[10px] text-muted-foreground/40 mb-6 font-mono" aria-label={`Code d'erreur : ${error.digest}`}>
          Ref: {error.digest}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-gradient-warm px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all focus-ring"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Réessayer
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors focus-ring"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
