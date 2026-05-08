import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans:      ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display:   ['var(--font-display)', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        serif:     ['var(--font-pt-serif)', 'PT Serif', 'Georgia', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Cal.com Design System palette */
        cal: {
          ink:          "#111111",
          "ink-active": "#242424",
          body:         "#374151",
          muted:        "#6b7280",
          "muted-soft": "#898989",
          canvas:       "#ffffff",
          "surface-soft":"#f8f9fa",
          "surface-card":"#f5f5f5",
          "surface-strong":"#e5e7eb",
          "surface-dark":"#101010",
          "surface-dark-elevated":"#1a1a1a",
          hairline:     "#e5e7eb",
          "hairline-soft":"#f3f4f6",
          accent:       "#3b82f6",
          "badge-orange":"#fb923c",
          "badge-pink":  "#ec4899",
          "badge-violet":"#8b5cf6",
          "badge-emerald":"#34d399",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      /* #13 — fontSize.xxs pour labels ultra-compacts */
      fontSize: {
        xxs: ["0.625rem", { lineHeight: "0.875rem" }],
      },
      /* #14 — timing functions personnalisées */
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  /* #39 — Safelist pour classes dynamiques construites via template literals */
  safelist: [
    // STATUS_CONFIG colors — orders kanban + list view
    "bg-yellow-400/15", "text-yellow-400",
    "bg-blue-400/15",   "text-blue-400",
    "bg-emerald-400/15","text-emerald-400",
    "bg-red-400/15",    "text-red-400",
    "bg-orange-400/15", "text-orange-400",
    // #15 — couleurs activité feed
    "bg-purple-500/20", "text-purple-400",
    "bg-yellow-500/20", "text-yellow-400",
    "bg-blue-500/20",   "text-blue-400",
    "bg-emerald-500/20","text-emerald-400",
    // Badge variants — @layer utilities dans globals.css
    "badge-success", "badge-warning", "badge-error", "badge-info",
    // Tier colors in sidebar
    "text-purple-400", "text-blue-400",
    // Gradient warm subtle
    "bg-gradient-warm-subtle",
    // Chip & interactive
    "chip", "btn-ghost", "card-interactive",
    // Text sizes
    "text-xxs",
    // PS Design System band + button classes
    "band-dark", "band-light", "band-blue",
    "btn-ps-primary", "btn-ps-commerce", "btn-ps-secondary-dark", "btn-ps-secondary-light",
    "ps-card", "ps-card-dark",
    "ps-display-xl", "ps-display-lg", "ps-display-md",
    "ps-body-lg", "ps-body",
    "ps-badge", "ps-hairline",
  ],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
