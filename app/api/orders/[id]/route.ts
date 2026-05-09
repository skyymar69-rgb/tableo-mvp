import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Sécurité : vérifier que la commande appartient à un restaurant du user
  const order = await prisma.order.findFirst({
    where: { id: params.id, restaurant: { ownerId: auth.userId } },
    select: { id: true, tableId: true, status: true },
  });
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });

  // Auto-libère la table si la commande est livrée ou annulée
  if (order.tableId && (status === "DELIVERED" || status === "CANCELLED")) {
    const remainingActive = await prisma.order.count({
      where: { tableId: order.tableId, status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] } },
    });
    if (remainingActive === 0) {
      await prisma.table.update({ where: { id: order.tableId }, data: { status: "IDLE" } });
    }
  }

  return NextResponse.json({ order: updated });
}
