import { NextResponse } from "next/server";

const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Tableo — Notice Technique v2.0</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a2e; background: #fff; padding: 40px 24px; max-width: 800px; margin: 0 auto; }
  .cover { background: linear-gradient(135deg, #001e40 0%, #1603ae 60%, #844981 100%); border-radius: 12px; padding: 40px; margin-bottom: 40px; color: white; }
  .cover-logo { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; margin-bottom: 16px; }
  .cover h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .cover p { color: rgba(255,255,255,0.7); font-size: 13px; max-width: 560px; }
  .cover-meta { margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.5); display: flex; gap: 12px; flex-wrap: wrap; }
  .toc { border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px 24px; margin-bottom: 40px; background: #fafafa; }
  .toc h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 12px; }
  .toc ol { padding-left: 0; list-style: none; }
  .toc li { padding: 4px 0; }
  .toc a { color: #1603ae; text-decoration: none; font-size: 13px; }
  .toc a:hover { text-decoration: underline; }
  section { margin-bottom: 48px; }
  .section-header { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; margin-bottom: 20px; }
  .section-num { width: 32px; height: 32px; background: linear-gradient(135deg, #001e40, #844981); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  h2.section-title { font-size: 18px; font-weight: 700; color: #111; }
  .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px 20px; margin-bottom: 12px; background: #fafafa; }
  .card h3 { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .card h3::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #1603ae; flex-shrink: 0; }
  .card p { font-size: 13px; color: #374151; line-height: 1.65; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; line-height: 1.8; }
  @media print {
    body { padding: 20px; }
    .cover { border-radius: 0; }
    section { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-logo">T</div>
  <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.5);margin-bottom:8px;">Tableo</p>
  <h1>Documentation Technique &amp; Sécurité</h1>
  <p>Ce document décrit l'architecture, les fonctionnalités, la sécurité et la conformité réglementaire de la plateforme Tableo Revenue Operating System.</p>
  <div class="cover-meta">
    <span>Version 2.0</span>
    <span>•</span>
    <span>KAYZEN LYON — RCS Lyon 999 418 346</span>
  </div>
</div>

<div class="toc">
  <h2>Table des matières</h2>
  <ol>
    <li><a href="#s1">1. Présentation de la plateforme</a></li>
    <li><a href="#s2">2. Fonctionnalités principales</a></li>
    <li><a href="#s3">3. Sécurité &amp; Authentification</a></li>
    <li><a href="#s4">4. Conformité RGPD</a></li>
    <li><a href="#s5">5. Intégrations &amp; API</a></li>
    <li><a href="#s6">6. Performance &amp; Disponibilité</a></li>
  </ol>
</div>

<section id="s1">
  <div class="section-header"><div class="section-num">1</div><h2 class="section-title">Présentation de la plateforme</h2></div>
  <div class="card"><h3>Qu'est-ce que Tableo ?</h3><p>Tableo est un Revenue Operating System (ROS) SaaS conçu pour les restaurants. Il centralise la gestion du menu digital, des commandes à table via QR code, des paiements, du CRM client et des analytics de revenus dans une seule interface web.</p></div>
  <div class="card"><h3>Architecture technique</h3><p>Tableo est construit sur Next.js 14 (App Router) avec React 18, TypeScript 5, Tailwind CSS et une base de données PostgreSQL via Prisma ORM. Le backend expose des API REST sécurisées par NextAuth.js (JWT + OAuth Google).</p></div>
  <div class="card"><h3>Infrastructure</h3><p>La plateforme est hébergée sur Vercel (CDN mondial, edge functions) avec une base de données PostgreSQL managée. Les données sont répliquées en temps réel et sauvegardées quotidiennement. Les assets statiques sont distribués via un CDN avec mise en cache optimisée.</p></div>
</section>

<section id="s2">
  <div class="section-header"><div class="section-num">2</div><h2 class="section-title">Fonctionnalités principales</h2></div>
  <div class="card"><h3>Menu digital IA</h3><p>Création et gestion de menus multi-langues via interface drag-and-drop. Import IA depuis texte ou photo (Claude API d'Anthropic). Gestion des allergènes (14 allergènes réglementaires UE), des labels (Bestseller, Nouveau, Végétarien, etc.), des calories et des variantes de plats.</p></div>
  <div class="card"><h3>QR Codes</h3><p>Génération de QR codes personnalisés par table avec couleurs et logos. Export PNG HD, SVG et impression. Suivi des scans en temps réel avec analytics détaillés. Génération en masse pour tous les établissements.</p></div>
  <div class="card"><h3>Commandes &amp; Kitchen Display</h3><p>Cycle complet de commande : En attente → Confirmée → En préparation → Prête → Livrée. Mode Cuisine (KDS) avec vue kanban en temps réel, chronomètre d'urgence, et notifications push. Polling WebSocket-like toutes les 8 secondes.</p></div>
  <div class="card"><h3>CRM &amp; Fidélisation</h3><p>Base clients automatiquement enrichie à chaque commande. Segmentation RFM automatique (Champions, Fidèles, Prometteurs, À risque, Perdus). Programme de fidélité par points (1 point = 1€). Campagnes email avec templates personnalisables.</p></div>
  <div class="card"><h3>Analytics &amp; IA</h3><p>Dashboard temps réel : CA, commandes, scans, panier moyen. Graphiques historiques sur 7j/30j/1an. Prévisions IA de revenus à 7 jours avec intervalles de confiance. Détection de churn automatique. Export CSV complet.</p></div>
</section>

<section id="s3">
  <div class="section-header"><div class="section-num">3</div><h2 class="section-title">Sécurité &amp; Authentification</h2></div>
  <div class="card"><h3>Authentification</h3><p>NextAuth.js avec stratégie JWT (RS256). Support de l'authentification par email/mot de passe (bcrypt, 12 rounds) et OAuth Google. Tokens d'accès avec durée de vie limitée (24h). Refresh tokens sécurisés en cookies HttpOnly.</p></div>
  <div class="card"><h3>Isolation des données (multitenant)</h3><p>Chaque restaurant dispose de son propre espace de données isolé. Toutes les routes API vérifient que l'utilisateur connecté est bien propriétaire du restaurant demandé via la relation ownerId. Aucun accès croisé possible entre restaurants.</p></div>
  <div class="card"><h3>Chiffrement &amp; Transport</h3><p>Toutes les communications sont chiffrées en TLS 1.3. Les mots de passe ne sont jamais stockés en clair (bcrypt). Les données de paiement transitent exclusivement via Stripe (PCI DSS niveau 1). Les tokens d'API sont stockés hashés.</p></div>
  <div class="card"><h3>Rôles &amp; Permissions</h3><p>4 rôles : ADMIN (accès plateforme total), OWNER (accès restaurant complet), MANAGER (accès fonctionnel sauf facturation), STAFF (accès opérationnel : commandes, cuisine, tables). Les permissions sont vérifiées côté serveur à chaque requête.</p></div>
</section>

<section id="s4">
  <div class="section-header"><div class="section-num">4</div><h2 class="section-title">Conformité RGPD</h2></div>
  <div class="card"><h3>Hébergement des données</h3><p>Toutes les données sont hébergées dans des datacenters localisés en Europe (Union Européenne). Aucun transfert de données personnelles vers des pays tiers sans garanties adéquates (clauses contractuelles types).</p></div>
  <div class="card"><h3>Données collectées</h3><p>Tableo collecte uniquement les données nécessaires au fonctionnement du service : informations du restaurant (nom, adresse, contact), données des commandes (table, articles, montant), données clients optionnelles (email, téléphone), données analytiques agrégées.</p></div>
  <div class="card"><h3>Droits des utilisateurs</h3><p>Conformément au RGPD, les utilisateurs disposent des droits d'accès, rectification, effacement, portabilité et opposition. Ces droits peuvent être exercés via la page Paramètres ou par email à privacy@tableo.app. Délai de traitement : 72 heures ouvrées.</p></div>
  <div class="card"><h3>Durée de conservation</h3><p>Les données actives sont conservées pour la durée de la relation commerciale. En cas de résiliation, les données sont conservées 30 jours pour permettre une éventuelle réactivation, puis supprimées définitivement. Les données comptables sont conservées 10 ans (obligation légale).</p></div>
</section>

<section id="s5">
  <div class="section-header"><div class="section-num">5</div><h2 class="section-title">Intégrations &amp; API</h2></div>
  <div class="card"><h3>Stripe — Paiements</h3><p>Intégration complète de Stripe pour les abonnements (Checkout, Webhooks, Customer Portal). Gestion des plans FREE/GROWTH/ENTERPRISE avec cycles mensuel et annuel. PCI DSS niveau 1 — Tableo ne stocke aucune donnée de carte.</p></div>
  <div class="card"><h3>Claude AI (Anthropic)</h3><p>Intégration de l'API Claude pour : import intelligent de menu (reconnaissance texte/image), assistant IA intégré au dashboard, détection de churn et suggestions de prix, génération de descriptions de plats.</p></div>
  <div class="card"><h3>Google OAuth</h3><p>Connexion simplifiée via compte Google. Seuls l'email et le nom sont récupérés (scopes minimaux). Aucune donnée Google n'est stockée hormis l'identifiant unique pour lier le compte.</p></div>
  <div class="card"><h3>API REST publique</h3><p>Les menus publics sont accessibles via l'API publique sans authentification (GET /api/public/menu/[slug]). L'API privée nécessite un token JWT valide dans l'en-tête Authorization. Documentation Swagger disponible sur demande.</p></div>
</section>

<section id="s6">
  <div class="section-header"><div class="section-num">6</div><h2 class="section-title">Performance &amp; Disponibilité</h2></div>
  <div class="card"><h3>SLA &amp; Disponibilité</h3><p>Tableo vise un taux de disponibilité de 99.9% (SLA). Les maintenances planifiées sont communiquées 48h à l'avance via email et bannière in-app. Un tableau de bord de statut est disponible sur status.tableo.app.</p></div>
  <div class="card"><h3>Performance</h3><p>Score Lighthouse > 90 sur toutes les pages. Images optimisées (WebP/AVIF, lazy-loading). Code JavaScript splitté par route (bundle &lt; 200KB par page). Cache React Query avec stale-time optimisé. Edge CDN pour les assets statiques.</p></div>
  <div class="card"><h3>Scalabilité</h3><p>Architecture serverless sur Vercel avec auto-scaling automatique. La base de données utilise un pool de connexions (PgBouncer) pour gérer jusqu'à 10 000 connexions simultanées. Les requêtes sont optimisées avec des index Prisma sur tous les champs de filtrage courants.</p></div>
</section>

<div class="footer">
  <p>© ${new Date().getFullYear()} Tableo — KAYZEN LYON (SASU, RCS Lyon 999 418 346)</p>
  <p>Ce document est fourni à titre informatif. Pour toute question technique ou juridique, contactez support@tableo.app</p>
  <p>Conforme RGPD · RGAA 4.1 · WCAG 2.2 AA · EAA</p>
</div>

</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'attachment; filename="tableo-notice-technique.html"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
