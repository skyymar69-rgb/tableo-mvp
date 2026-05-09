"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, QrCode } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const mobileMenuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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

  return (
    <nav
      aria-label="Navigation principale"
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_#e5e7eb]" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6 max-w-[1200px]">
        {/* Logo */}
        <Link href="/" aria-label="Tabléo — Accueil" className="flex items-center focus-ring rounded-lg group">
          <span className="text-[22px] font-bold tracking-tight text-[#111111] font-display group-hover:opacity-70 transition-opacity">
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
                  className="text-[14px] font-medium text-[#374151] hover:text-[#111111] focus-ring rounded transition-colors duration-150"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/contact-card"
            className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] hover:text-[#111111] hover:border-[#111111]/20 focus-ring transition-all"
            aria-label="Carte de contact numérique et QR code"
            title="Carte de contact"
          >
            <QrCode className="w-4 h-4" aria-hidden="true" />
          </Link>

          <Link
            href="/login"
            className="text-[14px] font-medium text-[#374151] hover:text-[#111111] focus-ring rounded-lg px-3 py-1.5 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#111111] hover:bg-[#242424] px-5 py-2 text-[14px] font-semibold text-white transition-colors focus-ring"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="text-[#111111] focus-ring rounded-lg p-1"
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
        <div className="border-t border-[#e5e7eb] bg-white px-6 py-4 space-y-1">
          {isLanding && links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-[14px] text-[#374151] hover:text-[#111111] focus-ring rounded py-2 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/contact-card"
            className="block text-[14px] text-[#374151] hover:text-[#111111] focus-ring rounded py-2 transition-colors"
            onClick={() => setOpen(false)}
          >
            Carte de contact
          </Link>
          <Link
            href="/login"
            className="block text-[14px] text-[#374151] hover:text-[#111111] focus-ring rounded py-2 transition-colors"
            onClick={() => setOpen(false)}
          >
            Connexion
          </Link>
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="block rounded-[8px] bg-[#111111] hover:bg-[#242424] px-5 py-2.5 text-[14px] font-semibold text-white text-center focus-ring transition-colors"
              onClick={() => setOpen(false)}
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
