import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/db";
import { subDays, startOfDay } from "date-fns";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { messages, restaurantId } = await req.json();
  if (!messages?.length) return new Response("No messages", { status: 400 });

  const userId = (session.user as any).id;

  let contextData = "";
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: userId, ...(restaurantId ? { id: restaurantId } : {}) },
    });

    if (restaurant) {
      const [ordersToday, revenueToday, topDishes] = await Promise.all([
        prisma.order.count({ where: { restaurantId: restaurant.id, createdAt: { gte: startOfDay(new Date()) } } }),
        prisma.order.aggregate({ where: { restaurantId: restaurant.id, createdAt: { gte: subDays(new Date(), 7) }, status: { in: ["DELIVERED", "CONFIRMED"] } }, _sum: { total: true } }),
        prisma.orderItem.groupBy({
          by: ["dishId"],
          where: { order: { restaurantId: restaurant.id, createdAt: { gte: subDays(new Date(), 7) } } },
          _count: { dishId: true },
          orderBy: { _count: { dishId: "desc" } },
          take: 3,
        }),
      ]);

      const dishIds = topDishes.map((d) => d.dishId);
      const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } }, select: { id: true, name: true, price: true } });

      contextData = `
Restaurant: ${restaurant.name}
Commandes aujourd'hui: ${ordersToday}
CA cette semaine: ${(revenueToday._sum.total ?? 0).toFixed(2)}€
Top plats: ${dishes.map((d) => d.name).join(", ")}
`.trim();
    }
  } catch {}

  const systemPrompt = `Tu es un assistant business expert pour restaurants, intégré dans la plateforme Tableo.
Tu aides les restaurateurs à optimiser leurs revenus, leur menu, leurs opérations et leur CRM.
Réponds en français, de façon concise et actionnable. Utilise des données concrètes quand disponibles.
${contextData ? `\nDonnées actuelles du restaurant:\n${contextData}` : ""}`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
          stream: true,
        });

        for await (const chunk of response) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "AI unavailable" })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
