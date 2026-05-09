"use client";

import Link from "next/link";
import { Download, Printer, ArrowLeft } from "lucide-react";

const NOTICE_SECTIONS = [
  {
    title: "1. Présentation de la plateforme",
    content: [
      {
        subtitle: "Qu'est-ce que Tableo ?",
        text: "Tableo est un Revenue Operating System (ROS) SaaS conçu pour les restaurants. Il centralise la gestion du menu digital, des commandes à table via QR code, des paiements, du CRM client et des analytics de revenus dans une seule interface web.",
      },
      {
        subtitle: "Architecture technique",
        text: "Tableo est construit sur Next.js 14 (App Router) avec React 18, TypeScript 5, Tailwind CSS et une base de données PostgreSQL via Prisma ORM. Le backend expose des API REST sécurisées par NextAuth.js (JWT + OAuth Google).",
      },
      {
        subtitle: "Infrastructure",
        text: "La plateforme est hébergée sur Vercel (CDN mondial, edge functions) avec une base de données PostgreSQL managée. Les données sont répliquées en temps réel et sauvegardées quotidiennement. Les assets statiques sont distribués via un CDN avec mise en cache optimisée.",
      },
    ],
  },
  {
    title: "2. Fonctionnalités principales",
    content: [
      {
        subtitle: "Menu digital IA",
        text: "Création et gestion de menus multi-langues via interface drag-and-drop. Import IA depuis texte ou photo (Claude API d'Anthropic). Gestion des allergènes (14 allergènes réglementaires UE), des labels (Bestseller, Nouveau, Végétarien, etc.), des calories et des variantes de plats.",
      },
      {
        subtitle: "QR Codes",
        text: "Génération de QR codes personnalisés par table avec couleurs et logos. Export PNG HD, SVG et impression. Suivi des scans en temps réel avec analytics détaillés. Génération en masse pour tous les établissements.",
      },
      {
        subtitle: "Commandes & Kitchen Display",
        text: "Cycle complet de commande : En attente → Confirmée → En préparation → Prête → Livrée. Mode Cuisine (KDS) avec vue kanban en temps réel, chronomètre d'urgence, et notifications push. Polling WebSocket-like toutes les 8 secondes.",
      },
      {
        subtitle: "CRM & Fidélisation",
        text: "Base clients automatiquement enrichie à chaque commande. Segmentation RFM automatique (Champions, Fidèles, Prometteurs, À risque, Perdus). Programme de fidélité par points (1 point = 1€). Campagnes email avec templates personnalisables.",
      },
      {
        subtitle: "Analytics & IA",
        text: "Dashboard temps réel : CA, commandes, scans, panier moyen. Graphiques historiques sur 7j/30j/1an. Prévisions IA de revenus à 7 jours avec intervalles de confiance. Détection de churn automatique. Export CSV complet.",
      },
    ],
  },
  {
    title: "3. Sécurité & Authentification",
    content: [
      {
        subtitle: "Authentification",
        text: "NextAuth.js avec stratégie JWT (RS256). Support de l'authentification par email/mot de passe (bcrypt, 12 rounds) et OAuth Google. Tokens d'accès avec durée de vie limitée (24h). Refresh tokens sécurisés en cookies HttpOnly.",
      },
      {
        subtitle: "Isolation des données (multitenant)",
        text: "Chaque restaurant dispose de son propre espace de données isolé. Toutes les routes API vérifient que l'utilisateur connecté est bien propriétaire du restaurant demandé via la relation ownerId. Aucun accès croisé possible entre restaurants.",
      },
      {
        subtitle: "Chiffrement & Transport",
        text: "Toutes les communications sont chiffrées en TLS 1.3. Les mots de passe ne sont jamais stockés en clair (bcrypt). Les données de paiement transitent exclusivement via Stripe (PCI DSS niveau 1). Les tokens d'API sont stockés hashés.",
      },
      {
        subtitle: "Rôles & Permissions",
        text: "4 rôles : ADMIN (accès plateforme total), OWNER (accès restaurant complet), MANAGER (accès fonctionnel sauf facturation), STAFF (accès opérationnel : commandes, cuisine, tables). Les permissions sont vérifiées côté serveur à chaque requête.",
      },
    ],
  },
  {
    title: "4. Conformité RGPD",
    content: [
      {
        subtitle: "Hébergement des données",
        text: "Toutes les données sont hébergées dans des datacenters localisés en Europe (Union Européenne). Aucun transfert de données personnelles vers des pays tiers sans garanties adéquates (clauses contractuelles types).",
      },
      {
        subtitle: "Données collectées",
        text: "Tableo collecte uniquement les données nécessaires au fonctionnement du service : informations du restaurant (nom, adresse, contact), données des commandes (table, articles, montant), données clients optionnelles (email, téléphone), données analytiques agrégées.",
      },
      {
        subtitle: "Droits des utilisateurs",
        text: "Conformément au RGPD, les utilisateurs disposent des droits d'accès, rectification, effacement, portabilité et opposition. Ces droits peuvent être exercés via la page Paramètres ou par email à privacy@tableo.app. Délai de traitement : 72 heures ouvrées.",
      },
      {
        subtitle: "Durée de conservation",
        text: "Les données actives sont conservées pour la durée de la relation commerciale. En cas de résiliation, les données sont conservées 30 jours pour permettre une éventuelle réactivation, puis supprimées définitivement. Les données comptables sont conservées 10 ans (obligation légale).",
      },
    ],
  },
  {
    title: "5. Intégrations & API",
    content: [
      {
        subtitle: "Stripe — Paiements",
        text: "Intégration complète de Stripe pour les abonnements (Checkout, Webhooks, Customer Portal). Gestion des plans FREE/GROWTH/ENTERPRISE avec cycles mensuel et annuel. PCI DSS niveau 1 — Tableo ne stocke aucune donnée de carte.",
      },
      {
        subtitle: "Claude AI (Anthropic)",
        text: "Intégration de l'API Claude pour : import intelligent de menu (reconnaissance texte/image), assistant IA intégré au dashboard, détection de churn et suggestions de prix, génération de descriptions de plats.",
      },
      {
        subtitle: "Google OAuth",
        text: "Connexion simplifiée via compte Google. Seuls l'email et le nom sont récupérés (scopes minimaux). Aucune donnée Google n'est stockée hormis l'identifiant unique pour lier le compte.",
      },
      {
        subtitle: "API REST publique",
        text: "Les menus publics sont accessibles via l'API publique sans authentification (GET /api/public/menu/[slug]). L'API privée nécessite un token JWT valide dans l'en-tête Authorization. Documentation Swagger disponible sur demande.",
      },
    ],
  },
  {
    title: "6. Performance & Disponibilité",
    content: [
      {
        subtitle: "SLA & Disponibilité",
        text: "Tableo vise un taux de disponibilité de 99.9% (SLA). Les maintenances planifiées sont communiquées 48h à l'avance via email et bannière in-app. Un tableau de bord de statut est disponible sur status.tableo.app.",
      },
      {
        subtitle: "Performance",
        text: "Score Lighthouse > 90 sur toutes les pages. Images optimisées (WebP/AVIF, lazy-loading). Code JavaScript splitté par route (bundle < 200KB par page). Cache React Query avec stale-time optimisé. Edge CDN pour les assets statiques.",
      },
      {
        subtitle: "Scalabilité",
        text: "Architecture serverless sur Vercel avec auto-scaling automatique. La base de données utilise un pool de connexions (PgBouncer) pour gérer jusqu'à 10 000 connexions simultanées. Les requêtes sont optimisées avec des index Prisma sur tous les champs de filtrage courants.",
      },
    ],
  },
];

