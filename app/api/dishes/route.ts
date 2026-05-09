import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, assertCategoryOwnership } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const DISH_LABELS = [
  "BESTSELLER", "NEW", "VEGAN", "VEGETARIAN",
  "SPICY", "GLUTEN_FREE", "CHEF_SPECIAL", "PROMO",
] as const;

const createSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1).max(120),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  imageUrl: z.string().url().optional().nullable(),
  calories: z.number().int().positive().optional().nullable(),
  allergens: z.array(z.string()).optional(),
  labels: z.array(z.enum(DISH_LABELS)).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const data = createSchema.parse(await req.json());
    const own = await assertCategoryOwnership(data.categoryId, auth.userId);
    if ("error" in own) return own.error;

    let order = data.order;
    if (order === undefined) {
      const max = await prisma.dish.aggregate({
        where: { categoryId: data.categoryId },
        _max: { order: true },
      });
      order = (max._max.order ?? -1) + 1;
    }

    const dish = await prisma.dish.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        imageUrl: data.imageUrl ?? null,
        calories: data.calories ?? null,
        allergens: data.allergens ?? [],
        labels: data.labels ?? [],
        isAvailable: data.isAvailable ?? true,
        isFeatured: data.isFeatured ?? false,
        order,
      },
    });
    return NextResponse.json({ dish }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides", issues: err.issues }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
