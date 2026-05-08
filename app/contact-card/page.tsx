import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/landing/CTAFooter";
import { ContactCard } from "@/components/ContactCard";

export const metadata: Metadata = {
  title: "Carte de contact — Tableo",
  description: "Carte de contact numérique Tableo par KAYZEN LYON. QR codes : site web, coordonnées (vCard), localisation Maps et avis Google.",
  robots: { index: true, follow: true },
};

export default function ContactCardPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none min-h-screen bg-[#f5f7fa] dark:bg-[#0a0a0a] pt-[60px]">
        <div className="border-b border-[#e8eaed] dark:border-white/8 bg-white dark:bg-[#000] py-10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <nav aria-label="Fil d'Ariane" className="mb-4 flex justify-center">
              <ol className="flex items-center gap-2 text-[11px] text-[#6b7280]" role="list">
                <li><a href="/" className="hover:text-[#0a0a0a] dark:hover:text-white focus-ring rounded transition-colors">Accueil</a></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-[#0a0a0a] dark:text-white font-medium">Carte de contact</li>
              </ol>
            </nav>
            <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-light tracking-tight text-[#0a0a0a] dark:text-white">
              Carte de contact numérique
            </h1>
            <p className="mt-2 text-[14px] text-[#6b7280] dark:text-[#a8a8b3]">
              Scannez les QR codes ou téléchargez nos coordonnées
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 max-w-lg">
          <ContactCard />
        </div>
      </main>
      <Footer />
    </>
  );
}
