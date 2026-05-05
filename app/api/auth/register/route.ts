import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  restaurantName: z.string().min(2),
  phone: z.string().optional(),
  restaurantType: z.string().optional(),
});

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const isAdmin = ADMIN_EMAILS.includes(data.email);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: isAdmin ? "ADMIN" : "OWNER",
        subscription: { create: { tier: "FREE", status: "ACTIVE" } },
        restaurants: {
          create: {
            name: data.restaurantName,
            slug: generateSlug(data.restaurantName),
            status: "ONBOARDING",
            settings: { create: {} },
          },
        },
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: err.errors }, { status: 400 });
    }
    console.error("[REGISTER]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
