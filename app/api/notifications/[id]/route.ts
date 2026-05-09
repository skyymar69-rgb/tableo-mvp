import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const { read } = body as { read?: boolean };

  // Vérifie ownership
  const notif = await prisma.notification.findFirst({
    where: {
      id: params.id,
      OR: [
        { userId: auth.userId },
        { restaurant: { ownerId: auth.userId } },
      ],
    },
    select: { id: true },
  });
  if (!notif) return NextResponse.json({ error: "Notification introuvable" }, { status: 404 });

  const updated = await prisma.notification.update({
    where: { id: params.id },
    data: { read: read ?? true },
  });
  return NextResponse.json({ notification: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const notif = await prisma.notification.findFirst({
    where: {
      id: params.id,
      OR: [
        { userId: auth.userId },
        { restaurant: { ownerId: auth.userId } },
      ],
    },
    select: { id: true },
  });
  if (!notif) return NextResponse.json({ error: "Notification introuvable" }, { status: 404 });

  await prisma.notification.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
