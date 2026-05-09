import { NextRequest, NextResponse } from "next/server";
import { analyzeMenu } from "@/lib/anthropic";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";


export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const restaurantId = formData.get("restaurantId") as string;
    const text = formData.get("text") as string | null;

    if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

    // Sécurité : vérifier ownership avant tout
    const owns = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: auth.userId },
      select: { id: true },
    });
    if (!owns) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });

    let menuContent = text || "";
    if (file) {
      menuContent = file.type === "text/plain"
        ? await file.text()
        : "Génère un menu restaurant professionnel avec 4 catégories et 3 plats chacune.";
    }
    if (!menuContent.trim()) {
      menuContent = "Génère un menu restaurant français avec 4 catégories (Entrées, Plats, Desserts, Boissons) et 3 plats chacune.";
    }

    const analysis = await analyzeMenu(menuContent);

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
