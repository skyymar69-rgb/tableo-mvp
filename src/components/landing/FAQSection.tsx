"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";

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

function AccordionItem({
  faq, index, isOpen, onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const headerId = `faq-header-${index}`;
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = "1";
    } else {
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
    }
  }, [isOpen]);

  return (
    <div
      role="listitem"
      className="rounded-[12px] border border-[#e5e7eb] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <h3>
        <button
          id={headerId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#f5f5f5] transition-colors focus-ring rounded-[12px]"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="text-[14px] font-semibold text-[#111111]">{faq.q}</span>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150 ${
            isOpen ? "bg-[#111111]" : "bg-[#f5f5f5]"
          }`}>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-[#6b7280]"}`}
              aria-hidden="true"
            />
          </div>
        </button>
      </h3>
      <div
        ref={bodyRef}
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        style={{
          maxHeight: "0px",
          opacity: "0",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
        }}
      >
        <p className="px-6 pb-5 text-[14px] text-[#374151] leading-relaxed border-t border-[#e5e7eb] pt-4">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#f5f5f5]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-semibold text-[#6b7280] mb-3 tracking-widest uppercase">FAQ</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] text-[#111111]">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-[#374151] text-[14px]">
            Tout ce que vous devez savoir avant de démarrer.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-2" role="list">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[13px] text-[#6b7280] mb-3">Vous ne trouvez pas la réponse à votre question ?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white px-5 py-2.5 text-[14px] font-medium text-[#111111] hover:border-[#111111]/20 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all focus-ring group"
          >
            <MessageCircle className="w-4 h-4 text-[#6b7280] group-hover:text-[#111111] transition-colors" />
            Contacter l&apos;équipe
          </Link>
        </div>
      </div>
    </section>
  );
}
