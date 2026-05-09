import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"] as const;

const schema = z.object({
  ids: z.array(z.string()).min(1).max(100),
  status: z.enum(VALID_STATUSES),
});

/**
 * Action bulk sur plusieurs commandes (advance status, cancel, etc.).
 * Verifie l'ownership de chaque order.
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const { ids, status } = schema.parse(await req.json());

    // Filtre les ids appartenant au user
    const ownedOrders = await prisma.order.findMany({
      where: {
        id: { in: ids },
        restaurant: { ownerId: auth.userId },
      },
      select: { id: true, tableId: true },
    });

    if (ownedOrders.length === 0) {
      return NextResponse.json({ updated: 0, skipped: ids.length });
    }

    const updated = await prisma.order.updateMany({
      where: { id: { in: ownedOrders.map((o) => o.id) } },
      data: { status },
    });

    // Auto-libere les tables si DELIVERED/CANCELLED
    if (status === "DELIVERED" || status === "CANCELLED") {
      const tableIds = [...new Set(ownedOrders.map((o) => o.tableId).filter(Boolean) as string[])];
      for (const tid of tableIds) {
        const remaining = await prisma.order.count({
          where: { tableId: tid, status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] } },
        });
        if (remaining === 0) {
          await prisma.table.update({ where: { id: tid }, data: { status: "IDLE" } });
        }
      }
    }

    return NextResponse.json({
      updated: updated.count,
      skipped: ids.length - updated.count,
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
    console.error("[orders/bulk]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
