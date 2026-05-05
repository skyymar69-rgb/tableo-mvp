import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { subDays, subMonths, startOfDay, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "week";
    const restaurantId = searchParams.get("restaurantId");

    const userId = (session.user as any).id;
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: userId, ...(restaurantId ? { id: restaurantId } : {}) },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });

    const now = new Date();
    const startDate =
      range === "day" ? startOfDay(now) :
      range === "month" ? subMonths(now, 1) :
      subDays(now, 7);

    const analyticsRows = await prisma.analytics.findMany({
      where: { restaurantId: restaurant.id, date: { gte: startDate } },
      orderBy: { date: "asc" },
    });

    const ordersToday = await prisma.order.count({
      where: { restaurantId: restaurant.id, createdAt: { gte: startOfDay(now) } },
    });

    const revenueToday = await prisma.order.aggregate({
      where: { restaurantId: restaurant.id, createdAt: { gte: startOfDay(now) }, status: { in: ["DELIVERED", "CONFIRMED"] } },
      _sum: { total: true },
    });

    const scansToday = await prisma.qRScan.count({
      where: { qrCode: { restaurantId: restaurant.id }, scannedAt: { gte: startOfDay(now) } },
    });

    const topDishes = await prisma.orderItem.groupBy({
      by: ["dishId"],
      where: { order: { restaurantId: restaurant.id, createdAt: { gte: startDate } } },
      _sum: { quantity: true, unitPrice: true },
      _count: { dishId: true },
      orderBy: { _count: { dishId: "desc" } },
      take: 5,
    });

    const dishIds = topDishes.map((d) => d.dishId);
    const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } }, select: { id: true, name: true, price: true } });

    const topDishesFormatted = topDishes.map((td) => {
      const dish = dishes.find((d) => d.id === td.dishId);
      return {
        id: td.dishId,
        name: dish?.name ?? "Inconnu",
        orders: td._count.dishId,
        revenue: (td._sum.unitPrice ?? 0) * (td._sum.quantity ?? 1),
        trend: "+0%",
      };
    });

    const chartData = analyticsRows.map((row) => ({
      date: format(row.date, "dd MMM"),
      scans: row.qrScans,
      orders: row.orders,
      revenue: row.revenue,
    }));

    const totalRevenue = analyticsRows.reduce((s, r) => s + r.revenue, 0);
    const totalOrders = analyticsRows.reduce((s, r) => s + r.orders, 0);
    const totalScans = analyticsRows.reduce((s, r) => s + r.qrScans, 0);
    const conversionRate = totalScans > 0 ? ((totalOrders / totalScans) * 100).toFixed(1) : "0";

    return NextResponse.json({
      kpis: {
        revenueToday: revenueToday._sum.total ?? 0,
        ordersToday,
        scansToday,
        avgOrderValue: ordersToday > 0 ? ((revenueToday._sum.total ?? 0) / ordersToday) : 0,
      },
      chart: chartData,
      topDishes: topDishesFormatted,
      summary: { totalRevenue, totalOrders, totalScans, conversionRate: `${conversionRate}%` },
    });
  } catch (err) {
    console.error("[ANALYTICS]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
