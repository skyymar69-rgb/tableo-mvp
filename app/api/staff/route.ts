import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "restaurantId requis" }, { status: 400 });

  const userId = (session.user as any).id;
  const restaurant = await prisma.restaurant.findFirst({ where: { id: restaurantId, ownerId: userId } });
  if (!restaurant) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const staff = await prisma.staffMember.findMany({
    where: { restaurantId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ staff });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { restaurantId, email, role = "STAFF", name = "" } = body;
  if (!restaurantId || !email) return NextResponse.json({ error: "restaurantId et email requis" }, { status: 400 });

  const userId = (session.user as any).id;
  const restaurant = await prisma.restaurant.findFirst({ where: { id: restaurantId, ownerId: userId } });
  if (!restaurant) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const existing = await prisma.staffMember.findUnique({ where: { restaurantId_email: { restaurantId, email } } });
  if (existing) return NextResponse.json({ error: "Cet email est déjà invité" }, { status: 409 });

  const member = await prisma.staffMember.create({
    data: { restaurantId, email, name, role },
  });

  return NextResponse.json({ member }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("id");
  const restaurantId = searchParams.get("restaurantId");
  if (!memberId || !restaurantId) return NextResponse.json({ error: "id et restaurantId requis" }, { status: 400 });

  const userId = (session.user as any).id;
  const restaurant = await prisma.restaurant.findFirst({ where: { id: restaurantId, ownerId: userId } });
  if (!restaurant) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  await prisma.staffMember.delete({ where: { id: memberId } });
  return NextResponse.json({ success: true });
}
