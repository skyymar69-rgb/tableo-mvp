import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";


export const dynamic = "force-dynamic";
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: params.id, ownerId: userId },
  });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const {
    name, description, address, city, phone, email, website,
    cuisineType, seating, openingHours,
    currency, timezone, logo, logoUrl, status,
    primaryColor, accentColor, settings,
  } = body;

  const updated = await prisma.restaurant.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(website !== undefined && { website }),
      ...(cuisineType !== undefined && { cuisineType }),
      ...(seating !== undefined && { seating }),
      ...(openingHours !== undefined && { openingHours }),
      ...(currency && { currency }),
      ...(timezone && { timezone }),
      // Accepte `logo` (legacy) ou `logoUrl` (nouveau)
      ...((logoUrl ?? logo) && { logoUrl: logoUrl ?? logo }),
      ...(status && { status }),
    },
  });

  if (primaryColor || accentColor || settings) {
    await prisma.restaurantSettings.upsert({
      where: { restaurantId: params.id },
      update: {
        ...(primaryColor && { primaryColor }),
        ...(accentColor && { accentColor }),
        ...(settings?.menuLayout !== undefined && { menuLayout: settings.menuLayout }),
        ...(settings?.showPrices !== undefined && { showPrices: settings.showPrices }),
        ...(settings?.showAllergens !== undefined && { showAllergens: settings.showAllergens }),
        ...(settings?.showCalories !== undefined && { showCalories: settings.showCalories }),
      },
      create: {
        restaurantId: params.id,
        primaryColor: primaryColor ?? "#F89544",
        accentColor: accentColor ?? "#D64E7E",
        menuLayout: settings?.menuLayout ?? "cards",
        showPrices: settings?.showPrices ?? true,
        showAllergens: settings?.showAllergens ?? true,
        showCalories: settings?.showCalories ?? false,
      },
    });
  }

  return NextResponse.json({ restaurant: updated });
}
