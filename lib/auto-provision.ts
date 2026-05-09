import { prisma } from "./db";

/**
 * Assure qu'un user a au moins un restaurant attaché.
 * Appelé au signIn callback NextAuth pour éviter les "no restaurant" 404.
 *
 * Stratégie : si pas de restaurant, on crée une "ébauche" avec slug auto.
 * L'utilisateur la complète ensuite via /onboarding ou /settings.
 */
export async function ensureUserHasRestaurant(userId: string, userName?: string | null) {
  const existing = await prisma.restaurant.findFirst({
    where: { ownerId: userId },
    select: { id: true },
  });
  if (existing) return existing.id;

  // Slug unique : "<prenom>-<6chars>"
  const base = (userName ?? "mon-restaurant")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 20);
  const slug = `${base || "resto"}-${Math.random().toString(36).slice(2, 8)}`;

  const created = await prisma.restaurant.create({
    data: {
      name: userName ? `Restaurant de ${userName}` : "Mon restaurant",
      slug,
      ownerId: userId,
      status: "ONBOARDING",
      currency: "EUR",
      timezone: "Europe/Paris",
    },
    select: { id: true },
  });

  return created.id;
}
