import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/landing/CTAFooter";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Tableo",
  description: "Contactez l'équipe Tableo pour toute question technique, commerciale ou relative à vos données personnelles (RGPD). Formulaire de contact sécurisé.",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none min-h-screen bg-background pt-16">
        {/* Hero */}
        <div className="border-b border-border/50 bg-secondary/20 py-12">
          <div className="container mx-auto px-6 max-w-5xl">
            <nav aria-label="Fil d'Ariane" className="mb-4">
              <ol className="flex items-center gap-2 text-xs text-muted-foreground" role="list">
                <li><a href="/" className="hover:text-foreground focus-ring rounded transition-colors">Accueil</a></li>
                <li aria-hidden="true" className="select-none">›</li>
                <li aria-current="page" className="text-foreground font-medium">Contact</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-foreground">Nous contacter</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Une question, un problème technique, une demande commerciale ou relative à vos données personnelles ? Notre équipe répond sous 24 h ouvrées.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Coordonnées */}
            <aside aria-label="Coordonnées de KAYZEN LYON" className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl border border-border bg-gradient-card p-6 space-y-5">
                <h2 className="text-base font-semibold text-foreground">KAYZEN LYON</h2>
                <p className="text-xs text-muted-foreground">Éditeur du service Tableo</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-warm-subtle flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <address className="not-italic text-sm text-muted-foreground">
                      6, rue Pierre TERMIER<br />
                      69009 LYON — France
                    </address>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-warm-subtle flex items-center justify-center shrink-0" aria-hidden="true">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <a href="tel:+33487776861" className="text-sm text-muted-foreground hover:text-foreground focus-ring rounded transition-colors">
                      +33 (0)4 87 77 68 61
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-warm-subtle flex items-center justify-center shrink-0" aria-hidden="true">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <a href="mailto:contact@kayzen-lyon.fr" className="text-sm text-muted-foreground hover:text-foreground focus-ring rounded transition-colors">
                      contact@kayzen-lyon.fr
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-warm-subtle flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Horaires</p>
                      <p>Lun–Ven : 9h – 18h</p>
                      <p>Hors week-ends et jours fériés</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RGPD info */}
              <div className="rounded-2xl border border-primary/20 bg-gradient-warm-subtle p-5 space-y-2">
                <p className="text-sm font-semibold text-foreground">Droits RGPD</p>
                <p className="text-xs text-muted-foreground">
                  Pour toute demande relative à vos données personnelles (accès, rectification, effacement, portabilité, opposition), sélectionnez l'objet <strong>« Demande relative à mes données (RGPD) »</strong> dans le formulaire. Nous répondons sous 30 jours.
                </p>
              </div>
            </aside>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-gradient-card p-6 md:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6">Envoyer un message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
