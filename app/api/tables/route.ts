import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";


export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurantId = req.nextUrl.searchParams.get("restaurantId");
  const userId = (session.user as any).id;

  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: userId, ...(restaurantId ? { id: restaurantId } : {}) },
  });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tables = await prisma.table.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      orders: {
        where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] } },
        select: { id: true, total: true, status: true, createdAt: true, customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { number: "asc" },
  });

  return NextResponse.json({ tables });
}

const createSchema = z.object({
  restaurantId: z.string(),
  number: z.string().min(1),
  capacity: z.number().int().min(1).max(50).default(4),
  floor: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();

  try {
    const data = createSchema.parse(body);
    const restaurant = await prisma.restaurant.findFirst({ where: { id: data.restaurantId, ownerId: userId } });
    if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const table = await prisma.table.create({
      data: { restaurantId: restaurant.id, number: data.number, capacity: data.capacity, floor: data.floor },
    });
    return NextResponse.json({ table }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
