import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";


export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as any).id;
  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: {
      settings: true,
      _count: { select: { menus: true, orders: true, customers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ restaurants });
}

const createSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const userId = (session.user as any).id;

    const restaurant = await prisma.restaurant.create({
      data: {
        ...data,
        slug: generateSlug(data.name),
        ownerId: userId,
        settings: { create: {} },
      },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
