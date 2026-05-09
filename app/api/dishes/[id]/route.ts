import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, assertDishOwnership } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const DISH_LABELS = [
  "BESTSELLER", "NEW", "VEGAN", "VEGETARIAN",
  "SPICY", "GLUTEN_FREE", "CHEF_SPECIAL", "PROMO",
] as const;

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().nullable().optional(),
  calories: z.number().int().positive().nullable().optional(),
  allergens: z.array(z.string()).optional(),
  labels: z.array(z.enum(DISH_LABELS)).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  categoryId: z.string().optional(),  // déplacement entre catégories
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const own = await assertDishOwnership(params.id, auth.userId);
  if ("error" in own) return own.error;

  try {
    const data = patchSchema.parse(await req.json());
    // Si déplacement de catégorie, valider l'ownership de la nouvelle catégorie
    if (data.categoryId && data.categoryId !== own.dish.categoryId) {
      const { assertCategoryOwnership } = await import("@/lib/api-helpers");
      const catCheck = await assertCategoryOwnership(data.categoryId, auth.userId);
      if ("error" in catCheck) return catCheck.error;
    }

    const dish = await prisma.dish.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.calories !== undefined && { calories: data.calories }),
        ...(data.allergens !== undefined && { allergens: data.allergens }),
        ...(data.labels !== undefined && { labels: data.labels }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.categoryId && { categoryId: data.categoryId }),
      },
    });
    return NextResponse.json({ dish });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides", issues: err.issues }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const own = await assertDishOwnership(params.id, auth.userId);
  if ("error" in own) return own.error;

  await prisma.dish.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
