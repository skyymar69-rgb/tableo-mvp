import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = "C:/Users/Kayzen/Desktop/tabléo";
const OUT_DIR = resolve(__dirname, "../public/illustrations");
mkdirSync(OUT_DIR, { recursive: true });

/* Mapping nom Gemini → slug sémantique pour l'usage en landing */
const items = [
  { src: "Gemini_Generated_Image_m2z37om2z37om2z3.png", slug: "menu-ia-multilingue", caption: "Menu IA multilingue — smartphone" },
  { src: "Gemini_Generated_Image_sf995csf995csf99.png", slug: "qr-croissance",       caption: "QR code restaurant — moteur de croissance" },
  { src: "Gemini_Generated_Image_ov71n2ov71n2ov71.png", slug: "paiement-integre",    caption: "Paiement intégré sans contact" },
  { src: "Gemini_Generated_Image_a1pgsla1pgsla1pg.png", slug: "analytics-dashboard", caption: "Tableau de bord performance restaurant" },
  { src: "Gemini_Generated_Image_w0pzufw0pzufw0pz.png", slug: "integrations",        caption: "Intégrations et écosystème" },
  { src: "Gemini_Generated_Image_g8fskcg8fskcg8fs.png", slug: "support-ai",          caption: "Support IA et accompagnement" },
];

const sizes = [
  { w: 640,  q: 80 },
  { w: 1024, q: 82 },
];

for (const it of items) {
  const srcPath = resolve(SRC_DIR, it.src);
  const meta = await sharp(srcPath).metadata();
  const srcKb = (statSync(srcPath).size / 1024).toFixed(0);
  console.log(`\n${it.slug}: ${meta.width}×${meta.height}, ${srcKb} KB`);

  for (const s of sizes) {
    const target = resolve(OUT_DIR, `${it.slug}-${s.w}.webp`);
    await sharp(srcPath)
      .resize({ width: s.w, withoutEnlargement: true })
      .webp({ quality: s.q, effort: 6, smartSubsample: true })
      .toFile(target);
    console.log(`  → ${it.slug}-${s.w}.webp: ${(statSync(target).size / 1024).toFixed(0)} KB`);
  }

  // AVIF version 1024w pour navigateurs modernes
  const avifTarget = resolve(OUT_DIR, `${it.slug}-1024.avif`);
  await sharp(srcPath)
    .resize({ width: 1024, withoutEnlargement: true })
    .avif({ quality: 60, effort: 6 })
    .toFile(avifTarget);
  console.log(`  → ${it.slug}-1024.avif: ${(statSync(avifTarget).size / 1024).toFixed(0)} KB`);
}
