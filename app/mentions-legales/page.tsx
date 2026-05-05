import { LegalLayout, LegalSection, LegalSubSection, LegalList } from "@/components/legal/LegalLayout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — Tableo",
  description: "Mentions légales de Tableo, service édité par KAYZEN LYON (SASU). Informations sur l'éditeur, l'hébergeur et les droits applicables.",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" lastUpdated="2026-04-19">

      {/* 1. Éditeur */}
      <LegalSection id="editeur" title="1. Éditeur du service">
        <p>
          Le site <strong className="text-foreground">tableo.fr</strong> et le service en ligne <strong className="text-foreground">Tableo</strong> sont édités par la société <strong className="text-foreground">KAYZEN LYON</strong>.
        </p>
        <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-2 text-sm">
          <p><span className="font-semibold text-foreground">Raison sociale :</span> KAYZEN LYON</p>
          <p><span className="font-semibold text-foreground">Forme juridique :</span> Société par Actions Simplifiée Unipersonnelle (SASU)</p>
          <p><span className="font-semibold text-foreground">Capital social :</span> 1 000 €</p>
          <p><span className="font-semibold text-foreground">SIREN :</span> 999 418 346</p>
          <p><span className="font-semibold text-foreground">SIRET :</span> 999 418 346 000 14</p>
          <p><span className="font-semibold text-foreground">RCS :</span> Lyon B 999 418 346</p>
          <p><span className="font-semibold text-foreground">N° TVA intracommunautaire :</span> FR85 999 418 346</p>
          <p><span className="font-semibold text-foreground">Code APE :</span> 4791B — Vente à distance sur catalogue spécialisé</p>
          <p><span className="font-semibold text-foreground">Siège social :</span> 6, rue Pierre TERMIER — 69009 LYON (France)</p>
          <p>
            <span className="font-semibold text-foreground">Téléphone :</span>{" "}
            <a href="tel:+33487776861" className="hover:text-foreground focus-ring rounded transition-colors">+33 (0)4 87 77 68 61</a>
          </p>
          <p>
            <span className="font-semibold text-foreground">Email :</span>{" "}
            <a href="mailto:contact@kayzen-lyon.fr" className="hover:text-foreground focus-ring rounded transition-colors">contact@kayzen-lyon.fr</a>
          </p>
          <p>
            <span className="font-semibold text-foreground">Site de l'agence :</span>{" "}
            <a href="https://internet.kayzen-lyon.fr" target="_blank" rel="noopener noreferrer" className="hover:text-foreground focus-ring rounded transition-colors">internet.kayzen-lyon.fr</a>
          </p>
        </div>
      </LegalSection>

      {/* 2. Directeur de publication */}
      <LegalSection id="directeur" title="2. Directeur de la publication">
        <p>
          Le directeur de la publication est le Président de la société KAYZEN LYON, responsable légal au sens de l'article 6-I-2° de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
        </p>
        <p>
          Pour toute réclamation éditoriale :{" "}
          <a href="mailto:contact@kayzen-lyon.fr" className="hover:text-foreground focus-ring rounded transition-colors">contact@kayzen-lyon.fr</a>
        </p>
      </LegalSection>

      {/* 3. Hébergeur */}
      <LegalSection id="hebergeur" title="3. Hébergement">
        <p>
          Le service Tableo est hébergé par la société <strong className="text-foreground">Vercel Inc.</strong>, dont le siège social est situé :
        </p>
        <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-1.5 text-sm">
          <p><span className="font-semibold text-foreground">Raison sociale :</span> Vercel Inc.</p>
          <p><span className="font-semibold text-foreground">Adresse :</span> 340 Pine Street, Suite 701 — San Francisco, CA 94104 (États-Unis)</p>
          <p>
            <span className="font-semibold text-foreground">Site :</span>{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground focus-ring rounded transition-colors">vercel.com</a>
          </p>
        </div>
        <p>
          Les données personnelles des utilisateurs résidant dans l'Union européenne sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et au Standard Contractual Clauses (SCC) conclus avec Vercel. Pour plus d'informations, consultez notre{" "}
          <Link href="/politique-confidentialite" className="text-primary hover:underline focus-ring rounded">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      {/* 4. Propriété intellectuelle */}
      <LegalSection id="propriete" title="4. Propriété intellectuelle">
        <p>
          L'ensemble des éléments constituant le service Tableo — notamment la structure du site, les textes, les graphiques, les logos, les icônes, les images, les données, les logiciels, les algorithmes et les bases de données — est la propriété exclusive de KAYZEN LYON ou fait l'objet de licences d'utilisation obtenues auprès de leurs titulaires respectifs.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable de KAYZEN LYON, sous peine des sanctions prévues aux articles L. 335-2 et suivants du Code de la propriété intellectuelle.
        </p>
        <p>
          Les marques, dénominations sociales et signes distinctifs reproduits sur le site sont protégés au titre des droits de propriété intellectuelle. Toute utilisation sans autorisation expresse expose leur auteur à des poursuites.
        </p>
      </LegalSection>

      {/* 5. Données personnelles */}
      <LegalSection id="donnees" title="5. Données personnelles et cookies">
        <p>
          KAYZEN LYON traite des données personnelles dans le cadre de l'utilisation du service Tableo, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée (loi Informatique et Libertés).
        </p>
        <p>
          Pour plus d'informations sur le traitement de vos données, vos droits et les modalités d'exercice de ceux-ci, consultez :
        </p>
        <ul className="list-none space-y-1.5 pl-4">
          <li>→ <Link href="/politique-confidentialite" className="text-primary hover:underline focus-ring rounded">Politique de confidentialité</Link></li>
          <li>→ <Link href="/politique-cookies" className="text-primary hover:underline focus-ring rounded">Politique de cookies</Link></li>
        </ul>
      </LegalSection>

      {/* 6. Responsabilité */}
      <LegalSection id="responsabilite" title="6. Limitation de responsabilité">
        <p>
          KAYZEN LYON s'efforce de maintenir le service Tableo accessible et à jour. Toutefois, la responsabilité de KAYZEN LYON ne pourra être engagée en cas de :
        </p>
        <LegalList items={[
          "Indisponibilité temporaire du service pour des raisons de maintenance, de mise à jour ou de force majeure ;",
          "Erreurs ou omissions dans les contenus publiés, malgré les précautions prises ;",
          "Dommages directs ou indirects résultant de l'accès ou de l'utilisation du service ;",
          "Contamination par des virus ou tout autre programme informatique malveillant ;",
          "Utilisation frauduleuse des accès par un tiers.",
        ]} />
        <p>
          Les liens hypertextes présents sur le site peuvent renvoyer vers des sites tiers. KAYZEN LYON ne contrôle pas ces sites et décline toute responsabilité quant à leur contenu.
        </p>
      </LegalSection>

      {/* 7. Droit applicable */}
      <LegalSection id="droit" title="7. Droit applicable et juridiction compétente">
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux du ressort de la Cour d'appel de LYON seront seuls compétents.
        </p>
        <p>
          Conformément à l'article L. 612-1 du Code de la consommation, tout consommateur dispose du droit de recourir gratuitement à un médiateur de la consommation. KAYZEN LYON adhère au service de médiation <strong className="text-foreground">MEDICYS</strong> (
          <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">www.medicys.fr</a>
          ).
        </p>
      </LegalSection>

      {/* 8. Accessibilité */}
      <LegalSection id="accessibilite" title="8. Accessibilité numérique">
        <p>
          KAYZEN LYON s'engage à rendre le service Tableo accessible conformément aux exigences de la <strong className="text-foreground">directive (UE) 2016/2102</strong>, du <strong className="text-foreground">European Accessibility Act (directive 2019/882)</strong>, au <strong className="text-foreground">RGAA 4.1</strong> (Référentiel Général d'Amélioration de l'Accessibilité) et aux <strong className="text-foreground">WCAG 2.2</strong> (Web Content Accessibility Guidelines), niveau AA.
        </p>
        <p>
          Pour signaler un défaut d'accessibilité ou obtenir une assistance, contactez-nous à{" "}
          <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a>.
        </p>
      </LegalSection>

      {/* Contact */}
      <div className="rounded-xl border border-primary/20 bg-gradient-warm-subtle p-5">
        <p className="text-sm font-semibold text-foreground mb-1">Une question juridique ?</p>
        <p className="text-xs text-muted-foreground">
          Contactez-nous à <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a> ou via notre{" "}
          <Link href="/contact" className="text-primary hover:underline focus-ring rounded">formulaire de contact</Link>.
        </p>
      </div>
    </LegalLayout>
  );
}
