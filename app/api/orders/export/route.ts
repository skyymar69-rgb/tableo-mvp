import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * Export CSV des commandes du restaurant.
 * Query params : ?restaurantId=xx&from=ISO&to=ISO&status=PENDING
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status");

  if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

  // Securite ownership
  const owns = await prisma.restaurant.findFirst({
    where: { id: restaurantId, ownerId: auth.userId },
    select: { id: true, name: true },
  });
  if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const where: any = { restaurantId };
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: { include: { dish: { select: { name: true } } } },
      table: { select: { number: true } },
      customer: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  // CSV header + rows
  const escape = (s: any) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const header = [
    "ID", "Date", "Statut", "Table", "Client", "Email",
    "Plats", "Quantites", "Total EUR", "Notes",
  ].map(escape).join(",");

  const rows = orders.map((o) => {
    const dishes = o.items.map((i) => i.dish?.name ?? "?").join(" | ");
    const qtys = o.items.map((i) => i.quantity).join(" | ");
    return [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.status,
      o.table?.number ?? "",
      o.customer?.name ?? "",
      o.customer?.email ?? "",
      dishes,
      qtys,
      o.total.toFixed(2),
      o.notes ?? "",
    ].map(escape).join(",");
  });

  // BOM UTF-8 pour Excel
  const csv = "﻿" + [header, ...rows].join("\n");
  const filename = `tableo-orders-${owns.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
