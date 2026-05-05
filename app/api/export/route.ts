import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const type = req.nextUrl.searchParams.get("type") ?? "customers";
  const restaurantId = req.nextUrl.searchParams.get("restaurantId");
  const range = req.nextUrl.searchParams.get("range") ?? "month";

  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: userId, ...(restaurantId ? { id: restaurantId } : {}) },
  });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (type === "customers") {
    const customers = await prisma.customer.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { totalSpent: "desc" },
    });

    const rows = [
      ["Nom", "Email", "Téléphone", "Visites", "CA Total (€)", "Dernière visite", "Points fidélité", "Segment RFM"],
      ...customers.map((c) => [
        c.name ?? "",
        c.email ?? "",
        c.phone ?? "",
        c.totalVisits,
        c.totalSpent.toFixed(2),
        c.lastVisit ? new Date(c.lastVisit).toLocaleDateString("fr-FR") : "",
        c.loyaltyPoints,
        c.rfmScore ?? "",
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="clients-${restaurant.slug}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "analytics") {
    const days = range === "year" ? 365 : range === "month" ? 30 : 7;
    const since = subDays(new Date(), days);

    const orders = await prisma.order.findMany({
      where: { restaurantId: restaurant.id, createdAt: { gte: since }, status: { not: "CANCELLED" } },
      include: { table: { select: { number: true } }, items: { include: { dish: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    const rows = [
      ["ID Commande", "Date", "Table", "Statut", "Articles", "Total (€)"],
      ...orders.map((o) => [
        o.id.slice(-8).toUpperCase(),
        new Date(o.createdAt).toLocaleString("fr-FR"),
        o.table ? `T${o.table.number}` : "—",
        o.status,
        o.items.map((i) => `${i.quantity}x ${i.dish?.name ?? "?"}`).join("; "),
        o.total.toFixed(2),
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="commandes-${restaurant.slug}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
