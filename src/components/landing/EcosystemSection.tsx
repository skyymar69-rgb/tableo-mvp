import { Illustration } from "./Illustration";

/**
 * EcosystemSection — montre l'écosystème complet Tabléo en 4 visuels :
 * QR croissance · Paiement intégré · Intégrations · Support IA
 * Source : illustrations dérivées de la présentation stratégique Tabléo
 */

const items = [
  {
    slug: "qr-croissance",
    title: "Du QR à la croissance",
    desc: "Chaque table devient un point de conversion. Scan, commande, paiement, fidélité — sur un seul code.",
    alt:
      "Illustration QR code Tabléo posé sur une table de restaurant, flèche de croissance verte symbolisant l'augmentation des revenus générés par chaque table digitalisée",
  },
  {
    slug: "paiement-integre",
    title: "Paiement intégré sans friction",
    desc: "Apple Pay, Google Pay, sans contact, partage d'addition, pourboires. Encaissement instantané.",
    alt:
      "Illustration tablette restaurant avec terminal de paiement sans contact Visa et Mastercard — solution d'encaissement Tabléo intégrée pour restaurants français",
  },
  {
    slug: "integrations",
    title: "Connecté à votre stack",
    desc: "UberEats, Deliveroo, Quickbooks, programmes de fidélité, comptabilité. L'écosystème Tabléo s'aligne avec vos outils.",
    alt:
      "Illustration écran d'ordinateur affichant les intégrations Tabléo : UberEats, Deliveroo, Quickbooks et programmes de fidélité connectés au hub central restaurant",
  },
  {
    slug: "support-ai",
    title: "Support IA 24/7",
    desc: "Onboarding guidé, base de connaissances, AI Guide intégré dans le dashboard. Vos équipes ne sont jamais bloquées.",
    alt:
      "Illustration laptop affichant le support Tabléo et son AI Guide intégré — assistant intelligent pour aider les équipes restaurant à configurer la plateforme",
  },
] as const;

const EcosystemSection = () => (
  <section id="ecosysteme" className="py-24 md:py-32 bg-[#f5f5f5]">
    <div className="container mx-auto px-6 max-w-[1200px]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-[11px] font-semibold text-[#6b7280] mb-3 tracking-widest uppercase">
          L&apos;écosystème Tabléo
        </p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] leading-tight text-[#111111]">
          Une plateforme.{" "}
          <span className="text-[#6b7280]">Tous les outils dont votre restaurant a besoin.</span>
        </h2>
        <p className="mt-4 text-[15px] text-[#374151] leading-relaxed">
          QR, paiement, intégrations, support — chaque brique se branche sans friction sur votre activité.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((it) => (
          <article
            key={it.slug}
            className="group rounded-[16px] bg-white border border-[#e5e7eb] overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          >
            <figure className="aspect-square bg-[#f5f5f5] overflow-hidden">
              <Illustration
                slug={it.slug}
                alt={it.alt}
                sizes="(max-width: 768px) 100vw, 568px"
                className="transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </figure>
            <div className="p-6">
              <h3 className="text-[16px] font-semibold text-[#111111] mb-2">{it.title}</h3>
              <p className="text-[13px] text-[#374151] leading-relaxed">{it.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default EcosystemSection;
