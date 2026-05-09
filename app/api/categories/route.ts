import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, assertMenuOwnership } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  menuId: z.string(),
  name: z.string().min(1).max(80),
  description: z.string().optional().nullable(),
  order: z.number().int().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const data = createSchema.parse(await req.json());
    const own = await assertMenuOwnership(data.menuId, auth.userId);
    if ("error" in own) return own.error;

    // Auto-incrémente l'order si non fourni : place en fin de menu
    let order = data.order;
    if (order === undefined) {
      const max = await prisma.category.aggregate({
        where: { menuId: data.menuId },
        _max: { order: true },
      });
      order = (max._max.order ?? -1) + 1;
    }

    const category = await prisma.category.create({
      data: {
        menuId: data.menuId,
        name: data.name,
        description: data.description ?? null,
        order,
      },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
