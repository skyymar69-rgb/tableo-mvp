import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateAIInsights } from "@/lib/anthropic";
import { prisma } from "@/lib/db";
import { subDays } from "date-fns";


export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });

  const weekAgo = subDays(new Date(), 7);

  const topDishesRaw = await prisma.orderItem.groupBy({
    by: ["dishId"],
    where: { order: { restaurantId, createdAt: { gte: weekAgo } } },
    _sum: { quantity: true, unitPrice: true },
    _count: { dishId: true },
    orderBy: { _count: { dishId: "desc" } },
    take: 5,
  });

  const dishIds = topDishesRaw.map((d) => d.dishId);
  const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } }, select: { id: true, name: true, price: true } });
  const dishMap = new Map(dishes.map((d) => [d.id, d]));

  const topDishes = topDishesRaw.map((td) => ({
    name: dishMap.get(td.dishId)?.name ?? "Inconnu",
    orders: td._count.dishId,
    revenue: (td._sum.unitPrice ?? 0) * (td._sum.quantity ?? 1),
    margin: 0.7,
  }));

  const analytics = await prisma.analytics.findMany({
    where: { restaurantId, date: { gte: weekAgo } },
  });
  const totalRevenue = analytics.reduce((s, a) => s + a.revenue, 0);
  const totalScans = analytics.reduce((s, a) => s + a.qrScans, 0);
  const totalOrders = analytics.reduce((s, a) => s + a.orders, 0);
  const conversionRate = totalScans > 0 ? (totalOrders / totalScans) * 100 : 0;

  const insightsJson = await generateAIInsights({
    restaurantName: restaurant.name,
    topDishes,
    period: "cette semaine",
    totalRevenue,
    conversionRate,
  });

  const insights = JSON.parse(insightsJson);
  return NextResponse.json({ insights, data: { topDishes, totalRevenue, conversionRate } });
}
