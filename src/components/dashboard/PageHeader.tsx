/**
 * PageHeader — composant sticky réutilisable pour toutes les pages dashboard
 * Amélioration #6 : extrait de 4 fichiers qui le dupliquaient identiquement
 */
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Largeur optionnelle de la barre (défaut: 100%) */
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className = "" }: PageHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between ${className}`}
    >
      <div>
        <h1 className="text-base font-bold text-foreground leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
