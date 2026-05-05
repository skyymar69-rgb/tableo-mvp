import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json();
  if (!text || text.trim().length < 10) {
    return NextResponse.json({ error: "Text too short" }, { status: 400 });
  }

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Tu es un expert en menus de restaurants. Analyse ce texte de menu et structure-le en JSON.

Texte du menu:
${text}

Retourne UNIQUEMENT un JSON valide (sans markdown) avec cette structure:
{
  "categories": [
    {
      "name": "string",
      "dishes": [
        {
          "name": "string",
          "description": "string ou null",
          "price": number,
          "allergens": [],
          "labels": []
        }
      ]
    }
  ]
}

Labels possibles: BESTSELLER, NEW, VEGAN, VEGETARIAN, SPICY, GLUTEN_FREE, CHEF_SPECIAL
Allergènes possibles: GLUTEN, DAIRY, EGGS, NUTS, FISH, SHELLFISH, SOY, SESAME
Prix en nombre décimal (ex: 12.5).`,
    }],
  });

  const text_content = response.content[0].type === "text" ? response.content[0].text : "{}";
  const jsonMatch = text_content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return NextResponse.json({ categories: [] });

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const totalDishes = (parsed.categories ?? []).reduce((s: number, c: any) => s + (c.dishes?.length ?? 0), 0);
    return NextResponse.json({ ...parsed, totalDishes });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
