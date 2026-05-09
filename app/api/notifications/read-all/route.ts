import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * Marque toutes les notifications de l'user (et optionnellement d'un restaurant)
 * comme lues.
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const { restaurantId } = body as { restaurantId?: string };

  // Si restaurantId fourni, on vérifie ownership
  if (restaurantId) {
    const owns = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: auth.userId },
      select: { id: true },
    });
    if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await prisma.notification.updateMany({
    where: {
      read: false,
      OR: [
        { userId: auth.userId },
        ...(restaurantId
          ? [{ restaurantId }]
          : [{ restaurant: { ownerId: auth.userId } }]),
      ],
    },
    data: { read: true },
  });
  return NextResponse.json({ marked: result.count });
}
