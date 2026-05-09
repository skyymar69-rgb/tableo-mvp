import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";


export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { restaurantId } = await req.json();
  if (!restaurantId) return NextResponse.json({ error: "restaurantId required" }, { status: 400 });

  const restaurant = await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { status: "ACTIVE" },
    select: { id: true, name: true, status: true },
  });

  return NextResponse.json({ restaurant });
}
