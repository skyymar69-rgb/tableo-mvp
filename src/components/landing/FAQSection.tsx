"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Dois-je avoir une expertise technique pour utiliser Tableo ?",
    a: "Non. Tableo est conçu pour les restaurateurs, pas les développeurs. La mise en ligne prend moins de 5 minutes : vous scannez votre menu existant, notre IA le structure automatiquement, et votre QR code est prêt.",
  },
  {
    q: "Comment fonctionne l'import de menu par IA ?",
    a: "Photographiez ou scannez votre menu papier, ou collez le texte de votre carte. Claude analyse le contenu et génère automatiquement votre menu digital avec catégories, descriptions, prix et allergènes.",
  },
  {
    q: "Puis-je utiliser Tableo sans intégration caisse ?",
    a: "Oui. Tableo fonctionne de manière indépendante. Vos clients commandent via QR code, vous recevez les commandes en temps réel sur le tableau de bord. L'intégration caisse est optionnelle.",
  },
  {
    q: "Comment sont protégées les données de mes clients ?",
    a: "Tableo est 100% conforme RGPD. Les données sont hébergées en Europe, chiffrées au repos et en transit. Vous restez propriétaire de vos données et pouvez les exporter ou supprimer à tout moment.",
  },
  {
    q: "Y a-t-il des frais sur les transactions ?",
    a: "Non. Tableo ne prend aucune commission sur vos ventes. Seuls les frais Stripe standard s'appliquent si vous activez le paiement en ligne (environ 1,5% + 0,25€ par transaction).",
  },
  {
    q: "Puis-je gérer plusieurs restaurants ?",
    a: "Oui, dès le plan Growth. Chaque établissement a son propre dashboard, ses menus, et ses analytics. Le plan Enterprise offre des établissements illimités avec dashboard centralisé.",
  },
  {
    q: "Que se passe-t-il à la fin de l'essai gratuit ?",
    a: "Vous conservez l'accès au plan Starter gratuitement. Si vous souhaitez continuer avec les fonctionnalités avancées, vous pouvez passer au plan Growth. Aucune carte bancaire requise pour l'essai.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Questions fréquentes
          </h2>
        </div>
        {/* #50 — accordion WCAG 2.1 : aria-controls + id panel + aria-expanded */}
        <div className="max-w-2xl mx-auto space-y-2" role="list">
          {FAQS.map((faq, i) => {
            const panelId = `faq-panel-${i}`;
            const headerId = `faq-header-${i}`;
            const isOpen = open === i;
            return (
              <div
                key={i}
                role="listitem"
                className="rounded-2xl border border-border bg-gradient-card overflow-hidden transition-all duration-200"
              >
                <h3>
                  <button
                    id={headerId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-secondary/30 transition-colors focus-ring rounded-2xl"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={!isOpen}
                  className={`px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4 ${isOpen ? "" : "hidden"}`}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
