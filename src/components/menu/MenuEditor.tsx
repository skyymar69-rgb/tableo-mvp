"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, ArrowLeft, X, ToggleLeft, ToggleRight,
  Pencil, Trash2, ChevronDown, ChevronRight, Loader2,
  Languages, GripVertical, ImageIcon, Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn, DISH_LABEL_EMOJI } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────── */
interface Article {
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
  dishes: Article[];
}
interface Menu {
  id: string;
  name: string;
  isPublished: boolean;
  categories: Category[];
}

/* ─── Hooks API ─────────────────────────────────────────────── */
function useMenuMutations(restaurantId?: string) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["menus", restaurantId] });
  return {
    addCategory: useMutation({
      mutationFn: async ({ menuId, name }: { menuId: string; name: string }) => {
        const r = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ menuId, name }) });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: () => { inv(); toast.success("Catégorie créée"); },
      onError: () => toast.error("Erreur création catégorie"),
    }),
    addDish: useMutation({
      mutationFn: async ({ categoryId, name, price, description }: { categoryId: string; name: string; price: number; description?: string }) => {
        const r = await fetch("/api/dishes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categoryId, name, price, description }) });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: () => { inv(); toast.success("Article ajouté"); },
      onError: () => toast.error("Erreur création article"),
    }),
    updateDish: useMutation({
      mutationFn: async ({ id, ...patch }: { id: string } & Partial<Article> & { categoryId?: string }) => {
        const r = await fetch(`/api/dishes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: () => inv(),
      onError: () => toast.error("Erreur mise à jour"),
    }),
    deleteDish: useMutation({
      mutationFn: async (id: string) => {
        const r = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: () => { inv(); toast.success("Article supprimé"); },
      onError: () => toast.error("Erreur suppression"),
    }),
    deleteCategory: useMutation({
      mutationFn: async (id: string) => {
        const r = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: () => { inv(); toast.success("Catégorie supprimée"); },
      onError: () => toast.error("Erreur suppression"),
    }),
    publishMenu: useMutation({
      mutationFn: async ({ menuId, publish }: { menuId: string; publish: boolean }) => {
        const r = await fetch(`/api/menu/${menuId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: publish }) });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: (_, { publish }) => { inv(); toast.success(publish ? "Menu publié !" : "Menu dépublié"); },
      onError: () => toast.error("Erreur publication"),
    }),
    renameCategory: useMutation({
      mutationFn: async ({ id, name }: { id: string; name: string }) => {
        const r = await fetch(`/api/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
        if (!r.ok) throw new Error();
        return r.json();
      },
      onSuccess: () => inv(),
      onError: () => toast.error("Erreur renommage"),
    }),
  };
}

/* ─── Modale Article (création + édition) ───────────────────── */
function ArticleModal({
  categories,
  initial,
  defaultCategoryId,
  onClose,
  onSave,
}: {
  categories: Category[];
  initial?: Article & { categoryId: string };
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (data: { categoryId: string; name: string; price: number; description?: string }, id?: string) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "");

  const submit = () => {
    const p = parseFloat(price.replace(",", "."));
    if (!name.trim()) { toast.error("Nom requis"); return; }
    if (isNaN(p) || p < 0) { toast.error("Prix invalide"); return; }
    if (!categoryId) { toast.error("Choisissez une catégorie"); return; }
    onSave({ categoryId, name: name.trim(), price: p, description: description.trim() || undefined }, initial?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className="bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">{initial ? "Modifier l'article" : "Nouvel article"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/70 hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Catégorie */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Catégorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:outline-none transition"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Nom + image */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Nom *</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Ex : Mojito Royal, IPA Locale..."
                  className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Prix *</label>
                <div className="relative">
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    type="number" step="0.10" min="0" placeholder="0.00"
                    className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:outline-none transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/70">€</span>
                </div>
              </div>
            </div>
            <div className="w-24 h-24 mt-5 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-primary/40 hover:text-primary/60 cursor-pointer transition-colors shrink-0">
              <ImageIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">Photo</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ingrédients, caractéristiques..."
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:outline-none transition resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3">
          <button onClick={submit} className="flex-1 rounded-xl bg-gradient-warm hover:opacity-90 py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            {initial ? "Enregistrer" : "Ajouter l'article"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm text-muted-foreground hover:text-gray-700 transition-colors">Annuler</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modale Traduction ─────────────────────────────────────── */
const TRANSLATE_LANGS = [
  { code: "EN", label: "🇬🇧 Anglais" }, { code: "ES", label: "🇪🇸 Espagnol" },
  { code: "DE", label: "🇩🇪 Allemand" }, { code: "IT", label: "🇮🇹 Italien" },
  { code: "PT", label: "🇵🇹 Portugais" }, { code: "ZH", label: "🇨🇳 Chinois" },
  { code: "JA", label: "🇯🇵 Japonais" },
];
type TranslatedCategory = { id: string; name: string; dishes: { id: string; name: string; description?: string | null }[] };

function TranslateModal({ menu, onClose }: { menu: { id: string; name: string }; onClose: () => void }) {
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslatedCategory[] | null>(null);
  const [engine, setEngine] = useState("");

  const translate = async () => {
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/menu/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ menuId: menu.id, targetLang: lang }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur"); return; }
      setResult(data.translated); setEngine(data.engine ?? "");
      toast.success("Traduction générée !");
    } catch { toast.error("Erreur réseau"); }
    finally { setLoading(false); }
  };

  const copyAll = () => {
    if (!result) return;
    const lines: string[] = [];
    result.forEach((cat) => { lines.push(`\n## ${cat.name}`); cat.dishes.forEach((d) => lines.push(`- ${d.name}${d.description ? ` — ${d.description}` : ""}`)); });
    navigator.clipboard.writeText(lines.join("\n").trim()).then(() => toast.success("Copié !")).catch(() => toast.error("Impossible de copier"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2"><Languages className="w-4 h-4 text-primary" /><h2 className="text-base font-bold text-foreground">Traduire la carte</h2><span className="text-sm text-muted-foreground/70">— {menu.name}</span></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/70 hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {TRANSLATE_LANGS.map((l) => (
              <button key={l.code} onClick={() => { setLang(l.code); setResult(null); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all border", lang === l.code ? "bg-gradient-warm text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:border-primary/40")}>
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={translate} disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-warm hover:opacity-90 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {loading ? "Traduction en cours..." : `Traduire en ${TRANSLATE_LANGS.find((l) => l.code === lang)?.label ?? lang}`}
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {!result && !loading && <p className="text-sm text-muted-foreground/70 text-center py-8">Propulsé par DeepL (si configuré) ou Claude IA — gratuit.</p>}
          {loading && <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground/70"><Loader2 className="w-5 h-5 animate-spin text-primary" /><span className="text-sm">Traduction en cours...</span></div>}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground/70">{engine === "deepl" ? "✓ DeepL" : "✓ Claude IA"} — aperçu</p>
                <button onClick={copyAll} className="text-xs text-primary hover:underline">Copier tout</button>
              </div>
              {result.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-2.5 bg-secondary border-b border-border"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{cat.name}</p></div>
                  <div className="p-3 space-y-2">
                    {cat.dishes.map((dish) => (
                      <div key={dish.id} className="rounded-lg bg-card border border-border px-3 py-2">
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

/* ─── CategoryDropZone (panneau gauche) ─────────────────────── */
function CategoryDropZone({
  category,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onToggle,
  onEdit,
  onDelete,
  onDeleteCategory,
  onRename,
}: {
  category: Category;
  isDragOver: boolean;
  onDragOver: (catId: string) => void;
  onDragLeave: () => void;
  onDrop: (catId: string) => void;
  onToggle: (id: string, v: boolean) => void;
  onEdit: (a: Article, catId: string) => void;
  onDelete: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(category.name);

  const commitRename = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== category.name) onRename(category.id, trimmed);
    setEditingName(false);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden mb-3 transition-all",
        isDragOver ? "border-indigo-400 bg-indigo-50 shadow-md ring-2 ring-indigo-200" : "border-border bg-card shadow-sm"
      )}
      onDragOver={(e) => { e.preventDefault(); onDragOver(category.id); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDrop(category.id); }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
        <button onClick={() => setCollapsed(!collapsed)} className="shrink-0 text-muted-foreground/70 hover:text-muted-foreground transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {editingName ? (
          <input
            autoFocus value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setNameValue(category.name); setEditingName(false); } }}
            className="flex-1 text-sm font-semibold bg-card border border-indigo-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        ) : (
          <button onClick={() => setEditingName(true)} className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-primary transition-colors truncate" title="Cliquer pour renommer">
            {category.name}
          </button>
        )}

        <span className="text-xs text-muted-foreground/70 shrink-0">{category.dishes.length}</span>
        <button
          onClick={() => { if (confirm(`Supprimer "${category.name}" et tous ses articles ?`)) onDeleteCategory(category.id); }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drop hint */}
      {isDragOver && (
        <div className="mx-3 my-2 rounded-xl border-2 border-dashed border-indigo-300 py-3 text-center text-xs text-primary font-medium">
          Déposer ici dans «{category.name}»
        </div>
      )}

      {/* Articles */}
      {!collapsed && (
        <div>
          {category.dishes.length === 0 && !isDragOver ? (
            <p className="px-4 py-5 text-center text-xs text-muted-foreground/70">
              Glissez des articles ici depuis la bibliothèque →
            </p>
          ) : (
            category.dishes.map((article) => (
              <div key={article.id} className={cn("flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 last:border-0 group hover:bg-secondary transition-colors text-sm", !article.isAvailable && "opacity-50")}>
                <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground truncate block">{article.name}</span>
                  {article.description && <span className="text-xs text-muted-foreground/70 truncate block">{article.description}</span>}
                </div>
                <span className="text-xs font-bold text-gray-700 tabular-nums shrink-0">{article.price.toFixed(2)}€</span>
                <button onClick={() => onToggle(article.id, !article.isAvailable)} className="shrink-0">
                  {article.isAvailable ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                </button>
                <button onClick={() => onEdit(article, category.id)} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/70 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => { if (confirm(`Supprimer "${article.name}" ?`)) onDelete(article.id); }} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/70 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── ArticleCard (panneau droit, draggable) ────────────────── */
function ArticleCard({
  article,
  categoryName,
  onDragStart,
  onEdit,
  onDelete,
  onToggle,
}: {
  article: Article;
  categoryName: string;
  onDragStart: (id: string) => void;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, v: boolean) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(article.id)}
      className={cn(
        "group rounded-xl border border-border bg-card px-3 py-2.5 cursor-grab active:cursor-grabbing hover:border-indigo-200 hover:shadow-sm transition-all",
        !article.isAvailable && "opacity-50"
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-foreground truncate">{article.name}</span>
            {article.labels.slice(0, 2).map((l) => <span key={l} className="text-[10px]">{DISH_LABEL_EMOJI[l] ?? ""}</span>)}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground/70 bg-gray-100 rounded px-1.5 py-0.5 truncate max-w-[100px]">{categoryName}</span>
            {article.description && <span className="text-xs text-muted-foreground/70 truncate">{article.description}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-bold text-gray-800 tabular-nums">{article.price.toFixed(2)}€</span>
          <button onClick={() => onToggle(article.id, !article.isAvailable)} className="ml-1">
            {article.isAvailable ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
          </button>
          <button onClick={() => onEdit(article)} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/70 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => { if (confirm(`Supprimer "${article.name}" ?`)) onDelete(article.id); }} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/70 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MenuEditor principal ──────────────────────────────────── */
export function MenuEditor({ menu, restaurantId, onBack }: { menu: Menu; restaurantId?: string; onBack: () => void }) {
  const m = useMenuMutations(restaurantId);
  const [showTranslate, setShowTranslate] = useState(false);
  const [articleModal, setArticleModal] = useState<{ open: boolean; catId?: string; editing?: Article & { categoryId: string } }>({ open: false });

  /* Drag state */
  const [draggedDishId, setDraggedDishId] = useState<string | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);

  const openAdd = (catId?: string) => setArticleModal({ open: true, catId: catId ?? menu.categories[0]?.id });
  const openEdit = (article: Article, catId: string) => setArticleModal({ open: true, editing: { ...article, categoryId: catId } });
  const closeModal = () => setArticleModal({ open: false });

  const handleSaveArticle = (data: { categoryId: string; name: string; price: number; description?: string }, id?: string) => {
    if (id) m.updateDish.mutate({ id, name: data.name, price: data.price, description: data.description ?? null });
    else m.addDish.mutate({ categoryId: data.categoryId, name: data.name, price: data.price, description: data.description });
    closeModal();
  };

  const handleAddCategory = () => {
    const name = prompt("Nom de la catégorie :", "");
    if (name?.trim()) m.addCategory.mutate({ menuId: menu.id, name: name.trim() });
  };

  const handleDrop = (targetCatId: string) => {
    if (!draggedDishId) return;
    const sourceCat = menu.categories.find((c) => c.dishes.some((d) => d.id === draggedDishId));
    if (sourceCat?.id !== targetCatId) {
      m.updateDish.mutate({ id: draggedDishId, categoryId: targetCatId });
      toast.success("Article déplacé");
    }
    setDraggedDishId(null);
    setDragOverCatId(null);
  };

  /* Flatten all articles with category info for right panel */
  const allArticles = menu.categories.flatMap((cat) =>
    cat.dishes.map((dish) => ({ ...dish, categoryId: cat.id, categoryName: cat.name }))
  );

  const totalArticles = allArticles.length;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Mes cartes
          </button>
          <span className="text-gray-200">|</span>
          <h1 className="text-sm font-bold text-foreground">{menu.name}</h1>
          <span className="text-xs text-muted-foreground/70">{totalArticles} article{totalArticles !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTranslate(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Languages className="w-3.5 h-3.5" /> Traduire
          </button>
          <button
            onClick={() => m.publishMenu.mutate({ menuId: menu.id, publish: !menu.isPublished })}
            disabled={m.publishMenu.isPending}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
              menu.isPublished ? "bg-gray-100 border border-border text-muted-foreground hover:bg-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            {m.publishMenu.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : menu.isPublished ? "En ligne ✓" : "Publier"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-0 h-[calc(100vh-56px)]">

        {/* LEFT — Catégories (60%) */}
        <div className="flex-1 overflow-y-auto px-4 py-5 border-r border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Catégories</h2>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Nouvelle catégorie
            </button>
          </div>

          {menu.categories.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground mb-4">Créez votre première catégorie pour commencer.</p>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Créer une catégorie
              </button>
            </div>
          ) : (
            menu.categories.map((cat) => (
              <CategoryDropZone
                key={cat.id}
                category={cat}
                isDragOver={dragOverCatId === cat.id}
                onDragOver={setDragOverCatId}
                onDragLeave={() => setDragOverCatId(null)}
                onDrop={handleDrop}
                onToggle={(id, v) => m.updateDish.mutate({ id, isAvailable: v })}
                onEdit={openEdit}
                onDelete={(id) => m.deleteDish.mutate(id)}
                onDeleteCategory={(id) => m.deleteCategory.mutate(id)}
                onRename={(id, name) => m.renameCategory.mutate({ id, name })}
              />
            ))
          )}
        </div>

        {/* RIGHT — Bibliothèque d'articles (40%) */}
        <div className="w-[380px] shrink-0 overflow-y-auto px-4 py-5 bg-secondary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bibliothèque</h2>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">Glissez un article dans une catégorie</p>
            </div>
            <button
              onClick={() => openAdd()}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-warm hover:opacity-90 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Nouvel article
            </button>
          </div>

          {allArticles.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
              <p className="text-sm text-muted-foreground/70 mb-3">Aucun article pour l'instant.</p>
              <button
                onClick={() => openAdd()}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Créer le premier article
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {allArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  categoryName={article.categoryName}
                  onDragStart={setDraggedDishId}
                  onEdit={(a) => openEdit(a, article.categoryId)}
                  onDelete={(id) => m.deleteDish.mutate(id)}
                  onToggle={(id, v) => m.updateDish.mutate({ id, isAvailable: v })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article modal */}
      {articleModal.open && (
        <ArticleModal
          categories={menu.categories}
          initial={articleModal.editing}
          defaultCategoryId={articleModal.catId}
          onClose={closeModal}
          onSave={handleSaveArticle}
        />
      )}

      {/* Translate modal */}
      {showTranslate && (
        <TranslateModal menu={{ id: menu.id, name: menu.name }} onClose={() => setShowTranslate(false)} />
      )}
    </div>
  );
}
