import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, assertMenuOwnership } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const own = await assertMenuOwnership(params.id, auth.userId);
  if ("error" in own) return own.error;

  try {
    const data = patchSchema.parse(await req.json());
    const menu = await prisma.menu.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isPublished !== undefined && {
          isPublished: data.isPublished,
          publishedAt: data.isPublished ? new Date() : null,
        }),
      },
    });
    return NextResponse.json({ menu });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const own = await assertMenuOwnership(params.id, auth.userId);
  if ("error" in own) return own.error;

  await prisma.menu.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
