import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import { z } from "zod";


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
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const data = schema.parse(await req.json());
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const qrRecord = await prisma.qRCode.create({
      data: {
        restaurantId: data.restaurantId,
        menuId: data.menuId,
        tableId: data.tableId,
        name: data.name,
        url: `${appUrl}/menu/${data.restaurantId}`,
        style: data.style ?? {},
      },
    });

    const url = `${appUrl}/menu/${data.restaurantId}?qr=${qrRecord.id}`;
    await prisma.qRCode.update({ where: { id: qrRecord.id }, data: { url } });

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: data.style?.foreground ?? "#000000",
        light: data.style?.background ?? "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });

    return NextResponse.json({ qrCode: qrRecord, dataUrl: qrDataUrl });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
