"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { theme, setTheme } = useTheme();
  const mobileMenuId = useId();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Fermer le menu mobile à l'appui sur Echap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Revenue Engine", href: "#revenue" },
    { label: "Tarifs", href: "#pricing" },
  ];

  const isDark = theme === "dark";

  return (
    <nav
      aria-label="Navigation principale"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass border-b border-border/40 shadow-card" : "bg-transparent border-b border-transparent"}`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/" aria-label="Tabléo — Accueil" className="flex items-center focus-ring rounded-lg group">
          <span className="text-2xl font-bold tracking-tight text-gradient-warm group-hover:opacity-90 transition-opacity">
            Tabléo
          </span>
        </Link>

        {/* Desktop nav links */}
        {isLanding && (
          <ul className="hidden md:flex items-center gap-8" role="list">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative text-sm text-muted-foreground hover:text-foreground focus-ring rounded transition-colors duration-200 group py-1"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground focus-ring transition-colors"
            aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
            aria-pressed={isDark}
          >
            {isDark
              ? <Sun className="w-4 h-4" aria-hidden="true" />
              : <Moon className="w-4 h-4" aria-hidden="true" />
            }
          </button>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground focus-ring rounded-lg px-3 py-1.5 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-warm px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] focus-ring"
          >
            Commencer gratuitement
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-foreground focus-ring rounded-lg p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls={mobileMenuId}
        >
          {open
            ? <X className="w-5 h-5" aria-hidden="true" />
            : <Menu className="w-5 h-5" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Scroll progress bar — décoratif */}
      {isLanding && scrolled && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-warm transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Mobile menu */}
      <div
        id={mobileMenuId}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="border-t border-border/40 glass px-6 py-4 space-y-3">
          {isLanding && links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="block text-sm text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
            onClick={() => setOpen(false)}
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="block rounded-lg bg-gradient-warm px-4 py-2.5 text-sm font-semibold text-primary-foreground text-center focus-ring"
            onClick={() => setOpen(false)}
          >
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </nav>
  );
}
