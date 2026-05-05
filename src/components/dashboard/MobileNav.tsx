"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, Settings, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Menu",      href: "/menu",      icon: UtensilsCrossed },
  { label: "Commandes", href: "/orders",    icon: ShoppingBag },
  { label: "QR",        href: "/qr",        icon: QrCode },
  { label: "Réglages",  href: "/settings",  icon: Settings },
];

/**
 * #44 — Navigation mobile bottom bar (dashboard)
 * Amélioration : indicateur actif pill + active scale + safe-area-inset-bottom
 */
export function MobileNav() {
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw ?? "";

  return (
    <nav
      aria-label="Navigation mobile principale"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40 safe-area-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2 h-16">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 focus-ring min-w-[52px]",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {/* Active pill background */}
              <span className={cn(
                "relative flex items-center justify-center w-10 h-6 rounded-full transition-all duration-200",
                isActive ? "bg-primary/12" : ""
              )}>
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110" : "scale-100"
                  )}
                  aria-hidden="true"
                />
              </span>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive ? "font-semibold" : ""
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
