import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/landing/CTAFooter";

export const metadata: Metadata = {
  title: "Documentation & FAQ — Tableo",
  description: "Guide complet, FAQ et documentation technique de la plateforme Tableo. Tout ce que vous devez savoir pour gérer votre restaurant.",
};

const SECTIONS = [
  {
    id: "demarrage",
    icon: "🚀",
    color: "from-blue-500 to-indigo-600",
    title: "Prise en main",
    questions: [
      {
        q: "Comment créer mon compte Tableo ?",
        a: "Rendez-vous sur tableo.app/signup, saisissez votre email et choisissez un mot de passe. Vous pouvez aussi vous connecter directement avec Google. Votre premier restaurant sera créé automatiquement lors de l'onboarding.",
      },
      {
        q: "Combien de temps pour être opérationnel ?",
        a: "Moins de 5 minutes. L'assistant d'onboarding vous guide pas à pas : informations du restaurant, import du menu (par photo ou texte avec l'IA), génération des QR codes, et vous êtes prêt.",
      },
      {
        q: "Puis-je importer mon menu existant ?",
        a: "Oui. Tableo propose un import IA : collez le texte de votre carte ou uploadez une photo, et l'IA structure automatiquement vos plats, catégories et prix. Vous pouvez ensuite affiner chaque élément.",
      },
      {
        q: "Tableo fonctionne-t-il sans internet en salle ?",
        a: "Le dashboard nécessite une connexion internet. Cependant, les QR codes peuvent être scannés en mode hors-ligne si les pages de menu sont chargées depuis un cache navigateur récent.",
      },
    ],
  },
  {
    id: "menu",
    icon: "🍽️",
    color: "from-orange-500 to-pink-500",
    title: "Gestion du menu",
    questions: [
      {
        q: "Comment ajouter un plat ?",
        a: "Dans Menu → sélectionnez ou créez une catégorie → cliquez « Ajouter un plat ». Renseignez le nom, le prix, une description et une photo. Vous pouvez aussi définir les allergènes, labels (Nouveauté, Bestseller, Végétarien…) et les calories.",
      },
      {
        q: "Puis-je avoir plusieurs menus (déjeuner, dîner) ?",
        a: "Oui, Tableo supporte plusieurs menus par restaurant. Chaque menu a son propre QR code et peut être activé/désactivé indépendamment. Idéal pour la carte du midi, la carte du soir ou les menus saisonniers.",
      },
      {
        q: "Comment modifier la disponibilité d'un plat en temps réel ?",
        a: "Dans Menu, cliquez sur le plat et désactivez le toggle « Disponible ». Le changement est immédiat — le plat disparaît du menu client sans supprimer la fiche.",
      },
      {
        q: "Les photos du menu sont-elles obligatoires ?",
        a: "Non, mais fortement recommandées. Les études montrent que les plats avec photo génèrent 40% de clics supplémentaires. Tableo optimise automatiquement les images (compression WebP, lazy-loading).",
      },
      {
        q: "Comment gérer les allergènes ?",
        a: "Chaque plat dispose d'un sélecteur d'allergènes parmi les 14 allergènes majeurs de la réglementation européenne. Les icônes apparaissent dans le menu client avec les informations complètes.",
      },
    ],
  },
  {
    id: "qr",
    icon: "📱",
    color: "from-purple-500 to-pink-600",
    title: "QR Codes",
    questions: [
      {
        q: "Comment générer un QR code pour ma table ?",
        a: "Dans QR Codes, choisissez la table correspondante, personnalisez les couleurs si souhaité, et cliquez « Générer ». Vous pouvez télécharger le QR en PNG HD, SVG, ou imprimer directement.",
      },
      {
        q: "Comment créer des QR codes en masse ?",
        a: "Dans QR Codes → « Génération en masse », cliquez sur le bouton dédié. Tableo génère automatiquement un QR unique pour chaque table configurée dans votre plan de salle.",
      },
      {
        q: "Puis-je personnaliser les couleurs du QR code ?",
        a: "Oui. Tableo propose 5 thèmes prédéfinis (Classique, Brand, Nuit, Émeraude, Violet) et un mode couleurs personnalisées. Le QR reste toujours scannable quelle que soit la combinaison de couleurs.",
      },
      {
        q: "Le QR code change-t-il si je modifie le menu ?",
        a: "Non. Le QR code est lié à l'URL du restaurant (ex: tableo.app/menu/votre-resto). Toute modification du menu est visible immédiatement lors du scan, sans regénérer le QR.",
      },
    ],
  },
  {
    id: "commandes",
    icon: "🛒",
    color: "from-emerald-500 to-teal-600",
    title: "Commandes",
    questions: [
      {
        q: "Comment voir les commandes en temps réel ?",
        a: "Le tableau de bord Commandes se rafraîchit automatiquement toutes les 8 secondes. Vous pouvez aussi activer le Mode Cuisine (KDS) depuis le menu latéral pour une vue kanban optimisée pour la brigade.",
      },
      {
        q: "Comment fonctionne le cycle d'une commande ?",
        a: "Une commande passe par les statuts : En attente → Confirmée → En préparation → Prête → Livrée. Chaque transition déclenche une notification et vous pouvez faire avancer ou annuler manuellement.",
      },
      {
        q: "Qu'est-ce que le Mode Cuisine (KDS) ?",
        a: "Le Kitchen Display System est une vue dédiée à la brigade en cuisine. Il affiche un kanban 3 colonnes (À préparer / En cours / Prêtes), un chronomètre par commande (rouge si > 20 min), et les boutons d'action rapide.",
      },
      {
        q: "Peut-on exporter l'historique des commandes ?",
        a: "Oui. Dans Commandes, cliquez sur l'icône d'export (coin supérieur droit). Le fichier CSV inclut : n° commande, table, articles, montant, statut, date et heure.",
      },
      {
        q: "Les clients peuvent-ils commander depuis leur téléphone ?",
        a: "Oui. En scannant le QR de leur table, vos clients accèdent au menu digital. Ils peuvent consulter les plats, ajouter au panier et envoyer leur commande directement en cuisine.",
      },
    ],
  },
  {
    id: "analytics",
    icon: "📊",
    color: "from-amber-500 to-orange-600",
    title: "Analytics",
    questions: [
      {
        q: "Quelles données puis-je analyser ?",
        a: "Tableo analyse le chiffre d'affaires, le nombre de commandes, les scans QR, le taux de conversion, le panier moyen, les plats les plus vendus et les prévisions de revenus sur 7 jours.",
      },
      {
        q: "Les données sont-elles en temps réel ?",
        a: "Les KPIs du dashboard sont actualisés quotidiennement. Les graphiques Analytics sont disponibles sur 7 jours, 30 jours ou 1 an. Le dashboard principal se rafraîchit à la demande.",
      },
      {
        q: "Comment exporter mes analytics ?",
        a: "Dans Analytics, cliquez sur « Exporter CSV » (haut à droite). Sélectionnez la plage temporelle souhaitée. Le fichier inclut tous les indicateurs de performance.",
      },
      {
        q: "Les prévisions IA sont-elles fiables ?",
        a: "Les prévisions sont basées sur vos données historiques et les tendances saisonnières. Elles donnent une fourchette de confiance (intervalle min/max) et s'améliorent avec le temps et les données accumulées.",
      },
    ],
  },
  {
    id: "crm",
    icon: "👥",
    color: "from-rose-500 to-red-600",
    title: "CRM Clients",
    questions: [
      {
        q: "Comment fonctionne la segmentation RFM ?",
        a: "Tableo calcule automatiquement le score RFM (Récence, Fréquence, Montant) de chaque client. Les segments sont : Champions (meilleurs clients), Fidèles, Prometteurs, À risque et Perdus.",
      },
      {
        q: "Comment envoyer une campagne email ?",
        a: "Dans CRM → cliquez « Campagne email ». Choisissez un template (Promo, Réactivation, Newsletter), sélectionnez le segment cible, personnalisez l'objet et le message ({prénom} et {restaurant} sont remplacés automatiquement).",
      },
      {
        q: "Les données clients sont-elles conformes RGPD ?",
        a: "Oui. Tableo respecte le RGPD : les données sont hébergées en Europe, aucune donnée n'est revendue, et vous disposez d'outils d'export et de suppression. Les clients peuvent demander l'accès ou la suppression de leurs données.",
      },
      {
        q: "Comment ajouter des notes sur un client ?",
        a: "Cliquez sur un client dans la liste CRM pour ouvrir son profil. En bas du panneau, une zone « Notes internes » vous permet de saisir des préférences, allergies ou remarques. Les notes sont sauvegardées localement.",
      },
    ],
  },
  {
    id: "equipe",
    icon: "👨‍💼",
    color: "from-cyan-500 to-blue-600",
    title: "Équipe & Accès",
    questions: [
      {
        q: "Combien de membres d'équipe puis-je inviter ?",
        a: "Le plan Gratuit inclut 2 membres. Le plan Growth permet jusqu'à 10 membres, et Enterprise est illimité. Chaque membre reçoit une invitation par email.",
      },
      {
        q: "Quels sont les rôles disponibles ?",
        a: "Tableo propose 3 rôles : Propriétaire (accès total), Manager (accès complet sauf facturation), et Équipe (accès opérationnel : commandes, cuisine, tables).",
      },
      {
        q: "Un membre peut-il avoir accès à plusieurs restaurants ?",
        a: "Actuellement, chaque membre est associé à un restaurant. La gestion multi-établissement avec comptes partagés est prévue pour la version Enterprise.",
      },
    ],
  },
  {
    id: "abonnement",
    icon: "💳",
    color: "from-violet-500 to-purple-600",
    title: "Abonnement & Facturation",
    questions: [
      {
        q: "Quelles sont les différentes offres ?",
        a: "Tableo propose 3 formules : Gratuit (fonctionnalités de base, 1 menu, 2 membres), Growth (analytics avancés, IA illimitée, support prioritaire) et Enterprise (multi-établissement, API, accompagnement dédié).",
      },
      {
        q: "Puis-je annuler à tout moment ?",
        a: "Oui, sans engagement ni pénalité. L'annulation prend effet à la fin de la période en cours. Vos données sont conservées 30 jours après l'annulation.",
      },
      {
        q: "Les paiements sont-ils sécurisés ?",
        a: "Oui. Tableo utilise Stripe pour le traitement des paiements (certifié PCI DSS niveau 1). Nous ne stockons jamais les données de carte bancaire.",
      },
      {
        q: "Y a-t-il une période d'essai gratuite ?",
        a: "Le plan Gratuit est disponible sans limite de durée. Vous pouvez tester Tableo sans carte bancaire et passer à Growth ou Enterprise quand vous le souhaitez.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fdf8ff 0%, #f0f4ff 60%, #fff8f5 100%)" }}>
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
          style={{ background: "radial-gradient(circle, #1603ae 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] opacity-15"
          style={{ background: "radial-gradient(circle, #844981 0%, transparent 70%)" }} />
        <div className="relative container mx-auto px-6 max-w-[800px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1603ae]/20 bg-[#1603ae]/8 px-4 py-1.5 mb-6">
            <span className="text-[12px] font-medium text-[#1603ae]">Documentation officielle</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-display font-bold tracking-[-0.03em] text-[#111111] mb-4">
            Centre d&apos;aide &{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #001e40, #1603ae, #844981)" }}>
              Documentation
            </span>
          </h1>
          <p className="text-[17px] text-[#374151] max-w-xl mx-auto leading-relaxed">
            Tout ce qu&apos;il vous faut pour tirer le meilleur parti de Tableo — guides, FAQ et références techniques.
          </p>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white/80 px-3 py-1 text-[13px] font-medium text-[#374151] hover:border-[#1603ae]/30 hover:text-[#1603ae] transition-colors backdrop-blur-sm">
                <span>{s.icon}</span> {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Notice technique */}
      <section className="py-10 border-b border-[#e5e7eb] bg-[#f9fafb]">
        <div className="container mx-auto px-6 max-w-[900px]">
          <div className="rounded-[16px] border border-[#e5e7eb] bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                style={{ background: "linear-gradient(135deg, #001e40, #1603ae)" }}>
                📄
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-1">Notice technique complète</h3>
                <p className="text-[13px] text-[#6b7280]">
                  Document PDF — Architecture, sécurité, RGPD, intégrations et spécifications techniques.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/api/docs/notice"
                download="tableo-notice-technique.html"
                className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] focus-ring"
                style={{ background: "linear-gradient(135deg, #001e40, #1603ae, #844981)" }}
              >
                ⬇ Télécharger
              </a>
              <Link
                href="/dashboard/docs/notice"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white px-5 py-2.5 text-[13px] font-medium text-[#374151] hover:border-[#111111]/20 transition-colors focus-ring"
              >
                Consulter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ sections */}
      <div id="faq" className="container mx-auto px-6 max-w-[900px] py-16 space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id}>
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-xl shadow-sm`}>
                {section.icon}
              </div>
              <h2 className="text-[22px] font-display font-semibold text-[#111111]">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.questions.map((item, i) => (
                <details key={i} className="group rounded-[12px] border border-[#e5e7eb] bg-white overflow-hidden">
                  <summary className="flex items-start justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-[#f9fafb] transition-colors">
                    <span className="font-medium text-[15px] text-[#111111] leading-snug">{item.q}</span>
                    <span className="shrink-0 w-5 h-5 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] text-xs transition-transform group-open:rotate-45 mt-0.5">+</span>
                  </summary>
                  <div className="px-5 pb-4 pt-1 text-[14px] text-[#374151] leading-relaxed border-t border-[#f3f4f6]">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA contact */}
      <section className="py-16 border-t border-[#e5e7eb] bg-[#f9fafb]">
        <div className="container mx-auto px-6 max-w-[700px] text-center">
          <p className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-widest mb-3">Vous n&apos;avez pas trouvé votre réponse ?</p>
          <h2 className="text-[24px] font-display font-semibold text-[#111111] mb-4">Notre équipe est là pour vous aider</h2>
          <p className="text-[15px] text-[#374151] mb-6">Support disponible du lundi au vendredi, réponse sous 2h ouvrées.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-[10px] px-8 py-3.5 text-[14px] font-semibold text-white transition-all hover:scale-[1.02] focus-ring"
            style={{ background: "linear-gradient(135deg, #001e40, #1603ae, #844981)" }}
          >
            Contacter le support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
