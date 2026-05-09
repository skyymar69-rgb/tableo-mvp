"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2, Mail, Lock, User, Chrome, ArrowRight, Check,
  Eye, EyeOff, Phone, ChefHat, Shield,
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  firstName: z.string().min(2, "Prénom requis (2 caractères min.)"),
  lastName: z.string().min(2, "Nom requis (2 caractères min.)"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  password: z.string().min(8, "8 caractères minimum"),
  confirmPassword: z.string(),
  restaurantName: z.string().min(2, "Nom du restaurant requis"),
  restaurantType: z.string().min(1, "Type de restaurant requis"),
  terms: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les CGU" }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const RESTAURANT_TYPES = [
  { value: "bistro",        label: "Bistro / Brasserie" },
  { value: "gastronomique", label: "Gastronomique" },
  { value: "pizzeria",      label: "Pizzeria" },
  { value: "sushi",         label: "Sushi / Japonais" },
  { value: "burger",        label: "Burger / Fast-casual" },
  { value: "asiatique",     label: "Asiatique" },
  { value: "libanais",      label: "Libanais / Oriental" },
  { value: "vegan",         label: "Végétalien / Bio" },
  { value: "bar",           label: "Bar à cocktails" },
  { value: "bar-vin",       label: "Bar à vins / Cave" },
  { value: "pub",           label: "Pub / Bar sportif" },
  { value: "discoteque",    label: "Discothèque / Club" },
  { value: "rooftop",       label: "Rooftop / Terrasse bar" },
  { value: "hotel",         label: "Hôtel restaurant" },
  { value: "food-truck",    label: "Food truck" },
  { value: "traiteur",      label: "Traiteur / Épicerie fine" },
  { value: "boulangerie",   label: "Boulangerie / Café" },
  { value: "autre",         label: "Autre" },
];

const STRENGTH_LABELS = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];
const STRENGTH_COLORS = [
  "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500",
];
const STRENGTH_TEXT = [
  "text-red-400", "text-orange-400", "text-yellow-400", "text-emerald-400", "text-emerald-400",
];

