import { LegalLayout, LegalSection, LegalSubSection, LegalList, LegalTable } from "@/components/legal/LegalLayout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente (CGV) — Tableo",
  description: "Conditions Générales de Vente des abonnements Tableo. Tarifs, paiement, droit de rétractation, résiliation — conformes au droit français et à la directive européenne sur les droits des consommateurs.",
  robots: { index: true, follow: true },
};

export default function CGVPage() {
  return (
    <LegalLayout title="Conditions Générales de Vente" lastUpdated="2026-04-19">

      <p className="text-muted-foreground border-l-4 border-primary/40 pl-4 py-2 bg-secondary/20 rounded-r-xl">
        Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à toute souscription d'un abonnement payant au service <strong className="text-foreground">Tableo</strong>, édité par <strong className="text-foreground">KAYZEN LYON</strong> (SASU, RCS Lyon 999 418 346). Elles prévalent sur tout autre document émanant de l'Acheteur. La validation d'une commande implique l'acceptation sans réserve des présentes CGV.
      </p>

      {/* Art. 1 */}
      <LegalSection id="cgv-art1" title="Article 1 — Identification du vendeur">
        <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-1.5 text-sm">
          <p><span className="font-semibold text-foreground">Vendeur :</span> KAYZEN LYON</p>
          <p><span className="font-semibold text-foreground">Forme juridique :</span> SASU au capital de 1 000 €</p>
          <p><span className="font-semibold text-foreground">SIREN :</span> 999 418 346</p>
          <p><span className="font-semibold text-foreground">RCS :</span> Lyon B 999 418 346</p>
          <p><span className="font-semibold text-foreground">N° TVA :</span> FR85 999 418 346</p>
          <p><span className="font-semibold text-foreground">Siège :</span> 6, rue Pierre TERMIER — 69009 LYON</p>
          <p><span className="font-semibold text-foreground">Email :</span> <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a></p>
          <p><span className="font-semibold text-foreground">Tél. :</span> <a href="tel:+33487776861" className="text-primary hover:underline focus-ring rounded">+33 (0)4 87 77 68 61</a></p>
        </div>
      </LegalSection>

      {/* Art. 2 */}
      <LegalSection id="cgv-art2" title="Article 2 — Offres et tarifs">
        <p>
          Tableo propose plusieurs formules d'abonnement destinées aux professionnels de la restauration. Les prix sont indiqués en euros (€) HT et TTC, la TVA applicable étant celle en vigueur en France au taux de 20 %.
        </p>
        <LegalTable
          headers={["Formule", "Prix HT/mois", "TVA 20%", "Prix TTC/mois", "Engagement"]}
          rows={[
            ["Gratuit", "0,00 €", "—", "0,00 €", "Sans engagement"],
            ["Growth", "49,00 €", "9,80 €", "58,80 €", "Mensuel ou annuel (−20%)"],
            ["Enterprise", "Sur devis", "—", "Sur devis", "Annuel"],
          ]}
        />
        <p>
          Les tarifs annuels bénéficient d'une remise de 20 % sur le tarif mensuel. Le montant total est facturé en une fois à la souscription.
        </p>
        <p>
          L'Éditeur se réserve le droit de modifier ses tarifs à tout moment. Les modifications tarifaires sont notifiées aux Abonnés par email avec un préavis de trente (30) jours avant leur entrée en vigueur. En cas de refus, l'Abonné peut résilier son abonnement avant la date de prise d'effet.
        </p>
      </LegalSection>

      {/* Art. 3 */}
      <LegalSection id="cgv-art3" title="Article 3 — Commande et souscription de l'abonnement">
        <LegalSubSection id="cgv-art3-1" title="3.1 Processus de commande">
          <p>La souscription s'effectue en ligne selon les étapes suivantes :</p>
          <ol className="list-decimal list-inside space-y-1.5 pl-4 text-muted-foreground">
            <li>Sélection de la formule d'abonnement ;</li>
            <li>Création ou connexion au compte Tableo ;</li>
            <li>Saisie des informations de facturation ;</li>
            <li>Saisie des informations de paiement via le prestataire sécurisé Stripe ;</li>
            <li>Vérification du récapitulatif de la commande ;</li>
            <li>Validation définitive par clic sur « Confirmer et payer ».</li>
          </ol>
          <p>
            La commande est définitive à compter du clic sur « Confirmer et payer ». Un email de confirmation récapitulatif est adressé à l'Acheteur dans les meilleurs délais.
          </p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art3-2" title="3.2 Acceptation électronique">
          <p>
            Conformément à l'article 1127-1 du Code civil, la validation de la commande par double clic vaut acceptation irrévocable des présentes CGV et de la somme due. L'Acheteur reconnaît avoir pris connaissance et accepter sans réserve l'intégralité des présentes CGV.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 4 */}
      <LegalSection id="cgv-art4" title="Article 4 — Modalités de paiement">
        <LegalSubSection id="cgv-art4-1" title="4.1 Moyens de paiement acceptés">
          <p>Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard, American Express) via la plateforme sécurisée <strong className="text-foreground">Stripe</strong>. Les coordonnées bancaires sont chiffrées par le protocole SSL et ne sont jamais transmises à KAYZEN LYON.</p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art4-2" title="4.2 Prélèvement automatique">
          <p>
            Pour les abonnements mensuels, le paiement est prélevé automatiquement à chaque début de période. Pour les abonnements annuels, le paiement est prélevé en totalité à la souscription puis à chaque date anniversaire. L'Abonné autorise expressément Stripe à effectuer ces prélèvements récurrents.
          </p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art4-3" title="4.3 Défaut de paiement">
          <p>
            En cas d'échec du prélèvement, l'Éditeur notifie l'Abonné par email. Si le paiement n'est pas régularisé dans un délai de sept (7) jours, l'accès au Service peut être suspendu. À défaut de régularisation dans les trente (30) jours suivant la suspension, l'abonnement est résilié de plein droit.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 5 */}
      <LegalSection id="cgv-art5" title="Article 5 — Droit de rétractation">
        <LegalSubSection id="cgv-art5-1" title="5.1 Délai légal de rétractation">
          <p>
            Conformément aux articles L. 221-18 et suivants du Code de la consommation, l'Acheteur consommateur dispose d'un délai de <strong className="text-foreground">quatorze (14) jours francs</strong> à compter de la souscription de l'abonnement pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à supporter de pénalités.
          </p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art5-2" title="5.2 Renonciation expresse au droit de rétractation">
          <p>
            Conformément à l'article L. 221-25 du Code de la consommation, lorsque l'exécution du service commence avant l'expiration du délai de rétractation, à la demande expresse de l'Acheteur, et que le service est pleinement exécuté, <strong className="text-foreground">l'Acheteur perd son droit de rétractation</strong>. En souscrivant un abonnement Tableo avec accès immédiat, l'Acheteur reconnaît avoir demandé l'exécution immédiate du service.
          </p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art5-3" title="5.3 Exercice du droit de rétractation">
          <p>Pour exercer ce droit, l'Acheteur doit notifier sa décision de se rétracter avant l'expiration du délai par :</p>
          <LegalList items={[
            "Email à contact@kayzen-lyon.fr avec en objet « Exercice du droit de rétractation » ;",
            "Courrier recommandé avec accusé de réception à : KAYZEN LYON, 6 rue Pierre TERMIER, 69009 LYON.",
          ]} />
          <p>Le remboursement est effectué dans les quatorze (14) jours suivant la réception de la demande de rétractation, par le même moyen de paiement que celui utilisé lors de la transaction initiale.</p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art5-4" title="5.4 Formulaire de rétractation (modèle)">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs space-y-1">
            <p className="font-semibold text-foreground">Formulaire de rétractation type (art. R. 221-1 Code de la consommation)</p>
            <p>À l'attention de KAYZEN LYON — 6, rue Pierre TERMIER — 69009 LYON — contact@kayzen-lyon.fr</p>
            <p>Je vous notifie par la présente ma rétractation du contrat portant sur la souscription de l'abonnement Tableo [formule], souscrit le [date] :</p>
            <p>Nom et prénom du consommateur : …………………………</p>
            <p>Adresse : …………………………………………………………</p>
            <p>Signature (papier uniquement) : ………………  Date : ………</p>
          </div>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 6 */}
      <LegalSection id="cgv-art6" title="Article 6 — Facturation et TVA">
        <p>
          Une facture électronique est émise à chaque échéance de paiement et mise à disposition dans l'espace client Tableo (rubrique « Paramètres › Facturation »). La facture mentionne le numéro de TVA intracommunautaire de KAYZEN LYON (FR85 999 418 346).
        </p>
        <p>
          Pour les professionnels assujettis à la TVA dans un autre État membre de l'UE fournissant leur numéro de TVA intracommunautaire valide, l'autoliquidation de la TVA s'applique conformément à l'article 196 de la directive 2006/112/CE.
        </p>
      </LegalSection>

      {/* Art. 7 */}
      <LegalSection id="cgv-art7" title="Article 7 — Résiliation de l'abonnement">
        <LegalSubSection id="cgv-art7-1" title="7.1 Résiliation par l'Abonné">
          <p>
            L'Abonné peut résilier son abonnement mensuel à tout moment depuis les paramètres de son compte (rubrique « Facturation »). La résiliation prend effet à l'issue de la période en cours, déjà facturée. Aucun remboursement proratisé n'est effectué pour la période restante.
          </p>
          <p>
            Pour un abonnement annuel, la résiliation peut être demandée à tout moment mais prend effet à la date d'échéance annuelle. Aucun remboursement partiel n'est accordé hors exercice du droit de rétractation légal.
          </p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art7-2" title="7.2 Résiliation par l'Éditeur">
          <p>
            L'Éditeur peut résilier l'abonnement en cas de violation des CGU ou des CGV, avec remboursement proratisé des sommes versées pour la période non consommée, sauf en cas de faute grave de l'Abonné.
          </p>
        </LegalSubSection>
        <LegalSubSection id="cgv-art7-3" title="7.3 Conséquences de la résiliation">
          <p>
            À la résiliation, l'Abonné peut exporter ses données (menus, clients, analytics) pendant une période de trente (30) jours via l'outil d'export disponible dans les paramètres. Passé ce délai, les données sont supprimées conformément à notre politique de conservation.
          </p>
        </LegalSubSection>
      </LegalSection>

      {/* Art. 8 */}
      <LegalSection id="cgv-art8" title="Article 8 — Niveaux de service (SLA)">
        <p>
          L'Éditeur s'engage à assurer une disponibilité du Service de <strong className="text-foreground">99,5 % mensuel</strong>, hors maintenances planifiées notifiées avec un préavis de 48 heures, et hors événements de force majeure.
        </p>
        <p>
          En cas de dépassement de la durée d'indisponibilité non planifiée, l'Abonné bénéficiera d'un crédit de service, selon le barème suivant :
        </p>
        <LegalTable
          headers={["Disponibilité mensuelle", "Crédit accordé"]}
          rows={[
            ["99,0 % – 99,5 %", "5 % du loyer mensuel"],
            ["95,0 % – 99,0 %", "10 % du loyer mensuel"],
            ["Inférieure à 95,0 %", "25 % du loyer mensuel"],
          ]}
        />
        <p>
          Les crédits sont accordés sur demande adressée à <a href="mailto:contact@kayzen-lyon.fr" className="text-primary hover:underline focus-ring rounded">contact@kayzen-lyon.fr</a> dans les trente (30) jours suivant l'incident et imputés sur la prochaine facture.
        </p>
      </LegalSection>

      {/* Art. 9 */}
      <LegalSection id="cgv-art9" title="Article 9 — Responsabilité">
        <p>
          La responsabilité de l'Éditeur ne peut être engagée que pour des dommages directs résultant d'une faute prouvée dans l'exécution du Service. En tout état de cause, la responsabilité de l'Éditeur est expressément limitée au montant des sommes versées par l'Abonné au cours des douze (12) mois précédant le fait générateur, sauf dommages corporels ou faute lourde ou dolosive.
        </p>
        <p>
          L'Éditeur ne saurait en aucun cas être tenu responsable des pertes de chiffre d'affaires, de clientèle, de données commerciales ou de tout autre dommage indirect.
        </p>
      </LegalSection>

      {/* Art. 10 */}
      <LegalSection id="cgv-art10" title="Article 10 — Force majeure">
        <p>
          Aucune des parties ne saurait être tenue responsable du retard ou de l'inexécution de ses obligations lorsque ceux-ci résultent d'un cas de force majeure au sens de l'article 1218 du Code civil.
        </p>
      </LegalSection>

      {/* Art. 11 */}
      <LegalSection id="cgv-art11" title="Article 11 — Règlement des litiges et droit applicable">
        <p>
          Les présentes CGV sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher un accord amiable préalablement à toute action judiciaire.
        </p>
        <p>
          <strong className="text-foreground">Pour les consommateurs :</strong> En cas d'échec de la tentative de règlement amiable, le consommateur peut recourir à la médiation via MEDICYS (<a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">www.medicys.fr</a>) ou la plateforme RLL de la Commission européenne (<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus-ring rounded">ec.europa.eu/consumers/odr</a>).
        </p>
        <p>
          <strong className="text-foreground">Pour les professionnels :</strong> Tout litige relatif aux présentes CGV sera soumis à la compétence exclusive des Tribunaux de LYON.
        </p>
      </LegalSection>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <Link href="/cgu" className="text-sm text-primary hover:underline focus-ring rounded">→ Conditions Générales d'Utilisation</Link>
        <Link href="/politique-confidentialite" className="text-sm text-primary hover:underline focus-ring rounded">→ Politique de confidentialité</Link>
        <Link href="/mentions-legales" className="text-sm text-primary hover:underline focus-ring rounded">→ Mentions légales</Link>
      </div>
    </LegalLayout>
  );
}
