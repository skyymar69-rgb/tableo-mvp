import { Check, X, Minus, Crown } from "lucide-react";

type Status = "yes" | "no" | "partial";
const StatusIcon = ({ s }: { s: Status }) =>
  s === "yes" ? <Check className="w-4 h-4 text-primary" /> :
  s === "no" ? <X className="w-4 h-4 text-muted-foreground/30" /> :
  <Minus className="w-4 h-4 text-muted-foreground/50" />;

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
  <section className="py-24 md:py-32 border-t border-border/50">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm font-semibold text-accent mb-3 tracking-wide uppercase">Comparaison</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Tableo vs les alternatives
        </h2>
        <p className="mt-4 text-muted-foreground">Pas dans la même catégorie.</p>
      </div>

      {/* #49 — Table sémantique WCAG 1.3.1 : <table>, <caption>, scope, <thead> */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-border overflow-hidden">
        <table className="w-full border-collapse text-sm" aria-label="Comparaison des fonctionnalités Tableo vs NordQR">
          <caption className="sr-only">Tableau comparatif des fonctionnalités : Tableo vs NordQR</caption>
          <thead>
            <tr className="bg-secondary/50">
              <th scope="col" className="text-left px-6 py-4 font-semibold text-foreground w-[60%]">
                Fonctionnalité
              </th>
              <th scope="col" className="px-4 py-4 text-center font-semibold w-[20%]">
                <span className="text-gradient-warm inline-flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  Tableo
                </span>
              </th>
              <th scope="col" className="px-4 py-4 text-center font-semibold text-muted-foreground w-[20%]">
                NordQR
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.feature} className={`row-hover ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"}`}>
                <td className="px-6 py-3.5 text-muted-foreground">{r.feature}</td>
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
            <tr className="bg-gradient-warm-subtle border-t border-border">
              <th scope="row" className="px-6 py-4 font-semibold text-foreground text-left">Score total</th>
              <td className="px-4 py-4 text-center font-bold text-gradient-warm text-lg">12/12</td>
              <td className="px-4 py-4 text-center font-bold text-muted-foreground text-lg">3/12</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
