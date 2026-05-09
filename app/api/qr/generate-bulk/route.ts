import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import { z } from "zod";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const schema = z.object({
  restaurantId: z.string(),
  style: z.object({
    foreground: z.string().default("#000000"),
    background: z.string().default("#FFFFFF"),
  }).optional(),
});

/**
 * Génère un QR pour CHAQUE table du restaurant qui n'en a pas encore.
 * Renvoie la liste de QR codes (id, table, url, dataUrl).
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const data = schema.parse(await req.json());

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: data.restaurantId, ownerId: auth.userId },
      select: { id: true, slug: true, tables: { select: { id: true, number: true, qrCodes: { select: { id: true } } } } },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tableo-sepia.vercel.app";
    const fg = data.style?.foreground ?? "#000000";
    const bg = data.style?.background ?? "#FFFFFF";

    const created: Array<{ id: string; tableId: string; tableNumber: string; url: string; dataUrl: string }> = [];

    for (const t of restaurant.tables) {
      if (t.qrCodes.length > 0) continue; // skip tables qui ont déjà un QR

      const qr = await prisma.qRCode.create({
        data: {
          restaurantId: restaurant.id,
          tableId: t.id,
          name: `Table ${t.number}`,
          url: "",
          style: { foreground: fg, background: bg } as any,
        },
      });
      const url = `${appUrl}/menu/${restaurant.slug}?table=${encodeURIComponent(t.number)}&qr=${qr.id}`;
      await prisma.qRCode.update({ where: { id: qr.id }, data: { url } });

      const dataUrl = await QRCode.toDataURL(url, {
        width: 512, margin: 2, errorCorrectionLevel: "H",
        color: { dark: fg, light: bg },
      });

      created.push({ id: qr.id, tableId: t.id, tableNumber: t.number, url, dataUrl });
    }

    return NextResponse.json({
      generated: created.length,
      skipped: restaurant.tables.length - created.length,
      qrs: created,
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    console.error("[QR_BULK]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
