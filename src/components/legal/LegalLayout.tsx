import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/landing/CTAFooter";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none min-h-screen bg-background pt-16">
        {/* Hero */}
        <div className="border-b border-border/50 bg-secondary/20 py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav aria-label="Fil d'Ariane" className="mb-4">
              <ol className="flex items-center gap-2 text-xs text-muted-foreground" role="list">
                <li><Link href="/" className="hover:text-foreground focus-ring rounded transition-colors">Accueil</Link></li>
                <li aria-hidden="true" className="select-none">›</li>
                <li aria-current="page" className="text-foreground font-medium">{title}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Dernière mise à jour : <time dateTime={lastUpdated}>{new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(lastUpdated))}</time>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="legal-content space-y-8 text-sm text-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* Composants typographiques réutilisables */
export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-xl font-bold text-foreground border-b border-border pb-2">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export function LegalSubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 pl-4 border-l-2 border-border">
      <h3 id={id} className="text-base font-semibold text-foreground">{title}</h3>
      <div className="space-y-2 text-muted-foreground">{children}</div>
    </div>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-4">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export function LegalTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead className="bg-secondary/50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 text-left font-semibold text-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-secondary/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-muted-foreground">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
