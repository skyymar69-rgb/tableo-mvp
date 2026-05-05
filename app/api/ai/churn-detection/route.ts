import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurantId = req.nextUrl.searchParams.get("restaurantId");
  const userId = (session.user as any).id;

  const restaurant = await prisma.restaurant.findFirst({ where: { ownerId: userId, ...(restaurantId ? { id: restaurantId } : {}) } });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const thirtyDaysAgo = subDays(new Date(), 30);
  const sixtyDaysAgo = subDays(new Date(), 60);

  const atRiskCustomers = await prisma.customer.findMany({
    where: {
      restaurantId: restaurant.id,
      lastVisit: { lt: thirtyDaysAgo, gte: sixtyDaysAgo },
      totalVisits: { gte: 2 },
    },
    orderBy: { totalSpent: "desc" },
    take: 20,
    select: { id: true, name: true, email: true, totalSpent: true, totalVisits: true, lastVisit: true },
  });

  const lostCustomers = await prisma.customer.findMany({
    where: {
      restaurantId: restaurant.id,
      lastVisit: { lt: sixtyDaysAgo },
      totalVisits: { gte: 3 },
    },
    orderBy: { totalSpent: "desc" },
    take: 10,
    select: { id: true, name: true, email: true, totalSpent: true, totalVisits: true, lastVisit: true },
  });

  const potentialRevenueLost = [...atRiskCustomers, ...lostCustomers]
    .reduce((s, c) => s + (c.totalSpent / (c.totalVisits || 1)), 0);

  return NextResponse.json({
    atRisk: atRiskCustomers,
    lost: lostCustomers,
    summary: {
      atRiskCount: atRiskCustomers.length,
      lostCount: lostCustomers.length,
      potentialRevenueLost: Math.round(potentialRevenueLost),
    },
  });
}
