import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { restaurantId } = await req.json();
  const userId = (session.user as any).id;

  const restaurant = await prisma.restaurant.findFirst({ where: { ownerId: userId, id: restaurantId } });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const topDishes = await prisma.orderItem.groupBy({
    by: ["dishId"],
    where: { order: { restaurantId: restaurant.id } },
    _count: { dishId: true },
    _sum: { unitPrice: true },
    orderBy: { _count: { dishId: "desc" } },
    take: 10,
  });

  const dishIds = topDishes.map((d) => d.dishId);
  const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } }, select: { id: true, name: true, price: true } });

  const dishData = topDishes.map((td) => {
    const dish = dishes.find((d) => d.id === td.dishId);
    return { name: dish?.name ?? "Inconnu", currentPrice: dish?.price ?? 0, orders: td._count.dishId };
  });

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Tu es un consultant en optimisation des prix pour restaurants. Analyse ces plats et propose des ajustements de prix basés sur la popularité et la valeur perçue.

Données:
${JSON.stringify(dishData, null, 2)}

Retourne un JSON: { "suggestions": [{ "name": "string", "currentPrice": number, "suggestedPrice": number, "reason": "string", "impact": "string" }] }`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return NextResponse.json({ suggestions: [] });

  return NextResponse.json(JSON.parse(jsonMatch[0]));
}
