import { LegalLayout, LegalSection, LegalSubSection, LegalList, LegalTable } from "@/components/legal/LegalLayout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation (CGU) — Tableo",
  description: "Conditions Générales d'Utilisation du service Tableo, édité par KAYZEN LYON. Régissant l'accès et l'utilisation de la plateforme SaaS de gestion de restaurant.",
  robots: { index: true, follow: true },
};

export default function CGUPage() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation" lastUpdated="2026-04-19">

      <p className="text-muted-foreground border-l-4 border-primary/40 pl-4 py-2 bg-secondary/20 rounded-r-xl">
        Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du service <strong className="text-foreground">Tableo</strong>, édité par la société <strong className="text-foreground">KAYZEN LYON</strong> (SASU, RCS Lyon 999 418 346), dont le siège social est situé 6, rue Pierre TERMIER — 69009 LYON. Tout accès au service vaut acceptation sans réserve des présentes CGU.
      </p>

      {/* Art. 1 */}
      <LegalSection id="art1" title="Article 1 — Définitions">
        <p>Au sens des présentes CGU, les termes suivants ont la signification suivante :</p>
        <LegalList items={[
          "« Éditeur » ou « KAYZEN LYON » : la société KAYZEN LYON, SASU au capital de 1 000 €, immatriculée au RCS de Lyon sous le numéro 999 418 346.",
          "« Service » ou « Tableo » : la plateforme SaaS accessible à l'adresse tableo.fr et toutes ses sous-pages, permettant la gestion digitale de restaurants (menu numérique, commandes, CRM, analytics, QR Codes, etc.).",
          "« Utilisateur » : toute personne physique ou morale accédant au Service, qu'elle soit titulaire d'un Compte ou simple visiteur.",
          "« Titulaire du Compte » ou « Abonné » : toute personne physique ou morale disposant d'un compte enregistré sur le Service.",
          "« Contenu » : tout texte, image, donnée ou information publié par l'Utilisateur sur le Service.",
          "« Abonnement » : formule d'accès au Service souscrite par l'Abonné selon les modalités décrites aux CGV.",
          "« Données Personnelles » : toute information relative à une personne physique identifiée ou identifiable, au sens du RGPD.",
        ]} />
      </LegalSection>

      {/* Art. 2 */}
      <LegalSection id="art2" title="Article 2 — Objet et champ d'application">
        <p>
          Les présentes CGU ont pour objet de définir les conditions dans lesquelles les Utilisateurs accèdent au Service et l'utilisent. Elles s'appliquent à tout accès et toute utilisation du Service, quels que soient le terminal ou les modalités d'accès employés.
        </p>
        <p>
          Les CGU sont accessibles à tout moment à l'adresse <Link href="/cgu" className="text-primary hover:underline focus-ring rounded">tableo.fr/cgu</Link>. L'Éditeur se réserve le droit de les modifier à tout moment, les nouvelles versions entrant en vigueur dès leur publication. Les Utilisateurs sont invités à les consulter régulièrement.
        </p>
        <p>
          Les présentes CGU complètent les Conditions Générales de Vente (CGV) applicables aux Abonnements payants, accessibles à l'adresse <Link href="/cgv" className="text-primary hover:underline focus-ring rounded">tableo.fr/cgv</Link>.
        </p>
      </LegalSection>

      {/* Art. 3 */}
      <LegalSection id="art3" title="Article 3 — Accès au Service">
        <LegalSubSection id="art3-1" title="3.1 Conditions d'accès">
          <p>L'accès au Service est réservé aux personnes physiques majeures capables de contracter et aux personnes morales représentées par une personne physique habilitée.</p>
          <p>L'Utilisateur doit disposer d'un équipement informatique compatible (ordinateur, tablette ou smartphone) et d'une connexion Internet. Les frais d'accès à Internet sont à la charge exclusive de l'Utilisateur.</p>
        </LegalSubSection>
        <LegalSubSection id="art3-2" title="3.2 Disponibilité">
          <p>
            L'Éditeur s'efforce d'assurer la disponibilité du Service 24h/24 et 7j/7. Toutefois, des interruptions peuvent survenir pour des raisons de maintenance technique, de mise à jour, ou pour des causes indépendantes de la volonté de l'Éditeur (cas de force majeure, défaillance du réseau Internet, etc.).
          </p>
          <p>
            L'Éditeur ne saurait être tenu responsable des interruptions du Service et de leurs conséquences, dans les limites autorisées par la loi.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 4 */}
      <LegalSection id="art4" title="Article 4 — Inscription et compte utilisateur">
        <LegalSubSection id="art4-1" title="4.1 Création du compte">
          <p>
            L'accès à la majorité des fonctionnalités du Service requiert la création d'un compte. L'inscription s'effectue en ligne en renseignant des informations exactes, complètes et à jour. L'Utilisateur s'engage à mettre à jour ses informations en cas de modification.
          </p>
        </LegalSubSection>
        <LegalSubSection id="art4-2" title="4.2 Identifiants et sécurité">
          <p>
            L'Utilisateur est seul responsable de la confidentialité de ses identifiants (adresse email et mot de passe). Tout accès au Service effectué avec ses identifiants est présumé être de son fait. En cas de perte, vol ou utilisation non autorisée de ses identifiants, l'Utilisateur doit en informer immédiatement l'Éditeur à l'adresse <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a>.
          </p>
        </LegalSubSection>
        <LegalSubSection id="art4-3" title="4.3 Unicité du compte">
          <p>
            Chaque Utilisateur ne peut créer qu'un seul compte personnel. La cession ou le partage du compte à un tiers est interdite.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 5 */}
      <LegalSection id="art5" title="Article 5 — Description du Service">
        <p>Tableo est une plateforme SaaS de gestion de restaurant qui propose notamment les fonctionnalités suivantes :</p>
        <LegalList items={[
          "Création et gestion d'un menu numérique accessible via QR Code ;",
          "Gestion des commandes en salle et à distance ;",
          "Tableau de bord analytique (chiffre d'affaires, popularité des plats, comportement client) ;",
          "Gestion des tables (plan de salle, statuts en temps réel) ;",
          "CRM client (historique des commandes, fidélisation) ;",
          "Gestion de l'équipe (rôles, permissions) ;",
          "Génération de QR Codes personnalisés ;",
          "Fonctionnalités d'intelligence artificielle (suggestions de prix, import de menu, insights).",
        ]} />
        <p>
          Les fonctionnalités disponibles varient selon l'offre souscrite (Gratuit, Growth, Enterprise). L'Éditeur se réserve le droit de modifier les fonctionnalités à tout moment, notamment pour des raisons techniques ou commerciales.
        </p>
      </LegalSection>

      {/* Art. 6 */}
      <LegalSection id="art6" title="Article 6 — Utilisation acceptable">
        <LegalSubSection id="art6-1" title="6.1 Obligations de l'Utilisateur">
          <p>L'Utilisateur s'engage à utiliser le Service conformément aux présentes CGU, à la législation en vigueur et aux bonnes mœurs. Il s'engage notamment à :</p>
          <LegalList items={[
            "Ne pas porter atteinte aux droits des tiers (droit d'auteur, marques, vie privée, etc.) ;",
            "Ne pas diffuser de contenus illicites, diffamatoires, injurieux, racistes, pornographiques ou portant atteinte à la dignité humaine ;",
            "Ne pas perturber le fonctionnement du Service (attaques informatiques, spam, scraping automatisé, etc.) ;",
            "Ne pas contourner les mesures de sécurité techniques mises en place ;",
            "Ne pas utiliser le Service à des fins frauduleuses ou illicites ;",
            "Respecter les droits des autres Utilisateurs.",
          ]} />
        </LegalSubSection>
        <LegalSubSection id="art6-2" title="6.2 Sanctions">
          <p>
            En cas de manquement à ces obligations, l'Éditeur se réserve le droit de suspendre ou de résilier le compte de l'Utilisateur fautif, sans préavis ni indemnité, et sans préjudice de toute action en responsabilité civile ou pénale.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 7 */}
      <LegalSection id="art7" title="Article 7 — Contenu utilisateur">
        <p>
          L'Utilisateur demeure propriétaire des contenus qu'il publie sur le Service (menus, photos, descriptifs, etc.). En publiant des contenus, il concède à l'Éditeur une licence non exclusive, mondiale et gratuite aux seules fins d'exécution du Service.
        </p>
        <p>
          L'Utilisateur garantit que les contenus qu'il publie ne violent aucun droit de tiers et sont conformes à la législation en vigueur. Il assumera seul les conséquences de toute réclamation de tiers à ce titre.
        </p>
        <p>
          L'Éditeur ne saurait être tenu responsable des contenus publiés par les Utilisateurs. Il se réserve toutefois le droit de supprimer tout contenu manifestement illicite, sans préavis.
        </p>
      </LegalSection>

      {/* Art. 8 */}
      <LegalSection id="art8" title="Article 8 — Propriété intellectuelle">
        <p>
          L'ensemble des éléments du Service (code source, design, marques, logos, base de données, algorithmes d'IA) est et demeure la propriété exclusive de KAYZEN LYON, protégé par les dispositions du Code de la propriété intellectuelle.
        </p>
        <p>
          L'Éditeur concède à l'Utilisateur une licence d'utilisation personnelle, non exclusive, non cessible et non transférable du Service, pour la durée de son Abonnement et aux seules fins prévues par les présentes CGU.
        </p>
        <p>
          Toute reproduction, représentation, adaptation ou exploitation non autorisée de tout ou partie du Service est strictement interdite et constitue une contrefaçon au sens des articles L. 335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </LegalSection>

      {/* Art. 9 */}
      <LegalSection id="art9" title="Article 9 — Données personnelles">
        <p>
          Dans le cadre de l'utilisation du Service, KAYZEN LYON est amenée à traiter des données personnelles vous concernant, en qualité de responsable de traitement au sens du RGPD (Règlement UE 2016/679).
        </p>
        <p>
          L'Éditeur agit en qualité de <strong className="text-foreground">sous-traitant</strong> pour les données personnelles des clients finaux des restaurants, traitées par les Abonnés via le Service. En cette qualité, l'Éditeur traite ces données sur instruction des Abonnés et conclut avec eux un accord de traitement des données conforme à l'article 28 du RGPD.
        </p>
        <p>
          Pour tout détail sur les traitements effectués, les droits exercables et les modalités de contact du responsable, consultez notre{" "}
          <Link href="/politique-confidentialite" className="text-primary hover:underline focus-ring rounded">Politique de confidentialité</Link>.
        </p>
      </LegalSection>

      {/* Art. 10 */}
      <LegalSection id="art10" title="Article 10 — Responsabilité de l'Éditeur">
        <p>
          Le Service est fourni « en l'état ». L'Éditeur s'efforce d'en assurer le bon fonctionnement mais ne saurait être tenu responsable :
        </p>
        <LegalList items={[
          "Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Service ;",
          "De la perte de données résultant d'une défaillance technique indépendante de sa volonté ;",
          "Des actes de tiers (piratage, intrusion, virus) en dépit des mesures de sécurité mises en place ;",
          "Des interruptions du Service dues à des causes de force majeure ou à la défaillance d'opérateurs tiers.",
        ]} />
        <p>
          La responsabilité de l'Éditeur, si elle était retenue, est en tout état de cause expressément limitée au montant des sommes effectivement versées par l'Abonné au cours des douze (12) mois précédant le fait générateur du dommage.
        </p>
      </LegalSection>

      {/* Art. 11 */}
      <LegalSection id="art11" title="Article 11 — Force majeure">
        <p>
          L'exécution des obligations de l'Éditeur est suspendue en cas de survenance d'un cas de force majeure au sens de l'article 1218 du Code civil, et notamment en cas de grève, incendie, tempête, catastrophe naturelle, pandémie, défaillance des opérateurs de réseaux de communications électroniques, actes de malveillance informatique, décision d'autorité administrative ou judiciaire.
        </p>
      </LegalSection>

      {/* Art. 12 */}
      <LegalSection id="art12" title="Article 12 — Modification des CGU">
        <p>
          L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet à la date de leur publication sur le Service. Les Utilisateurs actifs sont informés par email avec un préavis de trente (30) jours pour les modifications substantielles. L'utilisation continue du Service après ce délai vaut acceptation des nouvelles CGU.
        </p>
        <p>
          En cas de refus des nouvelles CGU, l'Utilisateur peut résilier son compte dans les conditions prévues à l'article 13.
        </p>
      </LegalSection>

      {/* Art. 13 */}
      <LegalSection id="art13" title="Article 13 — Résiliation du compte">
        <LegalSubSection id="art13-1" title="13.1 Résiliation à l'initiative de l'Utilisateur">
          <p>
            L'Utilisateur peut fermer son compte à tout moment depuis les paramètres de son compte ou en contactant le support à <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a>. La fermeture du compte entraîne la suppression des données conformément à notre politique de conservation des données.
          </p>
        </LegalSubSection>
        <LegalSubSection id="art13-2" title="13.2 Résiliation à l'initiative de l'Éditeur">
          <p>
            L'Éditeur peut suspendre ou résilier le compte d'un Utilisateur en cas de violation des présentes CGU, avec un préavis de 7 jours sauf en cas de manquement grave ou de comportement frauduleux, qui peut entraîner une résiliation immédiate.
          </p>
        </LegalSubSection>
        <LegalSubSection id="art13-3" title="13.3 Effets de la résiliation">
          <p>
            La résiliation du compte entraîne la cessation de l'accès au Service et la suppression des données dans un délai de 90 jours, sauf obligation légale de conservation plus longue.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 14 */}
      <LegalSection id="art14" title="Article 14 — Droit applicable et juridiction compétente">
        <p>
          Les présentes CGU sont régies et interprétées conformément au droit français, à l'exclusion de toute autre législation.
        </p>
        <p>
          En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'engagent à rechercher une solution amiable dans un délai de trente (30) jours à compter de la notification du différend.
        </p>
        <p>
          À défaut d'accord amiable, les litiges seront soumis à la compétence exclusive des Tribunaux de LYON, y compris en cas de pluralité de défendeurs, d'appel en garantie ou de référé, nonobstant toute clause contraire.
        </p>
        <p>
          Pour les litiges de consommation, le consommateur peut recourir à la médiation via <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">MEDICYS</a> ou la plateforme européenne de règlement en ligne des litiges (<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">ec.europa.eu/consumers/odr</a>).
        </p>
      </LegalSection>

      {/* Liens */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <Link href="/cgv" className="text-sm text-primary hover:underline focus-ring rounded">→ Conditions Générales de Vente</Link>
        <Link href="/politique-confidentialite" className="text-sm text-primary hover:underline focus-ring rounded">→ Politique de confidentialité</Link>
        <Link href="/mentions-legales" className="text-sm text-primary hover:underline focus-ring rounded">→ Mentions légales</Link>
      </div>
    </LegalLayout>
  );
}
