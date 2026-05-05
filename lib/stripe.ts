import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

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
