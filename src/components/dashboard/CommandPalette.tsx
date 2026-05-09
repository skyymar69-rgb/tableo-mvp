"use client";

import { useState, useEffect, useCallback, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BarChart3, UtensilsCrossed, QrCode, TableIcon,
  Users, ShoppingBag, Settings, Search, ArrowRight, Zap, Users2, ChefHat,
} from "lucide-react";

const COMMANDS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Navigation" },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed, group: "Navigation" },
  { label: "QR Codes", href: "/qr", icon: QrCode, group: "Navigation" },
  { label: "Tables", href: "/tables", icon: TableIcon, group: "Navigation" },
  { label: "Commandes", href: "/orders", icon: ShoppingBag, group: "Navigation" },
  { label: "Mode Cuisine", href: "/kitchen", icon: ChefHat, group: "Navigation" },
  { label: "CRM Clients", href: "/crm", icon: Users, group: "Navigation" },
  { label: "Équipe", href: "/staff", icon: Users2, group: "Navigation" },
  { label: "Paramètres", href: "/settings", icon: Settings, group: "Navigation" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const inputId = useId();

  const filtered = query.trim()
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const handleSelect = useCallback((href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, [router]);

  /* Reset active index on query change */
  useEffect(() => { setActiveIndex(0); }, [query]);

  /* Keyboard shortcuts pour ouvrir */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  /* Keyboard navigation in list */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex].href);
    }
  };

  /* Scroll active item into view */
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector(`[data-active="true"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* Focus trap */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
      /* Ne pas annoncer le backdrop comme contenu interactif */
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-card animate-fade-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Titre visually-hidden pour les lecteurs d'écran */}
        <h2 id={titleId} className="sr-only">Palette de commandes</h2>

        {/* Champ de recherche */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <label htmlFor={inputId} className="sr-only">Rechercher une page ou une action</label>
          <input
            id={inputId}
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une page…"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="cmd-listbox"
            aria-activedescendant={filtered[activeIndex] ? `cmd-item-${activeIndex}` : undefined}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 hidden sm:block" aria-label="Touche Échap pour fermer">ESC</kbd>
        </div>

        {/* Résultats */}
        <div
          id="cmd-listbox"
          role="listbox"
          aria-label="Résultats de recherche"
          ref={listRef}
          className="max-h-72 overflow-y-auto py-2"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground" role="status">
              Aucun résultat pour « {query} »
            </p>
          ) : (
            filtered.map((cmd, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={cmd.href}
                  id={`cmd-item-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  onClick={() => handleSelect(cmd.href)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-left group ${isActive ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${isActive ? "bg-gradient-warm" : "bg-secondary"}`} aria-hidden="true">
                    <cmd.icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{cmd.label}</span>
                  <ArrowRight className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5 flex items-center gap-4 text-[10px] text-muted-foreground" aria-hidden="true">
          <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5">↑↓</kbd> Naviguer</span>
          <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5">↵</kbd> Ouvrir</span>
          <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5">ESC</kbd> Fermer</span>
          <span className="flex items-center gap-1 ml-auto"><Zap className="w-3 h-3 text-primary" aria-hidden="true" /> <kbd className="border border-border rounded px-1 py-0.5">⌘K</kbd></span>
        </div>
      </div>
    </div>
  );
}
