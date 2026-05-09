import { NextRequest, NextResponse } from "next/server";
import { analyzeMenu, analyzeMenuFromFile } from "@/lib/anthropic";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";


export const dynamic = "force-dynamic";

/** Strip HTML tags and collapse whitespace for URL-sourced content. */
function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const formData = await req.formData();
    const restaurantId = formData.get("restaurantId") as string;
    const sourceType = (formData.get("sourceType") as string | null) ?? "text";

    if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

    // Sécurité : vérifier ownership avant tout
    const owns = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: auth.userId },
      select: { id: true },
    });
    if (!owns) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });

    let analysis;

    if (sourceType === "url") {
      const url = formData.get("url") as string;
      if (!url?.startsWith("http")) return NextResponse.json({ error: "URL invalide" }, { status: 400 });
      const html = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Tableo/1.0)" } }).then((r) => r.text());
      const textContent = extractTextFromHtml(html);
      if (textContent.length < 20) return NextResponse.json({ error: "Contenu de la page trop court ou inaccessible" }, { status: 400 });
      analysis = await analyzeMenu(textContent);

    } else if (sourceType === "pdf" || sourceType === "image") {
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      analysis = await analyzeMenuFromFile(base64, file.type, sourceType);

    } else {
      // text (default)
      const text = formData.get("text") as string | null;
      const file = formData.get("file") as File | null;
      let menuContent = text || "";
      if (file?.type === "text/plain") menuContent = await file.text();
      if (!menuContent.trim()) {
        menuContent = "Génère un menu restaurant français avec 4 catégories (Entrées, Plats, Desserts, Boissons) et 3 plats chacune.";
      }
      analysis = await analyzeMenu(menuContent);
    }

    const menu = await prisma.menu.create({
      data: {
        restaurantId,
        name: "Menu principal",
        categories: {
          create: analysis.categories.map((cat, i) => ({
            name: cat.name,
            order: i,
            dishes: {
              create: cat.dishes.map((d, j) => ({
                name: d.name,
                description: d.description,
                price: d.price,
                allergens: d.allergens,
                labels: d.labels as any,
                order: j,
              })),
            },
          })),
        },
      },
      include: { categories: { include: { dishes: true } } },
    });

    if (analysis.restaurantName) {
      await prisma.restaurant.update({ where: { id: restaurantId }, data: { name: analysis.restaurantName } });
    }

    const totalDishes = menu.categories.reduce((s, c) => s + c.dishes.length, 0);
    return NextResponse.json({ menu, analysis, totalDishes });
  } catch (err: any) {
    console.error("[MENU_UPLOAD]", err);
    // Si Anthropic n'est pas configuré, on renvoie un message clair
    const msg = err?.message?.includes("ANTHROPIC_API_KEY")
      ? "Service IA non configuré (ANTHROPIC_API_KEY manquante)."
      : "Erreur lors de l'analyse IA";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
