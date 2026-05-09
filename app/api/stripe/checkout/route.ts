import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/db";


export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { tier } = await req.json();
  const plan = PLANS[tier as keyof typeof PLANS];
  if (!plan?.priceId) return NextResponse.json({ error: "Plan invalide" }, { status: 400 });

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let customerId = user.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email!, name: user.name ?? undefined });
    customerId = customer.id;
    await prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customerId } });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId!, quantity: 1 }],
    success_url: `${appUrl}/dashboard?success=1`,
    cancel_url: `${appUrl}/pricing?cancelled=1`,
    metadata: { userId, tier },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
