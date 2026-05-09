import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "csv";
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) return NextResponse.json({ error: "restaurantId required" }, { status: 400 });

  const orders = await prisma.order.findMany({
    where: { restaurantId, status: { not: "CANCELLED" } },
    include: { items: { include: { dish: { select: { name: true } } } }, table: { select: { number: true } } },
    orderBy: { createdAt: "desc" },
    take: 1000,
  }).catch(() => []);

  if (format === "json") {
    return NextResponse.json(orders, {
      headers: { "Content-Disposition": "attachment; filename=tableo-export.json" },
    });
  }

  const rows = [
    ["ID", "Date", "Table", "Statut", "Total", "Plats"],
    ...orders.map((o) => [
      o.id,
      o.createdAt.toISOString().slice(0, 16).replace("T", " "),
      (o.table as { number?: string } | null)?.number ?? "",
      o.status,
      o.total.toFixed(2),
      o.items.map((i) => `${i.quantity}x ${(i as { dish?: { name: string } }).dish?.name ?? ""}`).join(" | "),
    ]),
  ];

  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=tableo-analytics.csv",
    },
  });
}
