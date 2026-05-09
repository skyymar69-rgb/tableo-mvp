import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = "C:/Users/Kayzen/Desktop/tabléo/Hero-Tabléo.webp";
const OUT_DIR = resolve(__dirname, "../public");
mkdirSync(OUT_DIR, { recursive: true });

const sizes = [
  { w: 640,  name: "hero-tableo-640.webp",  q: 78 },
  { w: 1024, name: "hero-tableo-1024.webp", q: 80 },
  { w: 1600, name: "hero-tableo-1600.webp", q: 82 },
  { w: 2400, name: "hero-tableo-2400.webp", q: 82 },
];

const meta = await sharp(SRC).metadata();
console.log(`Source: ${meta.width}×${meta.height}, ${(statSync(SRC).size / 1024).toFixed(0)} KB`);

for (const s of sizes) {
  const target = resolve(OUT_DIR, s.name);
  await sharp(SRC)
    .resize({ width: s.w, withoutEnlargement: true })
    .webp({ quality: s.q, effort: 6, smartSubsample: true })
    .toFile(target);
  const size = statSync(target).size / 1024;
  console.log(`  → ${s.name} (${s.w}px, q=${s.q}): ${size.toFixed(0)} KB`);
}

// Aussi un PNG fallback léger pour social previews + un AVIF moderne
await sharp(SRC)
  .resize({ width: 1600, withoutEnlargement: true })
  .avif({ quality: 60, effort: 6 })
  .toFile(resolve(OUT_DIR, "hero-tableo-1600.avif"));
console.log("  → hero-tableo-1600.avif: " + (statSync(resolve(OUT_DIR, "hero-tableo-1600.avif")).size / 1024).toFixed(0) + " KB");

// Hero principal "canonical" pour OG et fallback
await sharp(SRC)
  .resize({ width: 1200, height: 630, fit: "cover", position: "center" })
  .webp({ quality: 85, effort: 6 })
  .toFile(resolve(OUT_DIR, "og-hero-tableo.webp"));
console.log("  → og-hero-tableo.webp (1200×630)");
