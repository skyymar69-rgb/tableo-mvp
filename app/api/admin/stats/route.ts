import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { subDays, startOfDay } from "date-fns";


export const dynamic = "force-dynamic";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

function isAdmin(session: any) {
  return session?.user?.role === "ADMIN" || ADMIN_EMAILS.includes(session?.user?.email ?? "");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdmin(session)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const today = startOfDay(new Date());
  const last30 = subDays(new Date(), 30);
  const last7 = subDays(new Date(), 7);

  const [
    totalUsers,
    newUsersToday,
    newUsersLast7,
    newUsersLast30,
    totalRestaurants,
    activeRestaurants,
    onboardingRestaurants,
    suspendedRestaurants,
    totalOrders,
    ordersToday,
    revenueTotal,
    revenueToday,
    freeSubs,
    growthSubs,
    enterpriseSubs,
    recentUsers,
    recentRestaurants,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: last7 } } }),
    prisma.user.count({ where: { createdAt: { gte: last30 } } }),
    prisma.restaurant.count(),
    prisma.restaurant.count({ where: { status: "ACTIVE" } }),
    prisma.restaurant.count({ where: { status: "ONBOARDING" } }),
    prisma.restaurant.count({ where: { status: "SUSPENDED" } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ["DELIVERED", "CONFIRMED"] } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ["DELIVERED", "CONFIRMED"] }, createdAt: { gte: today } } }),
    prisma.subscription.count({ where: { tier: "FREE" } }),
    prisma.subscription.count({ where: { tier: "GROWTH" } }),
    prisma.subscription.count({ where: { tier: "ENTERPRISE" } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, subscription: { select: { tier: true } } },
    }),
    prisma.restaurant.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, status: true, createdAt: true, owner: { select: { name: true, email: true } } },
    }),
  ]);

  return NextResponse.json({
    users: { total: totalUsers, today: newUsersToday, last7: newUsersLast7, last30: newUsersLast30 },
    restaurants: { total: totalRestaurants, active: activeRestaurants, onboarding: onboardingRestaurants, suspended: suspendedRestaurants },
    orders: { total: totalOrders, today: ordersToday },
    revenue: { total: revenueTotal._sum.total ?? 0, today: revenueToday._sum.total ?? 0 },
    subscriptions: { free: freeSubs, growth: growthSubs, enterprise: enterpriseSubs },
    recentUsers,
    recentRestaurants,
  });
}
