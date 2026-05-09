import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 300;

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug || slug === "demo") {
    return NextResponse.json({ restaurant: null, menu: null });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      settings: true,
      tables: { select: { id: true, number: true } }, // pour resolution tableId cote client
      menus: {
        where: { isPublished: true },
        include: {
          categories: {
            where: { isVisible: true },
            orderBy: { order: "asc" },
            include: {
              dishes: {
                where: { isAvailable: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
        take: 1,
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

  const menu = restaurant.menus[0] ?? null;

  return NextResponse.json({
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      primaryColor: restaurant.settings?.primaryColor ?? "#F89544",
    },
    tables: restaurant.tables, // [{ id, number }] pour matcher ?table=N
    menu: menu
      ? {
          categories: menu.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            dishes: cat.dishes.map((d) => ({
              id: d.id,
              name: d.name,
              description: d.description,
              price: d.price,
              labels: d.labels,
              allergens: d.allergens,
              popular: d.isFeatured,
              veg: d.labels.includes("VEGAN") || d.labels.includes("VEGETARIAN"),
            })),
          })),
        }
      : null,
  });
}
