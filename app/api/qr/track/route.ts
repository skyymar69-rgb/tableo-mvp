import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ qrId: z.string() });

/**
 * Track scan public — pas d'auth (le client n'est pas connecté).
 * Crée un QRScan et renvoie 204.
 */
export async function POST(req: NextRequest) {
  try {
    const { qrId } = schema.parse(await req.json());
    const ua = req.headers.get("user-agent") ?? null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    // Vérifie que le QR existe (404 silencieux sinon)
    const qr = await prisma.qRCode.findUnique({ where: { id: qrId }, select: { id: true } });
    if (!qr) return new NextResponse(null, { status: 204 });

    await prisma.qRScan.create({
      data: { qrCodeId: qrId, userAgent: ua, ip: ip ?? undefined },
    });
    // Incrémente le compteur global
    await prisma.qRCode.update({
      where: { id: qrId },
      data: { scans: { increment: 1 } },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
