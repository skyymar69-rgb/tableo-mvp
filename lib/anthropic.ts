import Anthropic from "@anthropic-ai/sdk";

/**
 * Client Anthropic — fallback gracieux si la clé n'est pas configurée.
 * Les helpers ci-dessous lèvent une erreur claire plutôt que de crash au build.
 */
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : (null as unknown as Anthropic);

function ensureAnthropic(): Anthropic {
  if (!anthropic) {
    throw new Error(
      "Service IA indisponible : ANTHROPIC_API_KEY n'est pas configurée. " +
      "Ajoutez-la dans Vercel → Settings → Environment Variables.",
    );
  }
  return anthropic;
}

const MENU_SCHEMA_PROMPT = `Retourne UNIQUEMENT un JSON valide avec cette structure:
{
  "restaurantName": "string ou null",
  "categories": [
    {
      "name": "string",
      "dishes": [
        {
          "name": "string",
          "description": "string ou null",
          "price": number,
          "allergens": ["string"],
          "labels": ["VEGAN"|"VEGETARIAN"|"SPICY"|"GLUTEN_FREE"|"BESTSELLER"|"CHEF_SPECIAL"]
        }
      ]
    }
  ]
}`;

function parseMenuJson(text: string): MenuAnalysisResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in AI response");
  return JSON.parse(jsonMatch[0]);
}

export async function analyzeMenu(content: string): Promise<MenuAnalysisResult> {
  const response = await ensureAnthropic().messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Tu es un expert en restauration. Analyse ce menu et structure-le en JSON.

Menu brut:
${content}

${MENU_SCHEMA_PROMPT}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseMenuJson(text);
}

/**
 * Analyse un menu depuis un fichier PDF ou une image (base64).
 * Utilise Claude Vision / le support natif PDF de l'API Anthropic.
 */
export async function analyzeMenuFromFile(
  base64: string,
  mediaType: string,
  fileType: "pdf" | "image",
): Promise<MenuAnalysisResult> {
  const client = ensureAnthropic();

  const fileBlock: any =
    fileType === "pdf"
      ? {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        }
      : {
          type: "image",
          source: { type: "base64", media_type: mediaType, data: base64 },
        };

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          fileBlock,
          {
            type: "text",
            text: `Tu es un expert en restauration. Analyse ce menu et structure-le en JSON.\n\n${MENU_SCHEMA_PROMPT}`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseMenuJson(text);
}

export async function generateAIInsights(data: {
  restaurantName: string;
  topDishes: Array<{ name: string; orders: number; revenue: number; margin: number }>;
  period: string;
  totalRevenue: number;
  conversionRate: number;
}): Promise<string> {
  const response = await ensureAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Tu es un consultant business pour restaurants. Génère 3 insights actionnables courts (max 2 phrases chacun) basés sur ces données pour ${data.restaurantName}.

Top plats: ${JSON.stringify(data.topDishes)}
Période: ${data.period}
CA total: ${data.totalRevenue}€
Taux de conversion: ${data.conversionRate}%

Format: JSON array de strings ["insight1", "insight2", "insight3"]`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "[]";
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  return jsonMatch ? jsonMatch[0] : "[]";
}

interface MenuAnalysisResult {
  restaurantName: string | null;
  categories: Array<{
    name: string;
    dishes: Array<{
      name: string;
      description: string | null;
      price: number;
      allergens: string[];
      labels: string[];
    }>;
  }>;
}
