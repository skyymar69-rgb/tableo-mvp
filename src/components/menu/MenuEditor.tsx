"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Plus, ArrowLeft, Check, X, ToggleLeft, ToggleRight,
  Pencil, Trash2, ChevronDown, ChevronRight, Smartphone, Loader2, Languages,
} from "lucide-react";
import { toast } from "sonner";
import { cn, DISH_LABEL_EMOJI } from "@/lib/utils";
import { MobileMenuPreview } from "./MobileMenuPreview";

const TRANSLATE_LANGS = [
  { code: "EN", label: "🇬🇧 Anglais" },
  { code: "ES", label: "🇪🇸 Espagnol" },
  { code: "DE", label: "🇩🇪 Allemand" },
  { code: "IT", label: "🇮🇹 Italien" },
  { code: "PT", label: "🇵🇹 Portugais" },
  { code: "NL", label: "🇳🇱 Néerlandais" },
  { code: "ZH", label: "🇨🇳 Chinois" },
  { code: "JA", label: "🇯🇵 Japonais" },
  { code: "AR", label: "🇸🇦 Arabe" },
];

type TranslatedCategory = {
  id: string;
  name: string;
  dishes: { id: string; name: string; description?: string | null }[];
};

function TranslateModal({ menu, onClose }: { menu: { id: string; name: string }; onClose: () => void }) {
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslatedCategory[] | null>(null);
  const [engine, setEngine] = useState("");

  const translate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/menu/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId: menu.id, targetLang: lang }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur de traduction"); return; }
      setResult(data.translated);
      setEngine(data.engine ?? "");
      toast.success(`Traduction ${TRANSLATE_LANGS.find((l) => l.code === lang)?.label ?? lang} générée !`);
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const lines: string[] = [];
    result.forEach((cat) => {
      lines.push(`\n## ${cat.name}`);
      cat.dishes.forEach((d) => {
        lines.push(`- ${d.name}${d.description ? ` — ${d.description}` : ""}`);
      });
    });
    navigator.clipboard.writeText(lines.join("\n").trim())
      .then(() => toast.success("Traduction copiée !"))
      .catch(() => toast.error("Impossible de copier"));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="modal-translate-title"
        className="rounded-2xl border border-border bg-card w-full max-w-2xl shadow-card animate-scale-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-primary" />
            <h2 id="modal-translate-title" className="text-base font-bold text-foreground">Traduire la carte</h2>
            <span className="text-xs text-muted-foreground">— {menu.name}</span>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-muted-foreground hover:text-foreground focus-ring rounded-lg p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lang selector + action */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {TRANSLATE_LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setResult(null); }}
                aria-pressed={lang === l.code}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${
                  lang === l.code
                    ? "bg-gradient-warm text-primary-foreground border-transparent shadow-warm"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={translate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-warm px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {loading ? "Traduction en cours..." : `Traduire en ${TRANSLATE_LANGS.find((l) => l.code === lang)?.label ?? lang}`}
          </button>
        </div>

        {/* Result */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {!result && !loading && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Sélectionnez une langue et cliquez sur Traduire.
              <br />
              <span className="text-xs">Propulsé par DeepL (si configuré) ou Claude IA — gratuit jusqu&apos;à 500 000 caractères/mois.</span>
            </p>
          )}
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm">Claude traduit votre carte...</span>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">
                  {engine === "deepl" ? "✓ Traduit par DeepL" : "✓ Traduit par Claude IA"} — aperçu lecture seule
                </p>
                <button onClick={copyAll} className="text-xs text-primary hover:underline flex items-center gap-1">
                  Copier tout
                </button>
              </div>
              {result.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-border bg-secondary/30 overflow-hidden">
                  <div className="px-4 py-2.5 bg-secondary/60 border-b border-border">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">{cat.name}</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {cat.dishes.map((dish) => (
                      <div key={dish.id} className="rounded-lg bg-card border border-border/50 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">{dish.name}</p>
                        {dish.description && <p className="text-xs text-muted-foreground mt-0.5">{dish.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Dish {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isAvailable: boolean;
  labels: string[];
  allergens: string[];
}
interface Category {
  id: string;
  name: string;
  order: number;
  dishes: Dish[];
}
interface Menu {
  id: string;
  name: string;
  isPublished: boolean;
  categories: Category[];
}

/* ─── Hooks API ─────────────────────────────────────────────────── */
function useMenuMutations(restaurantId?: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["menus", restaurantId] });

  return {
    addCategory: useMutation({
      mutationFn: async ({ menuId, name }: { menuId: string; name: string }) => {
        const r = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuId, name }),
        });
        if (!r.ok) throw new Error("create cat failed");
        return r.json();
      },
      onSuccess: () => { invalidate(); toast.success("Catégorie créée"); },
      onError: () => toast.error("Erreur création catégorie"),
    }),

    addDish: useMutation({
      mutationFn: async ({ categoryId, name, price, description }: {
        categoryId: string; name: string; price: number; description?: string;
      }) => {
        const r = await fetch("/api/dishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, name, price, description }),
        });
        if (!r.ok) throw new Error("create dish failed");
        return r.json();
      },
      onSuccess: () => { invalidate(); toast.success("Plat ajouté"); },
      onError: () => toast.error("Erreur création plat"),
    }),

    updateDish: useMutation({
      mutationFn: async ({ id, ...patch }: { id: string } & Partial<Dish>) => {
        const r = await fetch(`/api/dishes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!r.ok) throw new Error("update dish failed");
        return r.json();
      },
      onSuccess: () => invalidate(),
      onError: () => toast.error("Erreur mise à jour plat"),
    }),

    deleteDish: useMutation({
      mutationFn: async (id: string) => {
        const r = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
        if (!r.ok) throw new Error("delete dish failed");
        return r.json();
      },
      onSuccess: () => { invalidate(); toast.success("Plat supprimé"); },
      onError: () => toast.error("Erreur suppression plat"),
    }),

    deleteCategory: useMutation({
      mutationFn: async (id: string) => {
        const r = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (!r.ok) throw new Error("delete cat failed");
        return r.json();
      },
      onSuccess: () => { invalidate(); toast.success("Catégorie supprimée"); },
      onError: () => toast.error("Erreur suppression catégorie"),
    }),

    publishMenu: useMutation({
      mutationFn: async ({ menuId, publish }: { menuId: string; publish: boolean }) => {
        const r = await fetch(`/api/menu/${menuId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: publish }),
        });
        if (!r.ok) throw new Error("publish failed");
        return r.json();
      },
      onSuccess: (_, { publish }) => {
        invalidate();
        toast.success(publish ? "🌍 Menu publié !" : "Menu dépublié");
      },
      onError: () => toast.error("Erreur publication"),
    }),
  };
}

