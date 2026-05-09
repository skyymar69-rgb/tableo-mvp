import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const LANG_NAMES: Record<string, string> = {
  EN: "English", ES: "Spanish", DE: "German", IT: "Italian",
  PT: "Portuguese", NL: "Dutch", PL: "Polish", ZH: "Chinese (Simplified)",
  JA: "Japanese", AR: "Arabic",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { menuId, targetLang } = await req.json();
  if (!menuId || !targetLang) {
    return NextResponse.json({ error: "menuId and targetLang required" }, { status: 400 });
  }

  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    include: { categories: { include: { dishes: true }, orderBy: { order: "asc" } } },
  });
  if (!menu) return NextResponse.json({ error: "Menu not found" }, { status: 404 });

  const langName = LANG_NAMES[targetLang] ?? targetLang;

  /* Build a compact JSON payload for Claude to translate */
  type DishInput = { id: string; name: string; description?: string | null };
  type CatInput = { id: string; name: string; dishes: DishInput[] };

  const payload: CatInput[] = menu.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    dishes: cat.dishes.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description ?? undefined,
    })),
  }));

  /* Try DeepL first if key is configured */
  if (process.env.DEEPL_API_KEY) {
    try {
      const texts: string[] = [];
      const index: { type: "cat" | "dish-name" | "dish-desc"; catIdx: number; dishIdx?: number }[] = [];
      payload.forEach((cat, ci) => {
        texts.push(cat.name);
        index.push({ type: "cat", catIdx: ci });
        cat.dishes.forEach((dish, di) => {
          texts.push(dish.name);
          index.push({ type: "dish-name", catIdx: ci, dishIdx: di });
          if (dish.description) {
            texts.push(dish.description);
            index.push({ type: "dish-desc", catIdx: ci, dishIdx: di });
          }
        });
      });

      const deeplRes = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: { Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: texts, target_lang: targetLang }),
      });

      if (deeplRes.ok) {
        const deeplData = await deeplRes.json();
        const translated = deeplData.translations?.map((t: { text: string }) => t.text) ?? [];
        const result = payload.map((cat) => ({ ...cat }));
        translated.forEach((text: string, i: number) => {
          const ref = index[i];
          if (!ref) return;
          if (ref.type === "cat") result[ref.catIdx].name = text;
          else if (ref.type === "dish-name") result[ref.catIdx].dishes[ref.dishIdx!].name = text;
          else if (ref.type === "dish-desc") result[ref.catIdx].dishes[ref.dishIdx!].description = text;
        });
        return NextResponse.json({ translated: result, lang: targetLang, engine: "deepl" });
      }
    } catch {
      /* fall through to Claude */
    }
  }

  /* Claude translation fallback */
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Translate the following restaurant menu JSON into ${langName}.
Rules:
- Translate ONLY the "name" and "description" string values. Keep all IDs and structure identical.
- Keep food/drink names culturally appropriate (don't over-translate proper nouns like "Mojito").
- Return ONLY valid JSON, no markdown, no explanation.

${JSON.stringify(payload)}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
  let translated: CatInput[];
  try {
    translated = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Translation parsing failed", raw }, { status: 500 });
  }

  return NextResponse.json({ translated, lang: targetLang, engine: "claude" });
}
