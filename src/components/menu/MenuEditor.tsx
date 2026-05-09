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
      mutationFn: async ({ id, ...patch }: { id: string } & Partial<Article>) => {
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
      <div role="dialog" aria-modal="true" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{initial ? "Modifier l'article" : "Nouvel article"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Catégorie */}
          {categories.length > 1 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Catégorie</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Nom + image placeholder */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nom de l'article *</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Ex : Mojito Royal, IPA Locale..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Prix *</label>
                <div className="relative">
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    type="number"
                    step="0.10"
                    min="0"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-8 text-sm text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                </div>
              </div>
            </div>
            {/* Image placeholder */}
            <div className="w-24 h-24 mt-5 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-indigo-300 hover:text-indigo-300 cursor-pointer transition-colors shrink-0">
              <ImageIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">Photo</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ingrédients, caractéristiques..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={submit}
            className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {initial ? "Enregistrer" : "Ajouter l'article"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modale Traduction ─────────────────────────────────────── */
const TRANSLATE_LANGS = [
  { code: "EN", label: "🇬🇧 Anglais" },
  { code: "ES", label: "🇪🇸 Espagnol" },
  { code: "DE", label: "🇩🇪 Allemand" },
  { code: "IT", label: "🇮🇹 Italien" },
  { code: "PT", label: "🇵🇹 Portugais" },
  { code: "ZH", label: "🇨🇳 Chinois" },
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
      <div role="dialog" aria-modal="true" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2"><Languages className="w-4 h-4 text-indigo-600" /><h2 className="text-base font-bold text-gray-900">Traduire la carte</h2><span className="text-sm text-gray-400">— {menu.name}</span></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {TRANSLATE_LANGS.map((l) => (
              <button key={l.code} onClick={() => { setLang(l.code); setResult(null); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all border", lang === l.code ? "bg-indigo-600 text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-indigo-300")}>
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={translate} disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {loading ? "Traduction en cours..." : `Traduire en ${TRANSLATE_LANGS.find((l) => l.code === lang)?.label ?? lang}`}
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {!result && !loading && <p className="text-sm text-gray-400 text-center py-8">Propulsé par DeepL (si configuré) ou Claude IA — gratuit.</p>}
          {loading && <div className="flex items-center justify-center py-12 gap-3 text-gray-400"><Loader2 className="w-5 h-5 animate-spin text-indigo-500" /><span className="text-sm">Traduction en cours...</span></div>}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">{engine === "deepl" ? "✓ DeepL" : "✓ Claude IA"} — aperçu</p>
                <button onClick={copyAll} className="text-xs text-indigo-600 hover:underline">Copier tout</button>
              </div>
              {result.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100"><p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{cat.name}</p></div>
                  <div className="p-3 space-y-2">
                    {cat.dishes.map((dish) => (
                      <div key={dish.id} className="rounded-lg bg-white border border-gray-100 px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                        {dish.description && <p className="text-xs text-gray-500 mt-0.5">{dish.description}</p>}
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

/* ─── Ligne article ─────────────────────────────────────────── */
function ArticleRow({ article, onToggle, onEdit, onDelete }: {
  article: Article;
  onToggle: (id: string, v: boolean) => void;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 group hover:bg-gray-50 transition-colors", !article.isAvailable && "opacity-50")}>
      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">{article.name}</span>
          {article.labels.slice(0, 2).map((l) => <span key={l} className="text-[11px]">{DISH_LABEL_EMOJI[l] ?? ""}</span>)}
        </div>
        {article.description && <p className="text-xs text-gray-400 truncate mt-0.5">{article.description}</p>}
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums shrink-0">{article.price.toFixed(2)} €</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onToggle(article.id, !article.isAvailable)}
          className="transition-colors"
          aria-label="Disponibilité"
        >
          {article.isAvailable
            ? <ToggleRight className="w-6 h-6 text-indigo-600" />
            : <ToggleLeft className="w-6 h-6 text-gray-300" />}
        </button>
        <button onClick={() => onEdit(article)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all opacity-0 group-hover:opacity-100">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => { if (confirm(`Supprimer "${article.name}" ?`)) onDelete(article.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Section catégorie ─────────────────────────────────────── */
function CategorySection({ category, onAddArticle, onToggle, onEdit, onDelete, onDeleteCategory, onRename }: {
  category: Category;
  onAddArticle: (catId: string) => void;
  onToggle: (id: string, v: boolean) => void;
  onEdit: (a: Article, catId: string) => void;
  onDelete: (id: string) => void;
  onDeleteCategory: (id: string, name: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitRename = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== category.name) onRename(category.id, trimmed);
    setEditingName(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
      {/* Category header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <GripVertical className="w-4 h-4 text-gray-300 cursor-grab shrink-0" />
        <button onClick={() => setCollapsed(!collapsed)} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {editingName ? (
          <input
            ref={inputRef}
            autoFocus
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setNameValue(category.name); setEditingName(false); } }}
            className="flex-1 text-sm font-semibold bg-white border border-indigo-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors truncate"
            title="Cliquer pour renommer"
          >
            {category.name}
          </button>
        )}

        <span className="text-xs text-gray-400 shrink-0">{category.dishes.length} article{category.dishes.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => { if (confirm(`Supprimer la catégorie "${category.name}" et tous ses articles ?`)) onDeleteCategory(category.id, category.name); }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all shrink-0"
          aria-label="Supprimer la catégorie"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Articles */}
      {!collapsed && (
        <div>
          {category.dishes.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Aucun article dans cette catégorie.
            </div>
          ) : (
            category.dishes.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                onToggle={onToggle}
                onEdit={(a) => onEdit(a, category.id)}
                onDelete={onDelete}
              />
            ))
          )}
          <div className="px-4 py-2.5 border-t border-gray-50">
            <button
              onClick={() => onAddArticle(category.id)}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter un article ici
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MenuEditor principal ──────────────────────────────────── */
export function MenuEditor({ menu, restaurantId, onBack }: { menu: Menu; restaurantId?: string; onBack: () => void }) {
  const m = useMenuMutations(restaurantId);
  const [showTranslate, setShowTranslate] = useState(false);
  const [articleModal, setArticleModal] = useState<{ open: boolean; catId?: string; editing?: Article & { categoryId: string } }>({ open: false });

  const openAdd = (catId?: string) => setArticleModal({ open: true, catId: catId ?? menu.categories[0]?.id });
  const openEdit = (article: Article, catId: string) => setArticleModal({ open: true, editing: { ...article, categoryId: catId } });
  const closeModal = () => setArticleModal({ open: false });

  const handleSaveArticle = (data: { categoryId: string; name: string; price: number; description?: string }, id?: string) => {
    if (id) {
      m.updateDish.mutate({ id, name: data.name, price: data.price, description: data.description ?? null });
    } else {
      m.addDish.mutate({ categoryId: data.categoryId, name: data.name, price: data.price, description: data.description });
    }
    closeModal();
  };

  const handleAddCategory = () => {
    const name = prompt("Nom de la catégorie :", "");
    if (name?.trim()) m.addCategory.mutate({ menuId: menu.id, name: name.trim() });
  };

  const totalArticles = menu.categories.reduce((s, c) => s + c.dishes.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Mes cartes
          </button>
          <span className="text-gray-200">|</span>
          <h1 className="text-sm font-bold text-gray-900">{menu.name}</h1>
          <span className="text-xs text-gray-400">{totalArticles} article{totalArticles !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTranslate(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Languages className="w-3.5 h-3.5" /> Traduire
          </button>
          <button
            onClick={() => m.publishMenu.mutate({ menuId: menu.id, publish: !menu.isPublished })}
            disabled={m.publishMenu.isPending}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
              menu.isPublished
                ? "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            {m.publishMenu.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : menu.isPublished ? "En ligne ✓" : "Publier"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Actions primaires */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => openAdd()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-semibold text-white transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nouvel article
          </button>
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nouvelle catégorie
          </button>
        </div>

        {/* Empty state */}
        {menu.categories.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm text-gray-500 mb-4">Votre carte est vide.</p>
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Créer la première catégorie
            </button>
          </div>
        )}

        {/* Catégories + articles */}
        {menu.categories.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            onAddArticle={openAdd}
            onToggle={(id, v) => m.updateDish.mutate({ id, isAvailable: v })}
            onEdit={openEdit}
            onDelete={(id) => m.deleteDish.mutate(id)}
            onDeleteCategory={(id, name) => m.deleteCategory.mutate(id)}
            onRename={(id, name) => m.renameCategory.mutate({ id, name })}
          />
        ))}
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
