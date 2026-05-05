import type { Metadata, Viewport } from "next";
import { Inter, Outfit, PT_Serif } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tableo app" }],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/favicon-32x32.png", color: "#001e40" }],
  },
  other: {
    "msapplication-TileColor": "#001e40",
  },
};

/* ── Amélioration 2 : viewport correct pour PWA / safe-areas ── */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#080d20" },
    { media: "(prefers-color-scheme: light)", color: "#fcf8fb" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",  // safe-area iOS
};

/* ── Amélioration 3 : JSON-LD SoftwareApplication (SEO rich results) ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tableo",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  url: BASE_URL,
  description:
    "Revenue Operating System pour restaurants — menu QR code, commandes, paiements et CRM.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Essai gratuit disponible",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "12000",
    bestRating: "5",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${ptSerif.variable}`}>
      <head>
        {/* Amélioration 4 : DNS prefetch pour perf externe */}
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Amélioration 5 : JSON-LD schema.org */}
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
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
            <Toaster richColors position="bottom-right" />
            <ServiceWorkerProvider />
            <CookieBanner />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
