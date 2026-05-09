import Stripe from "stripe";

/**
 * Stripe singleton — fallback gracieux si la clé n'est pas configurée.
 * Évite un crash au build/runtime quand STRIPE_SECRET_KEY est absent.
 * Les routes qui utilisent stripe doivent vérifier `if (!stripe) ...`.
 */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Cast : la version officielle dans les types peut être en retard sur l'API
      apiVersion: "2024-11-20.acacia" as Stripe.LatestApiVersion,
      typescript: true,
    })
  : (null as unknown as Stripe);

export const PLANS = {
  FREE: {
    name: "Starter",
    price: 0,
    priceId: null,
    limits: { restaurants: 1, menus: 1, dishes: 20, qrCodes: 1 },
  },
  GROWTH: {
    name: "Growth",
    price: 49,
    priceId: process.env.STRIPE_PRICE_GROWTH,
    limits: { restaurants: 3, menus: 5, dishes: 200, qrCodes: 10 },
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: null,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE,
    limits: { restaurants: Infinity, menus: Infinity, dishes: Infinity, qrCodes: Infinity },
  },
} as const;
