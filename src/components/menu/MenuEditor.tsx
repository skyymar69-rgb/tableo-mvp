"use client";

import { useState } from "react";
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Plus, ArrowLeft, Eye, Check, X, ToggleLeft, ToggleRight,
  Pencil, Trash2, ChevronDown, ChevronRight, Globe, Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { cn, DISH_LABEL_EMOJI } from "@/lib/utils";
import { MobileMenuPreview } from "./MobileMenuPreview";

interface Dish {
  id: string;
  name: string;
  description?: string;
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

function SortableDish({ dish, onToggle, onDelete }: {
  dish: Dish;
  onToggle: (id: string) => void;
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
        <button onClick={() => onToggle(dish.id)} className="text-muted-foreground hover:text-foreground transition-colors">
          {dish.isAvailable ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
        </button>
        <button className="opacity-0 group-hover/dish:opacity-100 text-muted-foreground hover:text-foreground transition-all">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(dish.id)} className="opacity-0 group-hover/dish:opacity-100 text-muted-foreground hover:text-destructive transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function SortableCategory({ category, onToggleDish, onDeleteDish }: {
  category: Category;
  onToggleDish: (dishId: string) => void;
  onDeleteDish: (dishId: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-border bg-gradient-card overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-secondary/30">
        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
          <GripVertical className="w-4 h-4" />
        </button>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 flex-1">
          {collapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          <span className="text-sm font-semibold text-foreground">{category.name}</span>
          <span className="text-xs text-muted-foreground">({category.dishes.length} plats)</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
          <Plus className="w-3.5 h-3.5" /> Ajouter un plat
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2">
          <SortableContext items={category.dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            {category.dishes.map((dish) => (
              <SortableDish key={dish.id} dish={dish} onToggle={onToggleDish} onDelete={onDeleteDish} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export function MenuEditor({ menu, onBack }: { menu: Menu; onBack: () => void }) {
  const [categories, setCategories] = useState<Category[]>(menu.categories);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = categories.findIndex((c) => c.id === active.id);
    const newIdx = categories.findIndex((c) => c.id === over.id);
    setCategories(arrayMove(categories, oldIdx, newIdx));
  };

  const toggleDish = (dishId: string) => {
    setCategories((cats) =>
      cats.map((c) => ({
        ...c,
        dishes: c.dishes.map((d) => d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d),
      }))
    );
  };

  const deleteDish = (dishId: string) => {
    setCategories((cats) =>
      cats.map((c) => ({ ...c, dishes: c.dishes.filter((d) => d.id !== dishId) }))
    );
    toast.success("Plat supprimé");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Menu sauvegardé avec succès !");
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <h2 className="text-lg font-bold text-foreground flex-1">{menu.name}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors", showPreview ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-foreground hover:bg-secondary/80")}>
              <Smartphone className="w-3.5 h-3.5" /> Aperçu
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all disabled:opacity-50">
              {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-gradient-warm-subtle border border-primary/20 text-xs text-foreground flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-primary shrink-0" />
          Glissez les catégories et les plats pour les réorganiser. Les modifications sont appliquées en temps réel.
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {categories.map((cat) => (
              <SortableCategory key={cat.id} category={cat} onToggleDish={toggleDish} onDeleteDish={deleteDish} />
            ))}
          </SortableContext>
        </DndContext>

        <button className="w-full rounded-2xl border-2 border-dashed border-border hover:border-primary/40 py-4 text-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une catégorie
        </button>
      </div>

      {showPreview && (
        <div className="w-[300px] shrink-0 sticky top-20 self-start">
          <p className="text-xs font-medium text-muted-foreground mb-3 text-center">Aperçu client</p>
          <MobileMenuPreview categories={categories} />
        </div>
      )}
    </div>
  );
}