/* ─── Modale d'ajout de plat ─────────────────────────────────────── */
function AddDishModal({ categoryId, onClose, onAdd }: {
  categoryId: string;
  onClose: () => void;
  onAdd: (data: { categoryId: string; name: string; price: number; description?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const submit = () => {
    const p = parseFloat(price.replace(",", "."));
    if (!name.trim() || !p || isNaN(p)) {
      toast.error("Nom et prix requis");
      return;
    }
    onAdd({ categoryId, name: name.trim(), price: p, description: description.trim() || undefined });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className="rounded-2xl border border-border bg-card p-6 w-full max-w-md shadow-card animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Nouveau plat</h2>
          <button onClick={onClose} aria-label="Fermer"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                 placeholder="Nom du plat" className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" min="0"
                 placeholder="Prix (€)" className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                    placeholder="Description (optionnel)" className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" />
          <button onClick={submit} className="w-full rounded-xl bg-gradient-warm py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modale d'édition de plat ──────────────────────────────────── */
function EditDishModal({ dish, onClose, onSave }: {
  dish: Dish;
  onClose: () => void;
  onSave: (patch: Partial<Dish>) => void;
}) {
  const [name, setName] = useState(dish.name);
  const [price, setPrice] = useState(String(dish.price));
  const [description, setDescription] = useState(dish.description ?? "");
  const submit = () => {
    const p = parseFloat(price.replace(",", "."));
    if (!name.trim() || !p || isNaN(p)) { toast.error("Nom et prix requis"); return; }
    onSave({ name: name.trim(), price: p, description: description.trim() || null });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className="rounded-2xl border border-border bg-card p-6 w-full max-w-md shadow-card animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Modifier le plat</h2>
          <button onClick={onClose} aria-label="Fermer"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" min="0" className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-xl bg-secondary border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" />
          <button onClick={submit} className="w-full rounded-xl bg-gradient-warm py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sortable plat ─────────────────────────────────────────────── */
function SortableDish({ dish, onToggle, onEdit, onDelete }: {
  dish: Dish;
  onToggle: (id: string, isAvailable: boolean) => void;
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dish.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={cn(
      "flex items-center gap-3 rounded-xl border bg-card px-4 py-3 group/dish hover:border-primary/20 transition-all",
      dish.isAvailable ? "border-border" : "border-border opacity-60"
    )}>
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{dish.name}</span>
          <div className="flex gap-1">
            {dish.labels.slice(0, 2).map((l) => (
              <span key={l} className="text-[10px]">{DISH_LABEL_EMOJI[l] ?? ""}</span>
            ))}
          </div>
          {!dish.isAvailable && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-medium">Indisponible</span>
          )}
        </div>
        {dish.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{dish.description}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-bold text-foreground tabular-nums">{dish.price.toFixed(2)}€</span>
        <button onClick={() => onToggle(dish.id, !dish.isAvailable)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle disponibilité">
          {dish.isAvailable ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
        </button>
        <button onClick={() => onEdit(dish)} className="opacity-0 group-hover/dish:opacity-100 text-muted-foreground hover:text-foreground transition-all" aria-label="Modifier">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => { if (confirm(`Supprimer "${dish.name}" ?`)) onDelete(dish.id); }} className="opacity-0 group-hover/dish:opacity-100 text-muted-foreground hover:text-destructive transition-all" aria-label="Supprimer">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Sortable catégorie ────────────────────────────────────────── */
function SortableCategory({ category, onAddDish, onToggleDish, onEditDish, onDeleteDish, onDeleteCategory }: {
  category: Category;
  onAddDish: (categoryId: string) => void;
  onToggleDish: (id: string, isAvailable: boolean) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onDeleteCategory: (id: string, name: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-border bg-gradient-card overflow-hidden mb-4 group/cat">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-secondary/30">
        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
          <GripVertical className="w-4 h-4" />
        </button>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 flex-1 text-left">
          {collapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          <span className="text-sm font-semibold text-foreground">{category.name}</span>
          <span className="text-xs text-muted-foreground">({category.dishes.length} plat{category.dishes.length > 1 ? "s" : ""})</span>
        </button>
        <button onClick={() => onAddDish(category.id)} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
          <Plus className="w-3.5 h-3.5" /> Ajouter un plat
        </button>
        <button
          onClick={() => onDeleteCategory(category.id, category.name)}
          className="opacity-0 group-hover/cat:opacity-100 text-muted-foreground hover:text-destructive transition-all"
          aria-label="Supprimer la catégorie">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2">
          {category.dishes.length === 0 ? (
            <button onClick={() => onAddDish(category.id)}
                    className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 py-4 text-xs text-muted-foreground hover:text-foreground transition-all">
              + Ajouter le 1<sup>er</sup> plat dans « {category.name} »
            </button>
          ) : (
            <SortableContext items={category.dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
              {category.dishes.map((dish) => (
                <SortableDish key={dish.id} dish={dish} onToggle={onToggleDish} onEdit={onEditDish} onDelete={onDeleteDish} />
              ))}
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── MenuEditor principal ──────────────────────────────────────── */
export function MenuEditor({ menu, restaurantId, onBack }: { menu: Menu; restaurantId?: string; onBack: () => void }) {
  const m = useMenuMutations(restaurantId);
  const [showPreview, setShowPreview] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [addingDishCatId, setAddingDishCatId] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  // Local optimistic for drag (re-fetch invalidate ramène la vraie source)
  const [localCats, setLocalCats] = useState<Category[]>(menu.categories);
  // Sync si menu change (refetch)
  if (menu.categories !== localCats && menu.id) {
    // Si les ids racine ont change, on resync
    const sameIds = localCats.length === menu.categories.length &&
      localCats.every((c, i) => c.id === menu.categories[i]?.id);
    if (!sameIds) setLocalCats(menu.categories);
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = localCats.findIndex((c) => c.id === active.id);
    const newIdx = localCats.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(localCats, oldIdx, newIdx);
    setLocalCats(reordered);
    // Persiste les nouveaux orders en arrière-plan
    reordered.forEach((c, i) => {
      if (c.order !== i) {
        fetch(`/api/categories/${c.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        });
      }
    });
  };

  const handleAddCategory = () => {
    const name = prompt("Nom de la catégorie ?", "");
    if (!name?.trim()) return;
    m.addCategory.mutate({ menuId: menu.id, name: name.trim() });
  };

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <h2 className="text-lg font-bold text-foreground flex-1">{menu.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslate(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-primary" /> Traduire
            </button>
            <button onClick={() => setShowPreview(!showPreview)}
                    className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                      showPreview ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-foreground hover:bg-secondary/80")}>
              <Smartphone className="w-3.5 h-3.5" /> Aperçu
            </button>
            <button
              onClick={() => m.publishMenu.mutate({ menuId: menu.id, publish: !menu.isPublished })}
              disabled={m.publishMenu.isPending}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50",
                menu.isPublished
                  ? "bg-secondary border border-border text-foreground hover:bg-secondary/80"
                  : "bg-gradient-warm text-primary-foreground shadow-warm hover:scale-[1.02]"
              )}>
              {m.publishMenu.isPending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Check className="w-3.5 h-3.5" />}
              {menu.isPublished ? "Dépublier" : "Publier"}
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-gradient-warm-subtle border border-primary/20 text-xs text-foreground flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-primary shrink-0" />
          Glissez pour réorganiser. Toutes les modifications sont sauvegardées en temps réel.
        </div>

        {localCats.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center mb-4">
            <p className="text-sm text-muted-foreground mb-3">Votre menu est vide.</p>
            <button onClick={handleAddCategory}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-[1.02] transition-all">
              <Plus className="w-3.5 h-3.5" /> Créer la 1<sup>ère</sup> catégorie
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
            <SortableContext items={localCats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {localCats.map((cat) => (
                <SortableCategory
                  key={cat.id}
                  category={cat}
                  onAddDish={setAddingDishCatId}
                  onToggleDish={(id, isAvailable) => m.updateDish.mutate({ id, isAvailable })}
                  onEditDish={setEditingDish}
                  onDeleteDish={(id) => m.deleteDish.mutate(id)}
                  onDeleteCategory={(id, name) => {
                    if (confirm(`Supprimer la catégorie "${name}" et tous ses plats ?`)) {
                      m.deleteCategory.mutate(id);
                    }
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        <button onClick={handleAddCategory}
                className="w-full rounded-2xl border-2 border-dashed border-border hover:border-primary/40 py-4 text-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une catégorie
        </button>
      </div>

      {showPreview && (
        <div className="w-[300px] shrink-0 sticky top-20 self-start">
          <p className="text-xs font-medium text-muted-foreground mb-3 text-center">Aperçu client</p>
          {/* Cast : MobileMenuPreview a sa propre signature de Category, on remappe */}
          <MobileMenuPreview categories={localCats.map(c => ({
            ...c,
            dishes: c.dishes.map(d => ({ ...d, description: d.description ?? undefined })),
          })) as any} />
        </div>
      )}

      {addingDishCatId && (
        <AddDishModal
          categoryId={addingDishCatId}
          onClose={() => setAddingDishCatId(null)}
          onAdd={(data) => {
            m.addDish.mutate(data);
            setAddingDishCatId(null);
          }}
        />
      )}

      {editingDish && (
        <EditDishModal
          dish={editingDish}
          onClose={() => setEditingDish(null)}
          onSave={(patch) => {
            m.updateDish.mutate({ id: editingDish.id, ...patch });
            setEditingDish(null);
          }}
        />
      )}

      {showTranslate && (
        <TranslateModal menu={{ id: menu.id, name: menu.name }} onClose={() => setShowTranslate(false)} />
      )}
    </div>
  );
}
