import { LegalLayout, LegalSection, LegalSubSection, LegalList, LegalTable } from "@/components/legal/LegalLayout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Tableo",
  description: "Politique de confidentialité et protection des données personnelles de Tableo, conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés.",
  robots: { index: true, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" lastUpdated="2026-04-19">

      <p className="text-muted-foreground border-l-4 border-primary/40 pl-4 py-2 bg-secondary/20 rounded-r-xl">
        KAYZEN LYON attache la plus grande importance à la protection de vos données personnelles. La présente politique est rédigée en conformité avec le <strong className="text-foreground">Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679)</strong> et la <strong className="text-foreground">loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée</strong>. Elle s'applique au traitement de vos données personnelles dans le cadre de l'utilisation du service Tableo.
      </p>

      {/* 1. Responsable */}
      <LegalSection id="pc-1" title="1. Responsable du traitement">
        <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-1.5 text-sm">
          <p><span className="font-semibold text-foreground">Responsable :</span> KAYZEN LYON</p>
          <p><span className="font-semibold text-foreground">Forme :</span> SASU — capital 1 000 €</p>
          <p><span className="font-semibold text-foreground">SIREN :</span> 999 418 346</p>
          <p><span className="font-semibold text-foreground">Adresse :</span> 6, rue Pierre TERMIER — 69009 LYON</p>
          <p><span className="font-semibold text-foreground">Email RGPD :</span> <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a></p>
          <p><span className="font-semibold text-foreground">Téléphone :</span> <a href="tel:+33487776861" className="text-primary hover:underline focus-ring rounded">+33 (0)4 87 77 68 61</a></p>
        </div>
        <p>
          KAYZEN LYON agit en qualité de <strong className="text-foreground">responsable de traitement</strong> pour les données des Utilisateurs du service Tableo. Pour les données des clients finaux des restaurants gérés via Tableo, KAYZEN LYON agit en qualité de <strong className="text-foreground">sous-traitant</strong> au sens de l'article 28 du RGPD, le restaurant étant responsable de traitement.
        </p>
      </LegalSection>

      {/* 2. DPO */}
      <LegalSection id="pc-2" title="2. Délégué à la protection des données (DPO)">
        <p>
          Compte tenu de la taille de la structure et des traitements effectués, KAYZEN LYON n'est pas soumise à l'obligation de désigner un DPO au sens de l'article 37 du RGPD. Toute demande relative à la protection de vos données peut être adressée directement au responsable du traitement via les coordonnées ci-dessus.
        </p>
        <p>
          Vous pouvez également contacter l'autorité de contrôle compétente, la <strong className="text-foreground">Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">www.cnil.fr</a> — 3, Place de Fontenoy — 75007 PARIS.
        </p>
      </LegalSection>

      {/* 3. Données collectées */}
      <LegalSection id="pc-3" title="3. Données collectées et finalités">
        <LegalSubSection id="pc-3-1" title="3.1 Données de création de compte et d'inscription">
          <LegalTable
            headers={["Catégorie de données", "Données collectées", "Finalité", "Base légale"]}
            rows={[
              ["Identité", "Prénom, nom", "Création et gestion du compte", "Exécution du contrat (art. 6.1.b RGPD)"],
              ["Contact", "Adresse email", "Authentification, notifications, support", "Exécution du contrat"],
              ["Contact", "Numéro de téléphone", "Vérification, support (optionnel)", "Intérêt légitime"],
              ["Professionnel", "Nom du restaurant, type d'établissement", "Configuration du service", "Exécution du contrat"],
              ["Authentification", "Mot de passe haché (bcrypt)", "Sécurité du compte", "Exécution du contrat"],
            ]}
          />
        </LegalSubSection>
        <LegalSubSection id="pc-3-2" title="3.2 Données d'utilisation du service">
          <LegalTable
            headers={["Données", "Finalité", "Base légale"]}
            rows={[
              ["Menus, plats, prix", "Fourniture du service (menu numérique)", "Exécution du contrat"],
              ["Commandes, tickets", "Gestion opérationnelle", "Exécution du contrat"],
              ["Tables, statuts", "Gestion du plan de salle", "Exécution du contrat"],
              ["Données analytiques agrégées", "Analytics de performance du restaurant", "Exécution du contrat"],
              ["Données CRM clients (nom, email, historique)", "Fidélisation, historique commandes", "Intérêt légitime / consentement"],
            ]}
          />
        </LegalSubSection>
        <LegalSubSection id="pc-3-3" title="3.3 Données de facturation et paiement">
          <p>
            Les données de paiement (numéro de carte, CVV) sont traitées exclusivement par <strong className="text-foreground">Stripe Inc.</strong> via une connexion sécurisée SSL/TLS. KAYZEN LYON ne stocke aucune donnée bancaire brute. Seules les données de facturation (nom, adresse de facturation, montant, référence transaction) sont conservées à des fins comptables et légales.
          </p>
        </LegalSubSection>
        <LegalSubSection id="pc-3-4" title="3.4 Données de navigation et techniques">
          <LegalTable
            headers={["Données", "Finalité", "Base légale"]}
            rows={[
              ["Adresse IP", "Sécurité, prévention de la fraude, logs", "Intérêt légitime"],
              ["User-agent, navigateur", "Compatibilité, debug", "Intérêt légitime"],
              ["Pages visitées, durée de session", "Analytics d'amélioration du service", "Consentement (cookies)"],
              ["Cookies de session", "Maintien de la connexion", "Exécution du contrat"],
            ]}
          />
        </LegalSubSection>
        <LegalSubSection id="pc-3-5" title="3.5 Données collectées via les formulaires de contact">
          <p>
            Lorsque vous utilisez notre formulaire de contact, nous collectons : nom, prénom, email, téléphone (optionnel), et le contenu du message. Ces données sont utilisées exclusivement pour répondre à votre demande (base légale : intérêt légitime — gestion de la relation client) et sont supprimées dans un délai de 3 ans à compter du dernier contact.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* 4. Bases légales */}
      <LegalSection id="pc-4" title="4. Bases légales des traitements">
        <p>Nous traitons vos données sur les bases légales suivantes (article 6 RGPD) :</p>
        <LegalList items={[
          "Exécution du contrat (art. 6.1.b) : traitements nécessaires à la fourniture du service Tableo ;",
          "Obligation légale (art. 6.1.c) : conservation des données de facturation (art. L. 123-22 C. com., 10 ans) ;",
          "Intérêt légitime (art. 6.1.f) : sécurité, prévention de la fraude, amélioration du service, relation client ;",
          "Consentement (art. 6.1.a) : cookies non essentiels, communications marketing, newsletter.",
        ]} />
      </LegalSection>

      {/* 5. Destinataires */}
      <LegalSection id="pc-5" title="5. Destinataires des données">
        <p>Vos données sont susceptibles d'être partagées avec :</p>
        <LegalTable
          headers={["Destinataire", "Rôle", "Données partagées", "Pays"]}
          rows={[
            ["Vercel Inc.", "Hébergeur", "Toutes données d'exploitation", "USA (SCC)"],
            ["Stripe Inc.", "Paiement en ligne", "Données de facturation et paiement", "USA (SCC)"],
            ["Google LLC", "OAuth (optionnel), Analytics", "Email, profil (si OAuth)", "USA (SCC)"],
            ["Prisma / Neon", "Base de données (sous-traitant)", "Toutes données stockées", "UE"],
            ["OpenAI / Anthropic", "IA (suggestions, insights)", "Données de menus et analytiques", "USA (SCC)"],
          ]}
        />
        <p>
          Aucune donnée n'est vendue, louée ou cédée à des tiers à des fins commerciales. Les sous-traitants sont sélectionnés pour leur conformité au RGPD et liés par des clauses contractuelles types (SCC) ou par une décision d'adéquation de la Commission européenne.
        </p>
      </LegalSection>

      {/* 6. Transferts hors UE */}
      <LegalSection id="pc-6" title="6. Transferts hors Union européenne">
        <p>
          Certains sous-traitants (Vercel, Stripe, Google, OpenAI) sont établis aux États-Unis. Ces transferts sont encadrés par les <strong className="text-foreground">Clauses Contractuelles Types (SCC)</strong> adoptées par la Commission européenne (décision d'exécution 2021/914), conformément à l'article 46 du RGPD.
        </p>
        <p>
          Vous pouvez obtenir une copie des garanties mises en place en contactant : <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a>.
        </p>
      </LegalSection>

      {/* 7. Durée de conservation */}
      <LegalSection id="pc-7" title="7. Durées de conservation">
        <LegalTable
          headers={["Catégorie", "Durée de conservation"]}
          rows={[
            ["Données de compte actif", "Durée de l'abonnement + 3 ans après résiliation"],
            ["Données de facturation", "10 ans (obligation comptable — art. L. 123-22 C. com.)"],
            ["Logs de sécurité / adresse IP", "12 mois (LCEN art. 6-II)"],
            ["Données CRM clients finaux", "3 ans à compter du dernier contact actif"],
            ["Données de contact (formulaire)", "3 ans à compter du dernier contact"],
            ["Cookies de consentement", "13 mois maximum (CNIL)"],
            ["Données d'analytics", "25 mois maximum (CNIL)"],
          ]}
        />
        <p>
          À l'issue de ces délais, les données sont soit supprimées de manière sécurisée, soit anonymisées de façon irréversible à des fins statistiques.
        </p>
      </LegalSection>

      {/* 8. Droits */}
      <LegalSection id="pc-8" title="8. Vos droits">
        <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
        <LegalTable
          headers={["Droit", "Description", "Comment l'exercer"]}
          rows={[
            ["Accès (art. 15)", "Obtenir une copie de vos données", "Email à contact@kayzen-lyon.fr"],
            ["Rectification (art. 16)", "Corriger des données inexactes ou incomplètes", "Paramètres du compte ou email"],
            ["Effacement (art. 17)", "Demander la suppression de vos données (« droit à l'oubli »)", "Email à contact@kayzen-lyon.fr"],
            ["Limitation (art. 18)", "Restreindre temporairement le traitement", "Email à contact@kayzen-lyon.fr"],
            ["Portabilité (art. 20)", "Recevoir vos données dans un format structuré et lisible", "Export via paramètres du compte"],
            ["Opposition (art. 21)", "Vous opposer au traitement fondé sur l'intérêt légitime", "Email à contact@kayzen-lyon.fr"],
            ["Retrait du consentement", "Retirer votre consentement à tout moment", "Bandeau cookies ou email"],
            ["Réclamation CNIL", "Introduire une plainte auprès de l'autorité de contrôle", "www.cnil.fr"],
          ]}
        />
        <p>
          Nous répondons à toute demande dans un délai d'un (1) mois à compter de la réception (prorogeable de deux mois pour les demandes complexes, avec information préalable). Nous pouvons vous demander de justifier de votre identité avant de donner suite à votre demande.
        </p>
      </LegalSection>

      {/* 9. Sécurité */}
      <LegalSection id="pc-9" title="9. Sécurité des données">
        <p>KAYZEN LYON met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre :</p>
        <LegalList items={[
          "L'accès non autorisé : authentification JWT, sessions sécurisées, hachage bcrypt des mots de passe ;",
          "La perte ou la destruction accidentelle : sauvegardes automatiques chiffrées via Vercel/Neon ;",
          "L'altération ou la divulgation : chiffrement en transit (TLS 1.3), HTTPS obligatoire ;",
          "L'injection et les attaques web : utilisation de Prisma (requêtes préparées), validation Zod côté serveur.",
        ]} />
        <p>
          En cas de violation de données à caractère personnel susceptible d'engendrer un risque pour vos droits et libertés, nous vous en informerons dans les soixante-douze (72) heures conformément à l'article 33 du RGPD.
        </p>
      </LegalSection>

      {/* 10. Cookies */}
      <LegalSection id="pc-10" title="10. Cookies et traceurs">
        <p>
          Tableo utilise des cookies et traceurs pour le fonctionnement du service, l'amélioration de l'expérience utilisateur et l'analyse d'audience. Pour plus d'informations et pour gérer vos préférences, consultez notre{" "}
          <Link href="/politique-cookies" className="text-primary hover:underline focus-ring rounded">Politique de cookies</Link>.
        </p>
        <p>
          Vous pouvez modifier vos préférences à tout moment en cliquant sur « Gérer les cookies » dans le pied de page ou via le bandeau de consentement.
        </p>
      </LegalSection>

      {/* 11. Mineurs */}
      <LegalSection id="pc-11" title="11. Protection des mineurs">
        <p>
          Le service Tableo est destiné exclusivement aux professionnels et aux personnes majeures. Nous ne collectons pas sciemment de données personnelles concernant des enfants de moins de 16 ans. Si vous estimez que nous détenons des données relatives à un mineur, contactez-nous immédiatement.
        </p>
      </LegalSection>

      {/* 12. Modifications */}
      <LegalSection id="pc-12" title="12. Modifications de la présente politique">
        <p>
          La présente politique peut être modifiée à tout moment pour refléter les évolutions légales, réglementaires ou opérationnelles. La version en vigueur est celle accessible sur cette page. En cas de modification substantielle, nous vous en informerons par email avec un préavis de 30 jours.
        </p>
      </LegalSection>

      {/* Contact */}
      <div className="rounded-xl border border-primary/20 bg-gradient-warm-subtle p-5 space-y-2">
        <p className="text-sm font-semibold text-foreground">Exercer vos droits RGPD</p>
        <p className="text-xs text-muted-foreground">
          Adressez votre demande par email à{" "}
          <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a>{" "}
          ou par courrier recommandé à KAYZEN LYON — 6, rue Pierre TERMIER — 69009 LYON.
        </p>
        <p className="text-xs text-muted-foreground">
          Ou utilisez notre <Link href="/contact" className="text-primary hover:underline focus-ring rounded">formulaire de contact sécurisé</Link>.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <Link href="/politique-cookies" className="text-sm text-primary hover:underline focus-ring rounded">→ Politique de cookies</Link>
        <Link href="/mentions-legales" className="text-sm text-primary hover:underline focus-ring rounded">→ Mentions légales</Link>
        <Link href="/cgu" className="text-sm text-primary hover:underline focus-ring rounded">→ CGU</Link>
        <Link href="/cgv" className="text-sm text-primary hover:underline focus-ring rounded">→ CGV</Link>
      </div>
    </LegalLayout>
  );
}
