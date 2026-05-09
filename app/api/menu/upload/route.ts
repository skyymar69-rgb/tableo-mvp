import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeMenu } from "@/lib/anthropic";
import { prisma } from "@/lib/db";


export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const restaurantId = formData.get("restaurantId") as string;
    const text = formData.get("text") as string | null;

    if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

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

    return NextResponse.json({ menu, analysis });
  } catch (err) {
    console.error("[MENU_UPLOAD]", err);
    return NextResponse.json({ error: "Erreur lors de l'analyse IA" }, { status: 500 });
  }
}
