import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Healthcheck endpoint pour uptime monitoring (UptimeRobot, BetterStack, etc.).
 * Renvoie 200 si DB joignable, 503 sinon.
 */
export async function GET() {
  const started = Date.now();
  try {
    // Test DB rapide (1 query no-op)
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      ts: new Date().toISOString(),
      uptimeMs: process.uptime() * 1000,
      dbLatencyMs: Date.now() - started,
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev",
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "degraded",
        error: "Database unreachable",
        ts: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export async function HEAD() {
  // Reponse rapide pour les pings de monitoring
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
