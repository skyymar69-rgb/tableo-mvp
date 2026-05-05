"use client";

import { useState, useEffect, useRef, useId } from "react";
import { Cookie, X, Check, ChevronRight, Settings, Shield } from "lucide-react";
import Link from "next/link";

/* ─── Types & constantes ─────────────────────────────────────────────────── */

type CookieConsent = {
  timestamp: string;
  version: string;
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "tableo-cookie-consent";
const CONSENT_VERSION = "1.1";

function loadConsent(): CookieConsent | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CONSENT_KEY) : null;
    if (!raw) return null;
    const parsed: CookieConsent = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, marketing: boolean): void {
  const consent: CookieConsent = {
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
    essential: true,
    analytics,
    marketing,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  /* Déclenche l'événement pour les scripts tiers qui écoutent */
  window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: consent }));
}

type BannerState = "hidden" | "banner" | "preferences";

/* ─── Composant Toggle ───────────────────────────────────────────────────── */

function Toggle({
  id, checked, onChange, disabled = false,
}: { id: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      id={id}
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus-ring shrink-0 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${checked ? "bg-gradient-warm" : "bg-border"}`}
    >
      <span
        className={`inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 absolute top-0.5 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{checked ? "Activé" : "Désactivé"}</span>
    </button>
  );
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export function CookieBanner() {
  const [state, setState] = useState<BannerState>("hidden");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const acceptBtnRef = useRef<HTMLButtonElement>(null);
  const prefPanelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  /* Chargement initial */
  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      const t = setTimeout(() => setState("banner"), 1500);
      return () => clearTimeout(t);
    }
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
  }, []);

  /* Focus management */
  useEffect(() => {
    if (state !== "hidden") {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const t = setTimeout(() => acceptBtnRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [state]);

  /* Touche Échap — uniquement si consentement déjà donné */
  useEffect(() => {
    if (state === "hidden") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && loadConsent()) setState("hidden");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state]);

  const acceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    saveConsent(true, true);
    setState("hidden");
  };

  const rejectAll = () => {
    setAnalytics(false);
    setMarketing(false);
    saveConsent(false, false);
    setState("hidden");
  };

  const savePreferences = () => {
    saveConsent(analytics, marketing);
    setState("hidden");
  };

  if (state === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[200] animate-fade-up"
    >
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">

        {/* ── Bannière principale ── */}
        {state === "banner" && (
          <div className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-warm-subtle flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p id={titleId} className="text-sm font-semibold text-foreground mb-1">
                  Cookies &amp; confidentialité
                </p>
                <p id={descId} className="text-xs text-muted-foreground leading-relaxed">
                  Tableo utilise des cookies essentiels (nécessaires au fonctionnement) et, avec votre consentement, des cookies analytiques et marketing. Conformément au RGPD et aux recommandations de la CNIL.
                </p>
              </div>
            </div>

            {/* Boutons principaux — Accepter / Refuser au même niveau (CNIL 2020) */}
            <div className="flex gap-2 mb-2">
              <button
                ref={acceptBtnRef}
                onClick={acceptAll}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground hover:scale-[1.01] focus-ring transition-all"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" /> Tout accepter
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 focus-ring transition-colors"
              >
                Tout refuser
              </button>
            </div>

            {/* Personnaliser */}
            <button
              onClick={() => setState("preferences")}
              aria-expanded={false}
              aria-controls="cookie-preferences-panel"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs text-muted-foreground hover:text-foreground focus-ring transition-colors"
            >
              <Settings className="w-3 h-3" aria-hidden="true" />
              Personnaliser mes choix
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <Shield className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
              <Link
                href="/politique-cookies"
                className="text-[10px] text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
              >
                Politique de cookies
              </Link>
              <span aria-hidden="true" className="text-muted-foreground/40">·</span>
              <Link
                href="/politique-confidentialite"
                className="text-[10px] text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        )}

        {/* ── Panneau de préférences ── */}
        {state === "preferences" && (
          <div id="cookie-preferences-panel" ref={prefPanelRef} aria-label="Personnalisation des cookies">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 id={titleId} className="text-sm font-semibold text-foreground">Préférences de cookies</h2>
              </div>
              {loadConsent() && (
                <button
                  onClick={() => setState("hidden")}
                  aria-label="Fermer le panneau de préférences"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary focus-ring transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="p-5 space-y-4 max-h-72 overflow-y-auto">

              {/* Cookies essentiels — toujours actifs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Cookies essentiels</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Nécessaires au fonctionnement du service (authentification, sécurité)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Toujours actifs</span>
                    <Toggle id="toggle-essential" checked={true} onChange={() => {}} disabled={true} />
                  </div>
                </div>
              </div>

              <hr className="border-border" aria-hidden="true" />

              {/* Cookies analytiques */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="toggle-analytics" className="text-sm font-medium text-foreground cursor-pointer">
                      Cookies analytiques
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Mesure d'audience, amélioration du service (Google Analytics)</p>
                  </div>
                  <Toggle id="toggle-analytics" checked={analytics} onChange={setAnalytics} />
                </div>
              </div>

              <hr className="border-border" aria-hidden="true" />

              {/* Cookies marketing */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="toggle-marketing" className="text-sm font-medium text-foreground cursor-pointer">
                      Cookies marketing
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Publicités personnalisées (Meta, LinkedIn Ads)</p>
                  </div>
                  <Toggle id="toggle-marketing" checked={marketing} onChange={setMarketing} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 pt-3 border-t border-border space-y-2">
              <div className="flex gap-2">
                <button
                  ref={acceptBtnRef}
                  onClick={savePreferences}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground hover:scale-[1.01] focus-ring transition-all"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" /> Enregistrer mes choix
                </button>
                <button
                  onClick={rejectAll}
                  className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 focus-ring transition-colors"
                >
                  Tout refuser
                </button>
              </div>
              <button
                onClick={acceptAll}
                className="w-full text-[10px] text-primary hover:underline focus-ring rounded transition-colors"
              >
                Tout accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Hook public pour lire le consentement côté client */
export function useCookieConsent(): CookieConsent | null {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  useEffect(() => {
    setConsent(loadConsent());
    const handler = (e: Event) => setConsent((e as CustomEvent<CookieConsent>).detail);
    window.addEventListener("cookieConsentUpdated", handler);
    return () => window.removeEventListener("cookieConsentUpdated", handler);
  }, []);
  return consent;
}
