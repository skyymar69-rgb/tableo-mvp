import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: { restaurantId: string } }): Promise<Metadata> {
  if (params.restaurantId === "demo") {
    return { title: "Menu — Tableo Demo", description: "Découvrez notre menu digital interactif" };
  }
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: params.restaurantId },
      select: { name: true },
    });
    return {
      title: restaurant ? `Menu — ${restaurant.name}` : "Menu Digital",
      description: `Consultez le menu digital de ${restaurant?.name ?? "ce restaurant"}`,
    };
  } catch {
    return { title: "Menu Digital" };
  }
}

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
