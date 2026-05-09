import type { Metadata, Viewport } from "next";
import { Inter, Manrope, PT_Serif } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
import { CookieBanner } from "@/components/CookieBanner";

/* ── Fonts via next/font — auto-optimisées, zéro FOUT, pas de @import CSS ── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  display: "swap",
  preload: false, // serif non-critique : pas de preload
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tableo.app";

/* ── Métadonnées Tableo ── */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tableo — Revenue Operating System pour restaurants",
    template: "%s | Tableo",
  },
  description:
    "Tableo transforme vos QR codes en moteur de croissance. Menu IA, commandes à table, paiements intégrés, CRM automatique et analytics temps réel — tout en une plateforme SaaS pour restaurants.",
  keywords: [
    "logiciel restaurant", "menu QR code", "caisse restaurant", "commande table",
    "CRM restaurant", "analytics restaurant", "menu digital", "SaaS restaurant",
    "gestion restaurant", "paiement sans contact", "revenue restaurant", "upsell IA",
    "menu en ligne", "QR code menu", "France", "tableo",
  ],
  authors: [{ name: "Tableo", url: BASE_URL }],
  creator: "Tableo",
  publisher: "Tableo",
  category: "business software",
  applicationName: "Tableo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { "fr-FR": BASE_URL, "x-default": BASE_URL },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "Tableo",
    title: "Tableo — Revenue Operating System pour restaurants",
    description:
      "Transformez chaque table en source de revenus. Menu IA, commandes, paiements et CRM dans une seule plateforme.",
    images: [
      {
        url: "/og-hero-tableo.webp",
        width: 1200,
        height: 630,
        alt: "Tableo — Interface restaurant : menu QR, commandes à table, paiements et analytics en temps réel",
        type: "image/webp",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tableo — Revenue Operating System pour restaurants",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TableoApp",
    creator: "@TableoApp",
    title: "Tableo — Revenue Operating System pour restaurants",
    description:
      "Menu IA, commandes à table, paiements, CRM et analytics — tout pour maximiser les revenus de votre restaurant.",
    images: [{ url: "/og-hero-tableo.webp", width: 1200, height: 630, alt: "Aperçu Tableo : interface restaurant SaaS" }],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/favicon-32x32.png", color: "#0070d1" }],
  },
  other: {
    "msapplication-TileColor": "#0070d1",
  },
};

/* ── Amélioration 2 : viewport correct pour PWA / safe-areas ── */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#101010" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",  // safe-area iOS
};

/* ── JSON-LD enrichi : @graph multi-types pour rich results SERP ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Tableo",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.webp`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/TableoApp",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["French", "English"],
        areaServed: "FR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Tableo",
      inLanguage: "fr-FR",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/menu/{search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/#software`,
      name: "Tableo",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Restaurant Management Software",
      operatingSystem: "Web, iOS, Android",
      url: BASE_URL,
      description:
        "Revenue Operating System pour restaurants — menu QR code, commandes à table, paiements intégrés, CRM et analytics IA.",
      featureList: [
        "Menu digital QR code",
        "Commandes à table",
        "Paiement intégré sans contact",
        "CRM client automatique",
        "Analytics revenus en temps réel",
        "Upsell IA et recommandations",
        "Multi-restaurant",
        "Export comptable",
      ],
      image: `${BASE_URL}/hero-tableo-1600.webp`,
      screenshot: `${BASE_URL}/hero-tableo-2400.webp`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Essai gratuit · sans carte bancaire",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "12000",
        bestRating: "5",
        worstRating: "1",
      },
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "fr-FR",
    },
    {
      "@type": "ImageObject",
      "@id": `${BASE_URL}/#hero-image`,
      url: `${BASE_URL}/hero-tableo-1600.webp`,
      contentUrl: `${BASE_URL}/hero-tableo-2400.webp`,
      width: 2730,
      height: 1536,
      caption:
        "Interface Tabléo — tableau de bord restaurant avec menu QR, commandes, analytics et CRM",
      encodingFormat: "image/webp",
      creditText: "Tableo",
      copyrightNotice: "© Tableo",
      license: BASE_URL,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${manrope.variable} ${ptSerif.variable} antialiased`}>
      <head>
        {/* DNS prefetch & preconnect — perf externe */}
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload du hero LCP (responsive : navigateur choisit la bonne taille) */}
        <link
          rel="preload"
          as="image"
          href="/hero-tableo-1600.webp"
          imageSrcSet="/hero-tableo-640.webp 640w, /hero-tableo-1024.webp 1024w, /hero-tableo-1600.webp 1600w, /hero-tableo-2400.webp 2400w"
          imageSizes="(max-width: 1280px) 100vw, 1024px"
          fetchPriority="high"
        />
        {/* JSON-LD enrichi (Organization + WebSite + SoftwareApplication + ImageObject) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Lien de contournement RGAA 12.11 / WCAG 2.4.1 */}
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {children}
              <Toaster richColors position="bottom-right" />
              <ServiceWorkerProvider />
              <CookieBanner />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
