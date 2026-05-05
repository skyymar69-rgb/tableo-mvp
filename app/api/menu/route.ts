import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

  const menus = await prisma.menu.findMany({
    where: { restaurantId },
    include: {
      categories: {
        orderBy: { order: "asc" },
        include: {
          dishes: { orderBy: { order: "asc" } },
        },
      },
      _count: { select: { categories: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ menus });
}

const createSchema = z.object({
  restaurantId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const data = createSchema.parse(await req.json());
    const menu = await prisma.menu.create({ data });
    return NextResponse.json({ menu }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