export default function NoticeTechniquePage() {
  const handlePrint = () => window.print();
  const handleDownload = () => {
    window.open("/api/docs/notice", "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-6 h-16 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Paramètres
          </Link>
          <div className="w-px h-4 bg-border" />
          <h1 className="text-sm font-bold text-foreground">Notice Technique</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimer
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, hsl(var(--warm-start)), hsl(var(--warm-mid)), hsl(var(--warm-end)))" }}
          >
            <Download className="w-3.5 h-3.5" /> Télécharger PDF
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 pt-10 print:pt-4">
        {/* Cover */}
        <div className="rounded-2xl border border-border p-8 mb-10 print:rounded-none print:border-0 print:p-0"
          style={{ background: "linear-gradient(135deg, #001e40 0%, #1603ae 60%, #844981 100%)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">T</div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Tableo</p>
              <p className="text-white font-bold text-lg">Notice Technique</p>
            </div>
          </div>
          <h1 className="text-white text-2xl font-bold mb-3">Documentation Technique & Sécurité</h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-xl">
            Ce document décrit l&apos;architecture, les fonctionnalités, la sécurité et la conformité réglementaire de la plateforme Tableo Revenue Operating System.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-white/60 text-xs">
            <span>Version 2.0</span>
            <span>•</span>
            <span>Mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</span>
            <span>•</span>
            <span>KAYZEN LYON — RCS Lyon 999 418 346</span>
          </div>
        </div>

        {/* Table des matières */}
        <div className="rounded-xl border border-border bg-gradient-card p-5 mb-10">
          <h2 className="text-sm font-bold text-foreground mb-3 uppercase tracking-widest">Table des matières</h2>
          <ol className="space-y-1.5">
            {NOTICE_SECTIONS.map((s, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                  <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {s.title.replace(/^\d+\.\s/, "")}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {NOTICE_SECTIONS.map((section, sIdx) => (
            <section key={sIdx} id={`section-${sIdx}`} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                <span className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {sIdx + 1}
                </span>
                <h2 className="text-lg font-bold text-foreground">{section.title.replace(/^\d+\.\s/, "")}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item, iIdx) => (
                  <div key={iIdx} className="rounded-xl border border-border bg-gradient-card p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />
                      {item.subtitle}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer legal */}
        <div className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground space-y-2">
          <p>© {new Date().getFullYear()} Tableo — KAYZEN LYON (SASU, RCS Lyon 999 418 346)</p>
          <p>Ce document est fourni à titre informatif. Pour toute question technique ou juridique, contactez support@tableo.app</p>
          <p>Conforme RGPD · RGAA 4.1 · WCAG 2.2 AA · EAA</p>
        </div>
      </div>
    </div>
  );
}
