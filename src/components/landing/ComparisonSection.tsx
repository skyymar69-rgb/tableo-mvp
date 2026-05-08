import { Check, X, Minus, Crown } from "lucide-react";

type Status = "yes" | "no" | "partial";
const StatusIcon = ({ s }: { s: Status }) =>
  s === "yes" ? <Check className="w-4 h-4 text-[#111111]" /> :
  s === "no" ? <X className="w-4 h-4 text-[#e5e7eb]" /> :
  <Minus className="w-4 h-4 text-[#6b7280]" />;

const rows: { feature: string; tableo: Status; nordqr: Status }[] = [
  { feature: "Menu QR dynamique", tableo: "yes", nordqr: "yes" },
  { feature: "Menu IA (depuis PDF/image)", tableo: "yes", nordqr: "no" },
  { feature: "Traduction IA temps réel", tableo: "yes", nordqr: "partial" },
  { feature: "Commande à table", tableo: "yes", nordqr: "no" },
  { feature: "Paiement intégré (Apple Pay, Stripe)", tableo: "yes", nordqr: "no" },
  { feature: "CRM automatique", tableo: "yes", nordqr: "no" },
  { feature: "Revenue Engine (upsell IA)", tableo: "yes", nordqr: "no" },
  { feature: "Analytics temps réel", tableo: "yes", nordqr: "partial" },
  { feature: "Multi-établissements", tableo: "yes", nordqr: "partial" },
  { feature: "Site web auto-généré", tableo: "yes", nordqr: "no" },
  { feature: "Conformité RGPD complète", tableo: "yes", nordqr: "partial" },
  { feature: "API ouverte", tableo: "yes", nordqr: "no" },
];

const ComparisonSection = () => (
  <section className="py-24 md:py-32 bg-[#f5f5f5]">
    <div className="container mx-auto px-6 max-w-[1200px]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-[11px] font-semibold text-[#6b7280] mb-3 tracking-widest uppercase">Comparaison</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-semibold tracking-[-0.03em] text-[#111111]">
          Tableo vs les alternatives
        </h2>
        <p className="mt-4 text-[#374151] text-[15px]">Pas dans la même catégorie.</p>
      </div>

      <div className="max-w-3xl mx-auto rounded-[12px] border border-[#e5e7eb] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <table className="w-full border-collapse text-[13px]" aria-label="Comparaison des fonctionnalités Tableo vs NordQR">
          <caption className="sr-only">Tableau comparatif des fonctionnalités : Tableo vs NordQR</caption>
          <thead>
            <tr className="bg-[#f5f5f5]">
              <th scope="col" className="text-left px-6 py-4 font-semibold text-[#111111] w-[60%]">
                Fonctionnalité
              </th>
              <th scope="col" className="px-4 py-4 text-center font-semibold w-[20%]">
                <span className="text-[#111111] inline-flex items-center gap-1 justify-center">
                  <Crown className="w-3.5 h-3.5" aria-hidden="true" />
                  Tableo
                </span>
              </th>
              <th scope="col" className="px-4 py-4 text-center font-semibold text-[#6b7280] w-[20%]">
                NordQR
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.feature} className={`border-t border-[#f3f4f6] hover:bg-[#f8f9fa] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                <td className="px-6 py-3.5 text-[#374151]">{r.feature}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className="flex justify-center">
                    <StatusIcon s={r.tableo} />
                    <span className="sr-only">{r.tableo === "yes" ? "Oui" : r.tableo === "no" ? "Non" : "Partiel"}</span>
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="flex justify-center">
                    <StatusIcon s={r.nordqr} />
                    <span className="sr-only">{r.nordqr === "yes" ? "Oui" : r.nordqr === "no" ? "Non" : "Partiel"}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#e5e7eb] bg-[#f5f5f5]">
              <th scope="row" className="px-6 py-4 font-semibold text-[#111111] text-left text-[13px]">Score total</th>
              <td className="px-4 py-4 text-center font-display font-bold text-[#111111] text-[18px]">12/12</td>
              <td className="px-4 py-4 text-center font-display font-bold text-[#6b7280] text-[18px]">3/12</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
