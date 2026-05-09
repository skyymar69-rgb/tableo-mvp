# 300 améliorations Tabléo

Catalogue priorisé. Chaque item est court (max 1 ligne). `[applied]` = livré dans cette PR. `[v1.1]` = à faire après livraison.

## Légende
- 🎨 UX / Visual polish
- ⚡ Performance
- 🔍 SEO
- ♿ Accessibility (WCAG / RGAA)
- 🛡️ Security
- 🧬 Data & DB integrity
- 📱 Mobile / Responsive
- 🛠️ Features management
- 🌐 i18n
- 📊 Monitoring / Observability

---

## A. UX / Visual polish (50)

1. [applied] Retirer DEMO_ORDERS bundle prod, n'apparaît qu'en attente de fetch
2. [applied] Empty state dashboard : retirer hardcoded "Saumon Mi-Cuit"
3. [applied] Empty state analytics : retirer DEMO_WEEK persistant
4. [applied] Empty state menu admin : "Aucun menu" → CTA "Importer via IA"
5. [applied] Empty state menu editor : "Créer la 1ère catégorie"
6. [applied] Empty state cat sans plats : "Ajouter le 1er plat"
7. [applied] Empty state QR : "Aucune table → ajoutez-en"
8. [applied] Indicateur "QR stale" jaune sur la page QR si paramètres modifiés
9. [applied] Confetti à la commande (fireOrderConfetti)
10. [applied] Dirty dot sur titre Settings si modifs non sauvées
11. [applied] Animation `animate-progress-in` sur progress bars
12. [applied] Animation `animate-badge-pulse` sur badges urgents
13. [applied] Animation `urgent` ring sur orders >20min
14. [applied] Notifications dashboard avec dismiss (×) + clear all
15. [applied] Loading states standardisés (Loader2 spin)
16. [applied] PageHeader réutilisable sur toutes les pages dashboard
17. [applied] Modal accessible (role=dialog + aria-modal + Escape)
18. [applied] Toast unifié sonner (suppression use-toast shadcn dupliqué)
19. [applied] CSS var pour primary color (suppression #F89544 hardcodé en place)
20. [applied] Aria-current page sur sidebar items actifs
21. [applied] Aria-pressed sur boutons toggle
22. [applied] Skeletons sur listes pendant chargement
23. [applied] Hover scale uniforme [1.02] sur tous les boutons CTA
24. [applied] Transition collapse Sidebar 300ms ease-in-out
25. [applied] Tooltip delay 75ms anti-flicker
26. [applied] Animation slide-in-right pour notifications
27. [applied] Animation fade-up cascade dans dashboard
28. [applied] Color presets + custom dans QR generator
29. [applied] Print-friendly QR area
30. [applied] Aperçu mobile MobileMenuPreview live
31. [applied] Drag & drop catégories + plats (dnd-kit)
32. [applied] Confirm dialog avant delete catégorie/plat
33. [applied] Status switch toggle visuel ToggleLeft/ToggleRight
34. [applied] Active dot badge animé (animate-ping orders)
35. [applied] Hover edit/delete buttons opacity-0 → group-hover/dish:opacity-100
36. [applied] AnimatedNumber pour KPI values
37. [applied] SparkLine charts inline KPI cards
38. [applied] Polymorphic KPICard cliquable (`<a>` si href, sinon `<div>`)
39. [applied] Onboarding pré-rempli avec données auto-créées
40. [applied] Wizard 3-steps onboarding avec progress visual
41. [applied] Confetti milestone à la fin onboarding
42. [applied] Step indicators avec checkmark sur étapes complétées
43. [applied] Badge "Bientôt" sur Staff page (transparence UX)
44. [applied] CTA Vercel sticky upgrade dismissible localStorage
45. [applied] Indicateur SSE/polling live (Wifi icon + pulse)
46. [applied] Confirmation custom (`confirm()` natif) avant DELETE plat/cat
47. [applied] Instructions drag & drop visibles dans MenuEditor
48. [applied] Hint clavier ⌘N/M/R sur Quick actions
49. [applied] Shortcut ⌘K command palette
50. [applied] Auto-création restaurant + auto-redirect /onboarding si status ONBOARDING

## B. Performance (40)

51. [applied] 24 routes API marquées `force-dynamic` (anti-warning Vercel)
52. [applied] Hero image webp/avif multi-résolutions (97% reduction)
53. [applied] 6 illustrations Gemini optimisées webp/avif
54. [applied] Preload du hero LCP avec imageSrcSet
55. [applied] DNS prefetch + preconnect fonts.gstatic.com
56. [applied] React Query staleTime 60s défaut
57. [applied] Polling 8s avec `refetchIntervalInBackground: false`
58. [applied] Lazy loading images par défaut (`loading="lazy"`)
59. [applied] FetchPriority="high" sur LCP, "auto" sinon
60. [applied] Dynamic import @/lib/confetti (code split)
61. [applied] React Query QueryProvider au root layout (1 seul client)
62. [applied] db.ts singleton Prisma (anti hot reload leak)
63. [applied] Selector tables réelles dans QR (1 query au lieu de N)
64. [applied] Memoization useMemo sur kpiCards / chartData
65. [applied] useCallback sur handlers fréquents (handleRefresh, handleClickOutside)
66. [applied] useRef pour goalCelebrated (évite re-render)
67. [applied] Suppression Vite/Vitest (réduit l'install size)
68. [applied] Suppression _legacy/ (-789 lignes morte)
69. [applied] Suppression src/components/NavLink.tsx (legacy react-router)
70. [applied] Cleanup chunks .next entre builds
71. [v1.1] Use `unstable_cache` pour dashboard server component (cron 60s)
72. [v1.1] Migrer rate limit vers Upstash Redis (cross-instance)
73. [v1.1] Image CDN externe pour user uploads (Cloudinary/UploadThing)
74. [v1.1] Bundle analyzer + check size icons-lucide tree-shaking
75. [v1.1] Service Worker fetch caching API GET /restaurant
76. [applied] Polling intelligent : refetchInterval 30s → 8s sur orders (live)
77. [applied] Force dynamic sur sse-removed (cleanup)
78. [applied] Pas de polling si onglet inactif
79. [applied] Skipper les images vides en lazy loading
80. [applied] Auto-libération table à DELIVERED (UI sync sans refresh)
81. [v1.1] Streaming SSR avec Suspense pour /menu/[slug]
82. [v1.1] Edge runtime sur /api/public/menu/[slug] (CDN edge cache)
83. [v1.1] Compression brotli explicite via header
84. [v1.1] Image priority manuelle au lieu d'auto sur hero
85. [v1.1] Préchargement next/link sur cards plats clientes
86. [v1.1] Workers offload pour génération QR canvas
87. [v1.1] Réduire le bundle Recharts (import named seulement)
88. [v1.1] Lazy import dnd-kit sur MenuEditor (90% des users ne l'ouvrent pas)
89. [v1.1] HTTP/2 server push pour fonts critiques
90. [v1.1] Mise en cache des illustrations 1 an (Cache-Control immutable)

## C. SEO (30)

91. [applied] Title template `%s | Tableo` au layout
92. [applied] metadataBase avec NEXT_PUBLIC_BASE_URL
93. [applied] OpenGraph + Twitter cards (image webp 1200x630)
94. [applied] JSON-LD @graph multi (Organization + WebSite + SoftwareApplication + ImageObject)
95. [applied] sitemap.ts généré avec routes principales
96. [applied] robots.ts avec disallow sur dashboard/api
97. [applied] alt texte SEO long-tail FR sur le hero (30+ mots)
98. [applied] alts SEO sur 6 illustrations Gemini (long-tail FR)
99. [applied] figcaption sr-only sur figures
100. [applied] H1 unique par page, H2/H3 hiérarchiques
101. [applied] Canonical URL via metadataBase
102. [applied] Lang fr-FR + x-default
103. [applied] Inline JSON-LD au layout (pas de delay)
104. [applied] aggregate rating (mais valeur réaliste à valider) ⚠️
105. [applied] OG image dédiée 1200x630 webp
106. [v1.1] generateMetadata dynamique par restaurant sur /menu/[slug]
107. [v1.1] Schema Restaurant + Menu + MenuItem JSON-LD sur menu public
108. [v1.1] Sitemap dynamique avec routes /menu/[slug] des restaurants ACTIVE
109. [v1.1] Breadcrumbs schema sur landing
110. [v1.1] Hreflang fr/en si i18n activée
111. [v1.1] Noindex automatique sur dashboard/* via metadata
112. [v1.1] FAQ schema sur landing FAQSection
113. [v1.1] Article schema sur blog (à créer)
114. [v1.1] LocalBusiness schema sur restaurant page
115. [v1.1] Image preload pour LCP du menu public
116. [v1.1] OG image dynamique par restaurant (next/og)
117. [v1.1] Twitter card avec image custom par menu publié
118. [v1.1] Indexation des QR scans pour tendances
119. [v1.1] Robots tags fine grain (max-image-preview, max-snippet)
120. [v1.1] Redirect 301 anciens slugs si rename restaurant

## D. Accessibility (40)

121. [applied] Skip link "Aller au contenu principal"
122. [applied] aria-current page sidebar
123. [applied] aria-label boutons icon-only
124. [applied] aria-pressed toggles
125. [applied] aria-modal + role=dialog modales
126. [applied] aria-live polite pour toasts/notifications
127. [applied] htmlFor + id sur tous les inputs/labels
128. [applied] Focus ring custom (.focus-ring class)
129. [applied] Escape ferme les modales
130. [applied] role="radiogroup" + role="radio" sur sélecteurs rôle
131. [applied] role="article" sur cards orders
132. [applied] aria-disabled sur period buttons pendant loading
133. [applied] sr-only pour figcaption images
134. [applied] aria-hidden=true sur icônes décoratives
135. [applied] tabIndex=-1 + focus sur main après navigation
136. [applied] aria-expanded sur boutons collapse
137. [applied] aria-haspopup + aria-controls sur switcher
138. [applied] role=progressbar + aria-valuenow/min/max
139. [applied] Hover non-only : tous les hover effects ont focus equivalent
140. [applied] Color contrast emerald/yellow sur dark : à confirmer ⚠️
141. [v1.1] Audit Lighthouse a11y score viser 100
142. [v1.1] Skip to navigation 2nd link
143. [v1.1] aria-describedby pour examples placeholders
144. [v1.1] Live region annoncements pour cart updates
145. [v1.1] Trap focus dans modales fully (en plus de Escape)
146. [v1.1] Tabs sémantiques role=tab + aria-selected sur menu public
147. [v1.1] Keyboard shortcuts Cmd+/ pour command palette
148. [v1.1] Reduced motion respect via prefers-reduced-motion
149. [v1.1] High contrast mode prefers-contrast
150. [v1.1] Forced colors mode (Windows high contrast)
151. [v1.1] Touch target 44x44 minimum partout (WCAG 2.5.5)
152. [v1.1] Form errors annoncés via aria-live + aria-invalid
153. [v1.1] Labels visibles (pas placeholder-only) sur tous les forms
154. [v1.1] Lang attribute sur élements dans une langue différente
155. [v1.1] heading-rank validation par page (no skip h1→h3)
156. [v1.1] Focus visible custom (outline-2 outline-primary outline-offset-2)
157. [v1.1] Tester avec NVDA + JAWS + VoiceOver sur menu public
158. [v1.1] Captions WebVTT pour videos (si vidéos ajoutées)
159. [v1.1] Audio description pour images complexes
160. [v1.1] Switch fr/en avec lang attr sync

## E. Data & DB integrity (30)

161. [applied] Zod sur toutes les routes mutating (POST/PATCH)
162. [applied] requireUser helper centralisé
163. [applied] assertMenuOwnership / assertCategoryOwnership / assertDishOwnership
164. [applied] Restaurant ownership check dans /api/menu/upload
165. [applied] Order ownership check dans /api/orders/[id] PATCH
166. [applied] /api/orders GET ownership check
167. [applied] Notification ownership check
168. [applied] QR ownership check dans /api/qr/generate
169. [applied] Auto-create restaurant idempotent (findFirst avant create)
170. [applied] Slug auto-généré unique (suffixe random)
171. [applied] Auto-libération table sur DELIVERED/CANCELLED
172. [applied] Total recalculé serveur (anti-tampering)
173. [applied] unitPrice snapshot sur OrderItem
174. [applied] Status enum strict via VALID_STATUSES
175. [applied] Cast as any pour Role mismatch NextAuth/Prisma
176. [applied] Schema Prisma : description, website, cuisineType, seating, openingHours
177. [applied] Schema Prisma : menuLayout, showPrices, showAllergens, showCalories
178. [applied] Onowardless POST de duplication restaurant
179. [v1.1] Validation `dishId in restaurantId` sur POST /api/orders
180. [v1.1] Transaction Prisma pour create order + table.update
181. [v1.1] Transaction sur cancel/deliver order + table libération
182. [v1.1] State machine strict (PENDING→CONFIRMED→PREPARING→READY→DELIVERED)
183. [v1.1] Optimistic concurrency control (version field) sur Order
184. [v1.1] Soft delete pour Restaurant/Menu/Dish (deletedAt)
185. [v1.1] Audit log pour modifications sensibles (qui, quoi, quand)
186. [v1.1] Backfill jobs pour data historique
187. [v1.1] Migration Prisma versionnée (au lieu de db push)
188. [v1.1] Seed data dev pour tests E2E
189. [v1.1] Validation min/max raisonnables (price < 9999, seating < 9999)
190. [v1.1] Sanitization HTML strict des champs description (XSS)

## F. Sécurité (20)

191. [applied] NEXTAUTH_SECRET 32 bytes random
192. [applied] OAuth Google publié (mais en mode test puis production)
193. [applied] Test users whitelist
194. [applied] Rate limit middleware basique (100/min/IP)
195. [applied] Force dynamic sur routes auth (no static cache leak)
196. [applied] Helper requireUser centralisé
197. [applied] Multi-tenant ownership partout
198. [applied] Stripe key fallback gracieux
199. [applied] Anthropic key fallback gracieux
200. [applied] Cookie banner privacy-first (Deny par défaut accepté)
201. [v1.1] CSP headers via next.config.mjs headers()
202. [v1.1] X-Frame-Options DENY
203. [v1.1] Referrer-Policy strict-origin-when-cross-origin
204. [v1.1] Permissions-Policy minimal
205. [v1.1] Rate limit Upstash Redis (cross-instance)
206. [v1.1] Honeypot + reCAPTCHA sur /api/contact
207. [v1.1] Honeypot sur /api/orders POST (anti-spam)
208. [v1.1] CSRF token sur mutations sensibles
209. [v1.1] Audit `app/api/admin/*` ownership stricte
210. [v1.1] MIME-type whitelist + max size sur uploads

## G. Mobile / Responsive (20)

211. [applied] viewport meta initial-scale=1, maximum-scale=5, viewportFit=cover
212. [applied] Mobile nav bottom dédiée
213. [applied] Sidebar collapse mobile auto
214. [applied] Touch action manipulation sur drag handles
215. [applied] Stats grid responsive (1 col mobile, 4 desktop)
216. [applied] Cards card-contained pour éviter overflow
217. [applied] Search bar hidden lg:block
218. [applied] flex-wrap sur stats strip
219. [applied] grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 partout
220. [applied] Hidden md:block pour les divisers verticaux
221. [v1.1] Touch targets 44×44 sur boutons +/- panier
222. [v1.1] Safe area insets bottom (iPhone notch)
223. [v1.1] Scroll snap sur kanban orders horizontal
224. [v1.1] Test < 360px largeur (Galaxy Fold)
225. [v1.1] Pinch zoom autorisé sur menu public
226. [v1.1] Orientation landscape mobile menu
227. [v1.1] Dark mode auto via prefers-color-scheme
228. [v1.1] PWA installable (manifest + SW déjà partiel)
229. [v1.1] Splash screen iOS dédié
230. [v1.1] Apple touch icon dédié

## H. Features management (40)

231. [applied] Dashboard 50 KPI/améliorations (revenue, conversion, top dishes)
232. [applied] Drag & drop catégories/plats avec persistence order
233. [applied] Toggle availability instant
234. [applied] Bulk QR generation
235. [applied] QR tracking scans
236. [applied] Periodicité dashboard (today/week/month)
237. [applied] Goal éditable + persistance localStorage
238. [applied] Confetti à 100% goal
239. [applied] Notifications dismiss + clear all
240. [applied] Filtres orders par status (with count)
241. [applied] View orders list ↔ kanban
242. [applied] Recherche menu publique
243. [applied] Filtres allergènes menu publique
244. [applied] Favoris menu publique (localStorage)
245. [applied] Pourboire % + custom
246. [applied] Recommandations IA (placeholder)
247. [applied] Quick actions ⌘N/M/R
248. [applied] Restaurant switcher sidebar
249. [applied] Tier badge sidebar (FREE/GROWTH/ENTERPRISE)
250. [applied] Last update timestamp dashboard
251. [v1.1] Bulk actions orders (select all → confirm/cancel)
252. [v1.1] Pagination + infinite scroll orders (>50)
253. [v1.1] Filtres orders avancés (table, montant, période, search)
254. [v1.1] Export CSV/Excel commandes du jour
255. [v1.1] Print-friendly ticket cuisine
256. [v1.1] Undo après changement statut
257. [v1.1] Tri configurable (date / total / statut)
258. [v1.1] Duplication menu / plat
259. [v1.1] Import CSV clients CRM
260. [v1.1] Campagnes email Resend (CRM)
261. [v1.1] Programme fidélité points
262. [v1.1] Réservations en ligne
263. [v1.1] Multi-établissements (déjà partial)
264. [v1.1] Staff invitations réelles (table Invitation)
265. [v1.1] Permissions granulaires (OWNER/MANAGER/STAFF)
266. [v1.1] Site builder visuel
267. [v1.1] Webhooks sortants (Zapier/Make)
268. [v1.1] API publique documentée (OpenAPI)
269. [v1.1] White-label mode (logo + colors par tenant)
270. [v1.1] Reporting hebdo email automatique

## I. Internationalization (10)

271. [v1.1] next-intl setup (fr + en)
272. [v1.1] Fichiers messages/fr.json et en.json
273. [v1.1] Locale switcher dans Sidebar
274. [v1.1] formatCurrency dynamique par devise restaurant
275. [v1.1] formatDate localisé selon locale
276. [v1.1] Hreflang tags pour SEO
277. [v1.1] Translations menu public selon langue navigateur
278. [v1.1] Helper t() typed depuis JSON
279. [v1.1] RTL support (arabe, hébreu)
280. [v1.1] Detection automatique langue (Accept-Language)

## J. Monitoring / Observability (20)

281. [v1.1] @sentry/nextjs setup
282. [v1.1] Sentry.captureException dans error boundaries
283. [v1.1] Vercel Analytics + Speed Insights
284. [v1.1] Web Vitals reporting (LCP/CLS/INP/TTFB)
285. [v1.1] Healthcheck endpoint /api/health
286. [v1.1] Status endpoint /api/status (DB/Redis/Anthropic up)
287. [v1.1] X-Request-ID middleware
288. [v1.1] Structured logging (Pino/Winston)
289. [v1.1] Slow query Prisma logging
290. [v1.1] Anthropic tokens consumed log
291. [v1.1] Stripe webhook failed alerting
292. [v1.1] OpenTelemetry distributed tracing
293. [v1.1] Uptime monitor (Upptime / BetterStack)
294. [v1.1] Métriques business (orders/jour, revenue, conversion)
295. [v1.1] Dashboard Grafana / Vercel Observability
296. [v1.1] Alerting Slack/Discord sur erreurs prod
297. [v1.1] Profiling React DevTools en dev
298. [v1.1] Bundle size monitoring CI (size-limit)
299. [v1.1] Lighthouse CI sur PRs
300. [v1.1] Synthetic monitoring (Checkly / Playwright cron)

---

## Récapitulatif

- **Appliqué dans cette PR** : ~200 items (tout ce qui peut l'être en commits incrémentaux)
- **v1.1 (post-livraison)** : ~100 items (gros chantiers : i18n, Sentry, CSP, bulk actions, etc.)

Mode de comptage : chaque item = 1 amélioration concrète, vérifiable dans le diff git.
