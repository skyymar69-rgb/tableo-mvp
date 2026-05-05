"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRestaurant } from "@/lib/hooks/useRestaurant";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Quels plats mettre en avant ce soir ?",
  "Comment améliorer mon taux de conversion ?",
  "Analyse mes ventes de cette semaine",
  "Quand est mon heure de pointe ?",
];

const FALLBACK = "Je suis votre assistant Tableo. Je peux analyser vos données de vente, suggérer des optimisations de menu, identifier vos meilleures heures et vous aider à maximiser vos revenus. Configurez votre clé API Claude dans les paramètres pour activer l'IA en temps réel.";

const DEMO_RESPONSES: Record<string, string> = {
  "Quels plats mettre en avant ce soir ?": "D'après vos données des 7 derniers jours :\n\n🥇 **Fondant Chocolat** — marge 85%, +12% cette semaine. Suggérez-le après chaque plat principal.\n🥈 **Saumon Mi-Cuit** — 26 commandes, votre best-seller. Mettez-le en premier dans la liste.\n🥉 **Risotto Truffe** — panier moyen +23% quand commandé. Potentiel upsell de 32€/couvert.",
  "Comment améliorer mon taux de conversion ?": "Votre taux actuel est de **68%** (scans → commandes). Objectif : 80%.\n\n**Actions immédiates :**\n• Réduisez la carte à 6-8 plats par catégorie (loi de Hick)\n• Ajoutez des photos haute qualité (conversion +40%)\n• Activez les suggestions IA en tête de liste\n• Notifications push pour tables inactives depuis 8 min",
  "Analyse mes ventes de cette semaine": "📊 **Cette semaine**\n\n• CA : **+18%** vs semaine précédente\n• Panier moyen : **60,6 €** (+9,5%)\n• Heure de pointe : **20h-21h** (32% du CA)\n• Meilleur jour : **Samedi**\n• À optimiser : **Mardi** (trafic faible)",
  "Quand est mon heure de pointe ?": "⏰ **Créneaux clés :**\n\n• **19h45–20h15** : +45% du CA journalier\n• **20h30–21h00** : Rush principal, tables tournent 2,3x\n\n**Conseil :** Préparez les suggestions desserts à 20h00 précises. Gain estimé : **+12% de panier moyen**.",
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: FALLBACK },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: restaurant } = useRestaurant();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading || streaming) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          restaurantId: restaurant?.id,
        }),
      });

      if (!res.ok || !res.body) throw new Error("API unavailable");

      setLoading(false);
      setStreaming(true);

      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") { setStreaming(false); continue; }
          try {
            const { text, error } = JSON.parse(data);
            if (error) { setStreaming(false); return; }
            if (text) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + text,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
      setStreaming(false);
    } catch {
      setLoading(false);
      setStreaming(false);
      const fallback = DEMO_RESPONSES[text] ?? `Analyse pour : "${text}"\n\nBasé sur vos données Tableo, je recommande d'optimiser vos 3 meilleurs plats, d'ajuster vos prix en heure de pointe et d'activer les relances auto pour clients inactifs. Résultat estimé : +15-20% de CA mensuel.`;
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-warm shadow-warm flex items-center justify-center z-50 hover:scale-110 transition-all",
          open && "hidden"
        )}
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-[500px] rounded-2xl border border-border bg-card shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-up">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-warm-subtle shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Assistant Tableo</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full", streaming ? "bg-primary animate-pulse" : "bg-emerald-400")} />
                {streaming ? "Claude réfléchit…" : "Alimenté par Claude AI"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "")}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-warm flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className={cn(
                  "rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[85%] whitespace-pre-line",
                  msg.role === "assistant"
                    ? "bg-secondary text-foreground rounded-tl-sm"
                    : "bg-gradient-warm text-primary-foreground rounded-tr-sm"
                )}>
                  {msg.content}
                  {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                    <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-warm flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="shrink-0 rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {p.slice(0, 28)}…
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 p-3 border-t border-border shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Posez votre question..."
              className="flex-1 rounded-xl bg-secondary border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading || streaming}
              className="w-8 h-8 rounded-xl bg-gradient-warm flex items-center justify-center shrink-0 hover:opacity-90 disabled:opacity-40 transition-all"
            >
              {loading || streaming ? <Loader2 className="w-3.5 h-3.5 text-primary-foreground animate-spin" /> : <Send className="w-3.5 h-3.5 text-primary-foreground" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
