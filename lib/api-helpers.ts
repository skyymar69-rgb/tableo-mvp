import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./db";

/** Renvoie userId ou un NextResponse 401 prêt à être returned. */
export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) } as const;
  }
  return { userId: (session.user as any).id as string, session } as const;
}

/** Vérifie que le menu appartient bien au user (via restaurant.ownerId). */
export async function assertMenuOwnership(menuId: string, userId: string) {
  const menu = await prisma.menu.findFirst({
    where: { id: menuId, restaurant: { ownerId: userId } },
    select: { id: true, restaurantId: true },
  });
  if (!menu) return { error: NextResponse.json({ error: "Menu introuvable" }, { status: 404 }) } as const;
  return { menu } as const;
}

/** Vérifie que la categorie appartient au user. */
export async function assertCategoryOwnership(categoryId: string, userId: string) {
  const cat = await prisma.category.findFirst({
    where: { id: categoryId, menu: { restaurant: { ownerId: userId } } },
    select: { id: true, menuId: true },
  });
  if (!cat) return { error: NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 }) } as const;
  return { category: cat } as const;
}

/** Vérifie que le plat appartient au user. */
export async function assertDishOwnership(dishId: string, userId: string) {
  const dish = await prisma.dish.findFirst({
    where: { id: dishId, category: { menu: { restaurant: { ownerId: userId } } } },
    select: { id: true, categoryId: true },
  });
  if (!dish) return { error: NextResponse.json({ error: "Plat introuvable" }, { status: 404 }) } as const;
  return { dish } as const;
}
