"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, QrCode } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const mobileMenuId = useId();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#000] dark:bg-[#000] ${
        scrolled ? "border-b border-white/8" : "border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-[60px] px-6">
        {/* Logo */}
        <Link href="/" aria-label="Tabléo — Accueil" className="flex items-center focus-ring rounded-lg group">
          <span className="text-[22px] font-bold tracking-tight text-white group-hover:opacity-80 transition-opacity">
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
                  className="text-[13px] font-medium text-[#a8a8b3] hover:text-white focus-ring rounded transition-colors duration-150"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Carte de contact numérique */}
          <Link
            href="/contact-card"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#a8a8b3] hover:text-white hover:border-white/20 focus-ring transition-all"
            aria-label="Carte de contact numérique et QR code"
            title="Carte de contact"
          >
            <QrCode className="w-4 h-4" aria-hidden="true" />
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#a8a8b3] hover:text-white hover:border-white/20 focus-ring transition-all"
              aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              aria-pressed={isDark}
            >
              {isDark
                ? <Sun className="w-4 h-4" aria-hidden="true" />
                : <Moon className="w-4 h-4" aria-hidden="true" />
              }
            </button>
          )}

          <Link
            href="/login"
            className="text-[13px] font-medium text-[#a8a8b3] hover:text-white focus-ring rounded-lg px-3 py-1.5 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0070d1] hover:bg-[#0082f0] px-5 py-2 text-[13px] font-semibold text-white transition-colors focus-ring"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#a8a8b3] hover:text-white focus-ring transition-colors"
              aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              aria-pressed={isDark}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" aria-hidden="true" /> : <Moon className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>
          )}
          <button
            className="text-white focus-ring rounded-lg p-1"
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
      </div>

      {/* Mobile menu */}
      <div
        id={mobileMenuId}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="border-t border-white/8 bg-[#0a0a0a] px-6 py-4 space-y-3">
          {isLanding && links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-[13px] text-[#a8a8b3] hover:text-white focus-ring rounded transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/contact-card"
            className="block text-[13px] text-[#a8a8b3] hover:text-white focus-ring rounded transition-colors"
            onClick={() => setOpen(false)}
          >
            Carte de contact
          </Link>
          <Link
            href="/login"
            className="block text-[13px] text-[#a8a8b3] hover:text-white focus-ring rounded transition-colors"
            onClick={() => setOpen(false)}
          >
            Connexion
          </Link>
          <Link
            href="/onboarding"
            className="block rounded-full bg-[#0070d1] hover:bg-[#0082f0] px-5 py-2.5 text-[13px] font-semibold text-white text-center focus-ring transition-colors"
            onClick={() => setOpen(false)}
          >
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </nav>
  );
}
