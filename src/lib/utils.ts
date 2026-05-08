import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy", { locale: fr });
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateSlug(name: string): string {
  return slugify(name) + "-" + Math.random().toString(36).slice(2, 6);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* #9 — formatElapsed : durée écoulée depuis une date (minutes → "2h30min") */
export function formatElapsed(date: Date | string): string {
  const ms = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

/* #10 — isMac : détection plateforme pour les hints clavier */
export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? navigator.userAgent);
}

/* #11 — formatElapsedMs : durée en ms → label compact */
export function formatElapsedMs(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}` : `${h}h`;
}

export const DISH_LABEL_EMOJI: Record<string, string> = {
  BESTSELLER: "🔥",
  NEW: "⭐",
  VEGAN: "🌱",
  VEGETARIAN: "🥗",
  SPICY: "🌶️",
  GLUTEN_FREE: "🌾",
  CHEF_SPECIAL: "👨‍🍳",
  PROMO: "💸",
};
