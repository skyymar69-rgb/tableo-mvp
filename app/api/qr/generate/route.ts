import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import { z } from "zod";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const schema = z.object({
  restaurantId: z.string(),
  menuId: z.string().optional(),
  tableId: z.string().optional(),
  name: z.string().default("QR Code"),
  style: z.object({
    foreground: z.string().default("#000000"),
    background: z.string().default("#FFFFFF"),
  }).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const data = schema.parse(await req.json());

    // Securité : verif ownership du restaurant + récupération slug + table
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: data.restaurantId, ownerId: auth.userId },
      select: { id: true, slug: true },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });

    let tableNumber: string | null = null;
    if (data.tableId) {
      const table = await prisma.table.findFirst({
        where: { id: data.tableId, restaurantId: restaurant.id },
        select: { number: true },
      });
      if (!table) return NextResponse.json({ error: "Table introuvable" }, { status: 404 });
      tableNumber = table.number;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tableo-sepia.vercel.app";

    // 1ère création (sans URL finale qui contient l'id du QR)
    const qrRecord = await prisma.qRCode.create({
      data: {
        restaurantId: restaurant.id,
        menuId: data.menuId,
        tableId: data.tableId,
        name: data.name,
        url: "", // patché juste après avec l'id généré
        style: data.style ?? {},
      },
    });

    // URL publique : /menu/[slug]?table=<number>&qr=<id> pour tracking
    const params = new URLSearchParams();
    if (tableNumber) params.set("table", tableNumber);
    params.set("qr", qrRecord.id);
    const url = `${appUrl}/menu/${restaurant.slug}?${params.toString()}`;

    await prisma.qRCode.update({ where: { id: qrRecord.id }, data: { url } });

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: {
        dark: data.style?.foreground ?? "#000000",
        light: data.style?.background ?? "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });

    return NextResponse.json({ qrCode: { ...qrRecord, url }, dataUrl: qrDataUrl, url });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    console.error("[QR_GENERATE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
