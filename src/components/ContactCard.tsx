"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, MapPin, Star, Globe, Phone, Mail, User, ExternalLink } from "lucide-react";
import Link from "next/link";

const COMPANY = {
  name: "Tableo",
  company: "KAYZEN LYON",
  address: "6 rue Pierre Termier, 69009 Lyon, France",
  phone: "+33487776861",
  phoneFmt: "+33 (0)4 87 77 68 61",
  email: "contact@kayzen-lyon.fr",
  website: "https://tableo-sepia.vercel.app",
  agenceWeb: "https://internet.kayzen-lyon.fr",
  mapsUrl: "https://maps.google.com/?q=6+rue+Pierre+Termier+69009+Lyon+France",
  reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJ__example",
};

function buildVCard(): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${COMPANY.name}`,
    `ORG:${COMPANY.company}`,
    `TEL;TYPE=WORK,VOICE:${COMPANY.phone}`,
    `EMAIL;TYPE=WORK:${COMPANY.email}`,
    `URL:${COMPANY.website}`,
    `ADR;TYPE=WORK:;;6 rue Pierre Termier;Lyon;;69009;France`,
    `NOTE:Revenue Operating System pour restaurants. Service édité par KAYZEN LYON SASU - RCS Lyon 999 418 346`,
    "END:VCARD",
  ].join("\r\n");
}

function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tableo-contact.vcf";
  a.click();
  URL.revokeObjectURL(url);
}

type QRTab = "site" | "vcard" | "maps" | "avis";

const TABS: { id: QRTab; label: string; icon: React.ElementType; value: string; desc: string }[] = [
  { id: "site",  label: "Site web",      icon: Globe,   value: COMPANY.website,    desc: "Scanner pour visiter tableo.app" },
  { id: "vcard", label: "Contact",       icon: User,    value: `BEGIN:VCARD\nVERSION:3.0\nFN:${COMPANY.name}\nORG:${COMPANY.company}\nTEL:${COMPANY.phone}\nEMAIL:${COMPANY.email}\nURL:${COMPANY.website}\nEND:VCARD`, desc: "Scanner pour enregistrer le contact" },
  { id: "maps",  label: "Localisation",  icon: MapPin,  value: COMPANY.mapsUrl,    desc: "Scanner pour ouvrir dans Maps" },
  { id: "avis",  label: "Avis Google",   icon: Star,    value: COMPANY.reviewsUrl, desc: "Scanner pour laisser un avis" },
];

export function ContactCard({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<QRTab>("site");
  const active = TABS.find(t => t.id === activeTab)!;

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="rounded-[8px] bg-white p-3 shadow-sm">
          <QRCodeSVG
            value={COMPANY.website}
            size={100}
            bgColor="#ffffff"
            fgColor="#0070d1"
            level="M"
            aria-label="QR code du site Tableo"
          />
        </div>
        <p className="text-[11px] text-[#a8a8b3] text-center">Scanner pour visiter le site</p>
        <button
          onClick={downloadVCard}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0070d1] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#0082f0] transition-colors focus-ring"
        >
          <Download className="w-3 h-3" />
          Enregistrer le contact
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Carte identité */}
      <div className="rounded-[12px] bg-[#0070d1] p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} aria-hidden="true" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Tabléo</h2>
              <p className="text-white/70 text-[13px] mt-0.5">Revenue OS pour restaurants</p>
            </div>
            <div className="rounded-[8px] bg-white p-2">
              <QRCodeSVG
                value={COMPANY.website}
                size={56}
                bgColor="#ffffff"
                fgColor="#0070d1"
                level="M"
                aria-label="QR code du site Tableo"
              />
            </div>
          </div>
          <div className="space-y-2 text-[13px]">
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors focus-ring rounded group">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{COMPANY.phoneFmt}</span>
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors focus-ring rounded group">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{COMPANY.email}</span>
            </a>
            <a href={COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors focus-ring rounded group">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{COMPANY.address}</span>
            </a>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={downloadVCard}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#0070d1] px-4 py-2 text-[12px] font-bold hover:bg-white/90 transition-colors focus-ring"
            >
              <Download className="w-3.5 h-3.5" />
              Enregistrer le contact
            </button>
            <a
              href={COMPANY.agenceWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/30 px-4 py-2 text-[12px] font-medium text-white hover:border-white/60 transition-colors focus-ring"
            >
              <ExternalLink className="w-3 h-3" />
              Kayzen Web
            </a>
          </div>
        </div>
      </div>

      {/* QR codes tabs */}
      <div className="rounded-[12px] border border-[#e8eaed] dark:border-white/8 bg-white dark:bg-[#121314] overflow-hidden">
        {/* Tab nav */}
        <div className="flex border-b border-[#e8eaed] dark:border-white/8" role="tablist" aria-label="QR codes disponibles">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors focus-ring ${
                  activeTab === tab.id
                    ? "text-[#0070d1] border-b-2 border-[#0070d1]"
                    : "text-[#6b7280] dark:text-[#a8a8b3] hover:text-[#0a0a0a] dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* QR display */}
        <div
          id={`tabpanel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="flex flex-col items-center gap-4 p-8"
        >
          <div className="rounded-[8px] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
            <QRCodeSVG
              value={active.value}
              size={180}
              bgColor="#ffffff"
              fgColor="#0070d1"
              level="H"
              aria-label={`QR code — ${active.label}`}
            />
          </div>
          <p className="text-[13px] text-[#6b7280] dark:text-[#a8a8b3] text-center">{active.desc}</p>

          {active.id === "vcard" && (
            <button
              onClick={downloadVCard}
              className="inline-flex items-center gap-2 rounded-full bg-[#0070d1] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#0082f0] transition-colors focus-ring"
            >
              <Download className="w-4 h-4" />
              Télécharger la vCard (.vcf)
            </button>
          )}
          {(active.id === "maps" || active.id === "avis") && (
            <a
              href={active.value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#e8eaed] dark:border-white/10 px-5 py-2.5 text-[13px] font-medium text-[#0a0a0a] dark:text-white hover:border-[#0070d1]/40 hover:text-[#0070d1] transition-colors focus-ring"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir dans le navigateur
            </a>
          )}
        </div>
      </div>

      {/* Kayzen footer */}
      <p className="text-center text-[11px] text-[#9ca3af] mt-5">
        Service édité par{" "}
        <a href={COMPANY.agenceWeb} target="_blank" rel="noopener noreferrer" className="text-[#0070d1] hover:underline focus-ring rounded font-medium">
          Kayzen Web
        </a>{" "}
        · SASU RCS Lyon 999 418 346
      </p>
    </div>
  );
}
