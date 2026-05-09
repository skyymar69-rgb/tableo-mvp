import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";


export const dynamic = "force-dynamic";
const VALID_STATUSES = ["IDLE", "OCCUPIED", "RESERVED", "CLEANING"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { id } = params;
  const body = await req.json();
  const { status, capacity, number, floor } = body;

  const table = await prisma.table.findFirst({
    where: { id },
    include: { restaurant: { select: { ownerId: true } } },
  });
  if (!table || table.restaurant.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.table.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(capacity && { capacity }),
      ...(number && { number }),
      ...(floor !== undefined && { floor }),
    },
  });

  return NextResponse.json({ table: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { id } = params;

  const table = await prisma.table.findFirst({
    where: { id },
    include: { restaurant: { select: { ownerId: true } } },
  });
  if (!table || table.restaurant.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.table.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
