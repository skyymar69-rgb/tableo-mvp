"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, BarChart3, UtensilsCrossed, QrCode, TableIcon,
  Users, ShoppingBag, Settings, ChevronLeft, ChevronRight,
  Sun, Moon, LogOut, Building2, ChevronDown, Plus, Check, Users2, Search,
  Shield, Crown, Zap, ArrowUpRight,
} from "lucide-react";
import { CommandPalette } from "./CommandPalette";
import { useTheme } from "next-themes";
import { cn, getInitials } from "@/lib/utils";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { NotificationsDrawer } from "./NotificationsDrawer";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "QR Codes", href: "/qr", icon: QrCode },
  { label: "Tables", href: "/tables", icon: TableIcon },
  { label: "Commandes", href: "/orders", icon: ShoppingBag },
  { label: "CRM", href: "/crm", icon: Users },
  { label: "Équipe", href: "/staff", icon: Users2 },
  { label: "Paramètres", href: "/settings", icon: Settings },
];

const TIER_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  FREE: { label: "Gratuit", icon: Zap, color: "text-muted-foreground" },
  GROWTH: { label: "Growth", icon: ArrowUpRight, color: "text-blue-400" },
  ENTERPRISE: { label: "Enterprise", icon: Crown, color: "text-purple-400" },
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-emerald-400",
  ONBOARDING: "bg-yellow-400",
  SUSPENDED: "bg-red-400",
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const switcherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { data: restaurant } = useRestaurant();

  const { data: allRestaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await fetch("/api/restaurant");
      if (!res.ok) return [];
      const data = await res.json();
      return data.restaurants ?? [];
    },
    staleTime: 300_000,
  });

  const handleCollapse = (v: boolean) => {
    setCollapsed(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(v));
    }
  };

  useEffect(() => {
    if (restaurant && !activeRestaurantId) setActiveRestaurantId(restaurant.id);
  }, [restaurant, activeRestaurantId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowSwitcher(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;
  const userRole = (user as any)?.role as string ?? "OWNER";
  const userEmail = user?.email ?? "";
  const initials = user?.name ? getInitials(user.name) : "U";
  const activeRestaurant = allRestaurants?.find((r: any) => r.id === activeRestaurantId) ?? restaurant;
  const restaurantName = activeRestaurant?.name ?? "Mon restaurant";
  const restaurantStatus = activeRestaurant?.status ?? "ACTIVE";

  const isAdmin = userRole === "ADMIN" || ADMIN_EMAILS.includes(userEmail);

  /* #35 — Lire le tier depuis restaurant (source de vérité) pas depuis la session */
  const tier = (activeRestaurant as any)?.subscription?.tier ?? (activeRestaurant as any)?.tier ?? "FREE";
  const tierConfig = TIER_LABELS[tier] ?? TIER_LABELS.FREE;

  return (
    <>
    <CommandPalette />
    <aside
      aria-label="Menu de navigation"
      className={cn(
        "relative hidden md:flex flex-col h-screen border-r border-border bg-sidebar transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-border", collapsed ? "justify-center px-2" : "gap-3")}>
        <Link href="/dashboard" aria-label="Tabléo — Tableau de bord" className="flex items-center focus-ring rounded-lg">
          {collapsed ? (
            <span className="text-lg font-bold text-gradient-warm">T</span>
          ) : (
            <span className="text-xl font-bold tracking-tight text-gradient-warm">Tabléo</span>
          )}
        </Link>
      </div>

      {/* Restaurant selector */}
      {!collapsed && (
        <div className="mx-3 mt-3 relative" ref={switcherRef}>
          <button
            onClick={() => setShowSwitcher((v) => !v)}
            aria-label={`Restaurant actif : ${restaurantName}. Cliquer pour changer`}
            aria-expanded={showSwitcher}
            aria-haspopup="listbox"
            aria-controls="restaurant-switcher-list"
            className="w-full flex items-center justify-between gap-2 rounded-lg bg-secondary/60 border border-border px-3 py-2 text-xs hover:bg-secondary focus-ring transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-foreground font-medium truncate">{restaurantName}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[restaurantStatus] ?? STATUS_DOT.ACTIVE}`} />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${showSwitcher ? "rotate-180" : ""}`} />
          </button>

          {showSwitcher && (
            <div
              id="restaurant-switcher-list"
              role="listbox"
              aria-label="Choisir un restaurant"
              className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
            >
              <div className="p-1 space-y-0.5">
                {(allRestaurants ?? [restaurant]).filter(Boolean).map((r: any) => (
                  <button
                    key={r.id}
                    role="option"
                    aria-selected={r.id === activeRestaurantId}
                    onClick={() => { setActiveRestaurantId(r.id); setShowSwitcher(false); }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs hover:bg-secondary focus-ring transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-gradient-warm flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0">
                        {r.name?.charAt(0) ?? "R"}
                      </div>
                      <span className="text-foreground font-medium truncate">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[r.status] ?? STATUS_DOT.ACTIVE}`} />
                      {r.id === activeRestaurantId && <Check className="w-3 h-3 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-1">
                {/* #36 — Lien fonctionnel vers la création de restaurant */}
                <a
                  href="/settings?tab=restaurant&action=new"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-ring"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Ajouter un restaurant
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav aria-label="Pages du tableau de bord" className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <div key={item.href} className="relative group/tooltip">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group focus-ring",
                  collapsed && "justify-center px-0 w-10 h-10 mx-auto",
                  isActive
                    ? "bg-gradient-warm text-primary-foreground shadow-warm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-foreground/60" />
                )}
                <item.icon className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {!collapsed && <span className="transition-all duration-200">{item.label}</span>}
              </Link>
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150">
                  <div className="rounded-lg bg-popover border border-border px-2.5 py-1.5 text-xs font-medium text-foreground shadow-card whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Admin link — visible uniquement pour les admins */}
        {isAdmin && (
          <div className="relative group/tooltip mt-2">
            <div className={cn(!collapsed && "px-3 pt-1 pb-1")}>
              {!collapsed && <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">Admin</p>}
            </div>
            <Link
              href="/admin"
              aria-current={pathname.startsWith("/admin") ? "page" : undefined}
              aria-label={collapsed ? "Panneau Admin" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group focus-ring",
                collapsed && "justify-center px-0 w-10 h-10 mx-auto",
                pathname.startsWith("/admin")
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-muted-foreground hover:bg-purple-500/10 hover:text-purple-300"
              )}
            >
              <Shield className={cn(
                "w-4 h-4 shrink-0",
                pathname.startsWith("/admin") ? "text-purple-300" : "text-muted-foreground"
              )} />
              {!collapsed && <span>Panneau Admin</span>}
            </Link>
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150">
                <div className="rounded-lg bg-popover border border-border px-2.5 py-1.5 text-xs font-medium text-foreground shadow-card whitespace-nowrap">
                  Panneau Admin
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Upgrade CTA (FREE tier only) */}
      {!collapsed && tier === "FREE" && (
        <div className="mx-3 mb-2 rounded-xl bg-gradient-warm-subtle border border-primary/20 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Passer à Growth</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">Analytics avancés, IA illimitée, support prioritaire.</p>
          <a href="/settings?tab=billing" className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-warm py-1.5 text-[10px] font-semibold text-primary-foreground hover:scale-[1.02] transition-all">
            <Zap className="w-3 h-3" /> Upgrader maintenant
          </a>
        </div>
      )}

      {/* Bottom actions */}
      <div className="border-t border-border p-3 space-y-1">
        {!collapsed && (
          <>
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
              className="w-full flex items-center gap-2 rounded-lg bg-secondary/60 border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mb-1"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 text-left">Rechercher...</span>
              <kbd className="text-[10px] border border-border rounded px-1 py-0.5 shrink-0">⌘K</kbd>
            </button>
            <div className="flex items-center gap-2 px-1 py-1">
              <NotificationsDrawer />
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                aria-pressed={theme === "dark"}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors focus-ring"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Se déconnecter"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-ring"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        {/* Avatar + role + tier */}
        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", collapsed && "justify-center px-0")}>
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
              {initials}
            </div>
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500 border border-sidebar flex items-center justify-center">
                <Shield className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-foreground truncate">{user?.name ?? "Utilisateur"}</p>
                <span className={`text-[9px] font-medium ${tierConfig.color} shrink-0`}>{tierConfig.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => handleCollapse(!collapsed)}
        aria-label={collapsed ? "Développer la barre latérale" : "Réduire la barre latérale"}
        aria-pressed={collapsed}
        aria-expanded={!collapsed}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors z-10 focus-ring"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" aria-hidden="true" /> : <ChevronLeft className="w-3 h-3" aria-hidden="true" />}
      </button>
    </aside>
    </>
  );
}