function PasswordStrength({ password, id }: { password: string; id: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  return (
    <div id={id} aria-live="polite" className="mt-2 space-y-1.5">
      <div className="flex gap-1" role="img" aria-label={`Force du mot de passe : ${STRENGTH_LABELS[score]}`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? STRENGTH_COLORS[score] : "bg-border"}`} />
        ))}
      </div>
      <p className={`text-[10px] font-medium ${STRENGTH_TEXT[score]}`} aria-hidden="true">
        {STRENGTH_LABELS[score]} — {["8 car.", "Maj.", "Chiffre", "Spécial"].map((c, i) => (
          <span key={i} className={checks[i] ? "opacity-100" : "opacity-40"}>
            {c}{i < 3 ? " · " : ""}
          </span>
        ))}
      </p>
    </div>
  );
}

const perks = [
  "Menu IA en 2 minutes",
  "QR code personnalisé",
  "Analytics en temps réel",
  "Gratuit pour toujours",
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password", "");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          restaurantName: data.restaurantName,
          phone: data.phone,
          restaurantType: data.restaurantType,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Erreur lors de l'inscription");
        return;
      }
      setSuccess(true);
      await signIn("credentials", { redirect: false, email: data.email, password: data.password });
      setTimeout(() => router.push("/onboarding"), 800);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" role="status" aria-live="polite">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-gradient-warm flex items-center justify-center mx-auto mb-6 shadow-warm" aria-hidden="true">
            <Check className="w-10 h-10 text-primary-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Compte créé !</h2>
          <p className="text-muted-foreground">Redirection vers l'onboarding…</p>
          <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto mt-4" aria-hidden="true" />
        </div>
      </div>
    );
  }

  const Field = ({ id, label, required, error, children }: {
    id: string; label: string; required?: boolean; error?: string; children: React.ReactNode;
  }) => (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground mb-1.5 block">
        {label}
        {required && <><span aria-hidden="true" className="text-destructive ml-0.5">*</span><span className="sr-only"> (obligatoire)</span></>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 noise-overlay">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" aria-hidden="true" />

      <div className="relative w-full max-w-lg animate-fade-up">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-6" aria-label="Retour à l'accueil Tableo">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3" aria-hidden="true">
              <span className="text-sm font-bold text-primary-foreground" aria-hidden="true">T</span>
            </div>
            <span className="text-xl font-bold text-foreground">Tableo</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Commencer gratuitement</h1>
          <p className="text-sm text-muted-foreground mt-1">Setup en 2 minutes · Aucune carte bancaire</p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
          {/* Google OAuth */}
          <button
            onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/onboarding" }); }}
            disabled={googleLoading}
            aria-label="Continuer avec Google"
            aria-busy={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary focus-ring transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Chrome className="w-4 h-4" aria-hidden="true" />}
            {googleLoading ? "Connexion…" : "Continuer avec Google"}
          </button>

          <div className="relative mb-6" role="separator" aria-label="ou">
            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">ou avec email</span></div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
            aria-label="Formulaire d'inscription"
          >
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <Field id="signup-firstname" label="Prénom" required error={errors.firstName?.message}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  <input
                    id="signup-firstname"
                    {...register("firstName")}
                    type="text"
                    placeholder="Marie"
                    autoFocus
                    autoComplete="given-name"
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "signup-firstname-error" : undefined}
                    className="w-full rounded-xl bg-secondary border border-border pl-10 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                  />
                </div>
              </Field>
              <Field id="signup-lastname" label="Nom" required error={errors.lastName?.message}>
                <input
                  id="signup-lastname"
                  {...register("lastName")}
                  type="text"
                  placeholder="Dupont"
                  autoComplete="family-name"
                  aria-required="true"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "signup-lastname-error" : undefined}
                  className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                />
              </Field>
            </div>

            {/* Email */}
            <Field id="signup-email" label="Email professionnel" required error={errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  id="signup-email"
                  {...register("email")}
                  type="email"
                  placeholder="vous@restaurant.fr"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "signup-email-error" : undefined}
                  className="w-full rounded-xl bg-secondary border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                />
              </div>
            </Field>

            {/* Téléphone */}
            <div>
              <label htmlFor="signup-phone" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Téléphone <span className="text-muted-foreground/50">(optionnel)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  id="signup-phone"
                  {...register("phone")}
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  autoComplete="tel"
                  className="w-full rounded-xl bg-secondary border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Restaurant name + type */}
            <div className="grid grid-cols-2 gap-3">
              <Field id="signup-restaurant-name" label="Nom du restaurant" required error={errors.restaurantName?.message}>
                <div className="relative">
                  <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  <input
                    id="signup-restaurant-name"
                    {...register("restaurantName")}
                    type="text"
                    placeholder="Le Bistro"
                    autoComplete="organization"
                    aria-required="true"
                    aria-invalid={!!errors.restaurantName}
                    aria-describedby={errors.restaurantName ? "signup-restaurant-name-error" : undefined}
                    className="w-full rounded-xl bg-secondary border border-border pl-10 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                  />
                </div>
              </Field>
              <Field id="signup-restaurant-type" label="Type" required error={errors.restaurantType?.message}>
                <select
                  id="signup-restaurant-type"
                  {...register("restaurantType")}
                  aria-required="true"
                  aria-invalid={!!errors.restaurantType}
                  aria-describedby={errors.restaurantType ? "signup-restaurant-type-error" : undefined}
                  className="w-full rounded-xl bg-secondary border border-border px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none aria-[invalid=true]:border-destructive"
                >
                  <option value="">Choisir…</option>
                  {RESTAURANT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Mot de passe */}
            <Field id="signup-password" label="Mot de passe" required error={errors.password?.message}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  id="signup-password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ caractères"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={[
                    "signup-password-strength",
                    errors.password ? "signup-password-error" : "",
                  ].filter(Boolean).join(" ") || undefined}
                  className="w-full rounded-xl bg-secondary border border-border pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPassword}
                  data-focus-ring-skip
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
              <PasswordStrength password={password} id="signup-password-strength" />
            </Field>

            {/* Confirmation mot de passe */}
            <Field id="signup-confirm-password" label="Confirmer le mot de passe" required error={errors.confirmPassword?.message}>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  id="signup-confirm-password"
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Répétez votre mot de passe"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
                  className="w-full rounded-xl bg-secondary border border-border pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Masquer la confirmation" : "Afficher la confirmation"}
                  aria-pressed={showConfirm}
                  data-focus-ring-skip
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </Field>

            {/* CGU */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="signup-terms"
                {...register("terms")}
                type="checkbox"
                aria-required="true"
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? "signup-terms-error" : undefined}
                className="mt-0.5 rounded border-border accent-primary w-4 h-4 cursor-pointer shrink-0"
              />
              <label htmlFor="signup-terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                J'accepte les{" "}
                <Link href="/cgu" className="text-primary hover:underline font-medium focus-ring rounded">
                  Conditions Générales d'Utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/politique-confidentialite" className="text-primary hover:underline font-medium focus-ring rounded">
                  Politique de Confidentialité
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p id="signup-terms-error" role="alert" className="text-xs text-destructive -mt-2">
                {errors.terms.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] focus-ring transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Création…</>
                : <><ArrowRight className="w-4 h-4" aria-hidden="true" /> Créer mon compte gratuit</>
              }
            </button>
          </form>
        </div>

        {/* Perks */}
        <ul className="mt-4 grid grid-cols-2 gap-2" aria-label="Avantages inclus">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">{p}</span>
            </li>
          ))}
        </ul>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium focus-ring rounded">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
