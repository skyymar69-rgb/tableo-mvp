import { LegalLayout, LegalSection, LegalSubSection, LegalList, LegalTable } from "@/components/legal/LegalLayout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de cookies — Tableo",
  description: "Politique de gestion des cookies de Tableo : cookies essentiels, analytiques et marketing. Conformité RGPD et recommandations CNIL.",
  robots: { index: true, follow: true },
};

export default function PolitiqueCookiesPage() {
  return (
    <LegalLayout title="Politique de cookies" lastUpdated="2026-04-19">

      <p className="text-muted-foreground border-l-4 border-primary/40 pl-4 py-2 bg-secondary/20 rounded-r-xl">
        La présente politique décrit l'utilisation des cookies et traceurs sur le service <strong className="text-foreground">Tableo</strong>, conformément aux recommandations de la <strong className="text-foreground">CNIL</strong> (délibération n° 2020-091 du 17 septembre 2020), à l'article 82 de la loi Informatique et Libertés et au RGPD.
      </p>

      {/* 1. Définition */}
      <LegalSection id="ck-1" title="1. Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie (ou témoin de connexion) est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur un site web. Il permet au site de mémoriser vos actions et préférences pendant une période déterminée.
        </p>
        <p>
          Les cookies peuvent être « de session » (supprimés à la fermeture du navigateur) ou « persistants » (conservés pour une durée définie sur votre terminal). Certains cookies sont nécessaires au fonctionnement du service, d'autres requièrent votre consentement préalable.
        </p>
        <p>
          Conformément aux recommandations de la CNIL, aucun cookie non strictement nécessaire n'est déposé sans votre consentement préalable, libre, éclairé, spécifique et univoque. Vous pouvez retirer ce consentement à tout moment.
        </p>
      </LegalSection>

      {/* 2. Cookies utilisés */}
      <LegalSection id="ck-2" title="2. Cookies utilisés par Tableo">

        <LegalSubSection id="ck-2-1" title="2.1 Cookies strictement nécessaires (exemptés de consentement)">
          <p>
            Ces cookies sont indispensables au fonctionnement du service. Ils ne peuvent pas être désactivés. Ils ne stockent aucune information personnellement identifiable et sont exemptés de consentement en application de l'article 82 de la loi Informatique et Libertés.
          </p>
          <LegalTable
            headers={["Nom", "Émetteur", "Finalité", "Durée"]}
            rows={[
              ["next-auth.session-token", "Tableo (KAYZEN LYON)", "Maintien de la session authentifiée", "Session / 30 jours"],
              ["next-auth.csrf-token", "Tableo (KAYZEN LYON)", "Protection contre les attaques CSRF", "Session"],
              ["next-auth.callback-url", "Tableo (KAYZEN LYON)", "Redirection après authentification", "Session"],
              ["tableo-cookie-consent", "Tableo (KAYZEN LYON)", "Mémorisation de vos préférences de cookies", "13 mois"],
              ["sidebar-collapsed", "Tableo (KAYZEN LYON)", "Préférence d'affichage de la barre latérale", "Illimité (localStorage)"],
              ["theme", "Tableo (KAYZEN LYON)", "Thème clair/sombre choisi", "Illimité (localStorage)"],
            ]}
          />
        </LegalSubSection>

        <LegalSubSection id="ck-2-2" title="2.2 Cookies analytiques (soumis à consentement)">
          <p>
            Ces cookies nous permettent de mesurer l'audience du service, de comprendre comment les utilisateurs naviguent et d'améliorer nos fonctionnalités. Ils ne sont déposés qu'avec votre consentement préalable.
          </p>
          <LegalTable
            headers={["Nom", "Émetteur", "Finalité", "Durée"]}
            rows={[
              ["_ga", "Google Analytics", "Distinction des utilisateurs", "2 ans"],
              ["_ga_XXXXXXXX", "Google Analytics", "Maintien de l'état de la session", "2 ans"],
              ["_gid", "Google Analytics", "Distinction des utilisateurs (24h)", "24 heures"],
            ]}
          />
          <p className="text-xs">
            Les données collectées par Google Analytics sont anonymisées (IP masquée) et traitées dans l'UE. Elles sont transmises à Google LLC (USA) dans le cadre des SCC. Voir la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">politique de confidentialité Google</a>.
          </p>
        </LegalSubSection>

        <LegalSubSection id="ck-2-3" title="2.3 Cookies marketing (soumis à consentement)">
          <p>
            Ces cookies permettent de vous proposer des publicités personnalisées et de mesurer l'efficacité des campagnes. Ils ne sont déposés qu'avec votre consentement préalable.
          </p>
          <LegalTable
            headers={["Nom", "Émetteur", "Finalité", "Durée"]}
            rows={[
              ["_fbp", "Meta (Facebook)", "Suivi des conversions Facebook Ads", "3 mois"],
              ["_fbc", "Meta (Facebook)", "Attribution des clics depuis Facebook", "2 ans"],
              ["li_sugr", "LinkedIn", "Suivi des conversions LinkedIn Ads", "3 mois"],
            ]}
          />
          <p className="text-xs">
            En l'absence de campagnes actives, ces cookies peuvent ne pas être déposés. Voir les politiques de confidentialité de <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">Meta</a> et <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">LinkedIn</a>.
          </p>
        </LegalSubSection>

      </LegalSection>

      {/* 3. Consentement */}
      <LegalSection id="ck-3" title="3. Recueil et gestion du consentement">
        <p>
          Conformément à la délibération CNIL n° 2020-091 du 17 septembre 2020 et aux lignes directrices modificatives du 4 juillet 2019, le consentement à l'utilisation des cookies non strictement nécessaires est :
        </p>
        <LegalList items={[
          "Libre : refuser est aussi simple qu'accepter (boutons de même niveau d'accessibilité) ;",
          "Éclairé : vous êtes informés de la finalité de chaque catégorie de cookies ;",
          "Spécifique : vous pouvez accepter ou refuser chaque catégorie indépendamment ;",
          "Univoque : votre consentement est une action positive (pas de cases pré-cochées).",
        ]} />
        <p>
          Lors de votre première visite, un bandeau de consentement s'affiche. Vous pouvez :<br/>
          • <strong className="text-foreground">Tout accepter</strong> : active toutes les catégories de cookies ;<br/>
          • <strong className="text-foreground">Tout refuser</strong> : seuls les cookies strictement nécessaires sont déposés ;<br/>
          • <strong className="text-foreground">Personnaliser</strong> : choisissez catégorie par catégorie.
        </p>
        <p>
          Votre choix est enregistré pour une durée de <strong className="text-foreground">13 mois maximum</strong> (durée maximale recommandée par la CNIL), après quoi votre consentement vous sera de nouveau demandé.
        </p>
      </LegalSection>

      {/* 4. Retrait du consentement */}
      <LegalSection id="ck-4" title="4. Retrait du consentement et paramétrage">
        <LegalSubSection id="ck-4-1" title="4.1 Via le bandeau Tableo">
          <p>
            Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien « Gérer les cookies » présent dans le pied de page du site. Le retrait du consentement n'affecte pas la licéité des traitements effectués avant ce retrait.
          </p>
        </LegalSubSection>
        <LegalSubSection id="ck-4-2" title="4.2 Via votre navigateur">
          <p>Vous pouvez également désactiver les cookies directement depuis les paramètres de votre navigateur :</p>
          <LegalList items={[
            "Google Chrome : Menu > Paramètres > Confidentialité et sécurité > Cookies ;",
            "Mozilla Firefox : Menu > Options > Vie privée et sécurité > Cookies ;",
            "Safari : Préférences > Confidentialité > Cookies ;",
            "Microsoft Edge : Paramètres > Confidentialité et sécurité > Cookies.",
          ]} />
          <p className="text-xs">
            Attention : la désactivation de tous les cookies via le navigateur peut altérer le fonctionnement du service, notamment la connexion à votre compte.
          </p>
        </LegalSubSection>
        <LegalSubSection id="ck-4-3" title="4.3 Opt-out tiers">
          <p>Vous pouvez vous opposer directement aux cookies des tiers suivants :</p>
          <LegalList items={[
            "Google Analytics : tools.google.com/dlpage/gaoptout",
            "Meta : www.facebook.com/privacy/policies/cookies",
            "LinkedIn : www.linkedin.com/psettings/guest-controls",
          ]} />
        </LegalSubSection>
      </LegalSection>

      {/* 5. Durées */}
      <LegalSection id="ck-5" title="5. Durée de conservation des données issues des cookies">
        <p>
          Les données collectées via les cookies analytiques (audience) sont conservées pour une durée maximale de <strong className="text-foreground">25 mois</strong> conformément aux recommandations de la CNIL. Au-delà, elles sont supprimées ou anonymisées de façon irréversible.
        </p>
      </LegalSection>

      {/* 6. Transferts */}
      <LegalSection id="ck-6" title="6. Transferts hors Union européenne">
        <p>
          Certains cookies déposés par des tiers (Google, Meta, LinkedIn) impliquent des transferts de données vers les États-Unis. Ces transferts sont encadrés par les Clauses Contractuelles Types approuvées par la Commission européenne (décision 2021/914).
        </p>
      </LegalSection>

      {/* Contact */}
      <div className="rounded-xl border border-primary/20 bg-gradient-warm-subtle p-5">
        <p className="text-sm font-semibold text-foreground mb-1">Questions sur les cookies ?</p>
        <p className="text-xs text-muted-foreground">
          Contactez-nous à <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a> ou via notre{" "}
          <Link href="/contact" className="text-primary hover:underline focus-ring rounded">formulaire de contact</Link>.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <Link href="/politique-confidentialite" className="text-sm text-primary hover:underline focus-ring rounded">→ Politique de confidentialité</Link>
        <Link href="/mentions-legales" className="text-sm text-primary hover:underline focus-ring rounded">→ Mentions légales</Link>
        <Link href="/cgu" className="text-sm text-primary hover:underline focus-ring rounded">→ CGU</Link>
      </div>
    </LegalLayout>
  );
}
