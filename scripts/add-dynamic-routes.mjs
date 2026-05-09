/**
 * Ajoute `export const dynamic = "force-dynamic"` à toutes les API routes
 * qui utilisent headers/cookies/searchParams/getServerSession.
 * Évite le warning Next.js "Dynamic server usage couldn't be rendered statically".
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "app/api");
const NEEDLES = /\b(headers\(|cookies\(|getServerSession|request\.nextUrl|req\.nextUrl|searchParams|new URL\(req)/;
const DIRECTIVE = `export const dynamic = "force-dynamic";`;

let added = 0, skipped = 0, untouched = 0;

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const st = statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!f.endsWith("route.ts") && !f.endsWith("route.tsx")) continue;

    const src = readFileSync(p, "utf8");

    if (src.includes("export const dynamic")) { skipped++; continue; }
    if (!NEEDLES.test(src)) { untouched++; continue; }

    // Insère après les imports : trouve la dernière ligne import
    const lines = src.split("\n");
    let insertIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.startsWith("import ") || t.startsWith("import{") || (t === "" && insertIdx > 0 && lines[i-1].trim().startsWith("import"))) {
        insertIdx = i + 1;
      } else if (t && !t.startsWith("//") && !t.startsWith("/*") && !t.startsWith("*")) {
        break;
      }
    }
    lines.splice(insertIdx, 0, "", DIRECTIVE);
    writeFileSync(p, lines.join("\n"));
    console.log(`+ ${p.replace(ROOT, "app/api")}`);
    added++;
  }
}

walk(ROOT);
console.log(`\nDone : +${added} ajoutés · ${skipped} déjà ok · ${untouched} sans besoin (statiques)`);
