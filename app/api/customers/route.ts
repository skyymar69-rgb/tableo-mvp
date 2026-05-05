import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurantId = req.nextUrl.searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "restaurantId required" }, { status: 400 });

  const customers = await prisma.customer.findMany({
    where: { restaurantId },
    orderBy: { totalSpent: "desc" },
    take: 200,
  });

  const total = customers.length;
  const totalSpentSum = customers.reduce((s, c) => s + c.totalSpent, 0);
  const atRiskCount = customers.filter((c) => c.rfmScore === "at_risk" || c.rfmScore === "lost").length;
  const totalPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0);

  return NextResponse.json({
    customers,
    stats: {
      total,
      avgSpent: total > 0 ? totalSpentSum / total : 0,
      atRiskCount,
      totalPoints,
    },
  });
}
