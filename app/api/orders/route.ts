import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

  const orders = await prisma.order.findMany({
    where: { restaurantId },
    include: {
      items: { include: { dish: { select: { name: true, price: true } } } },
      table: { select: { number: true } },
      customer: { select: { name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ orders });
}

const createOrderSchema = z.object({
  restaurantId: z.string(),
  tableId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(z.object({ dishId: z.string(), quantity: z.number().min(1), notes: z.string().optional() })),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = createOrderSchema.parse(await req.json());

    const dishes = await prisma.dish.findMany({ where: { id: { in: data.items.map((i) => i.dishId) } } });
    const dishMap = new Map(dishes.map((d) => [d.id, d]));

    const total = data.items.reduce((sum, item) => {
      const dish = dishMap.get(item.dishId);
      return sum + (dish?.price ?? 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        restaurantId: data.restaurantId,
        tableId: data.tableId,
        customerId: data.customerId,
        notes: data.notes,
        total,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            dishId: item.dishId,
            quantity: item.quantity,
            unitPrice: dishMap.get(item.dishId)?.price ?? 0,
            notes: item.notes,
          })),
        },
      },
      include: { items: true },
    });

    if (data.tableId) {
      await prisma.table.update({ where: { id: data.tableId }, data: { status: "OCCUPIED" } });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
