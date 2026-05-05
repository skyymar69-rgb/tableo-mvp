"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, Chrome, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signIn("credentials", { redirect: false, email: data.email, password: data.password });
      if (result?.error) {
        setAuthError("Email ou mot de passe incorrect. Veuillez réessayer.");
        toast.error("Email ou mot de passe incorrect");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 noise-overlay">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" aria-hidden="true" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-6" aria-label="Retour à l'accueil Tableo">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3" aria-hidden="true">
              <span className="text-sm font-bold text-primary-foreground" aria-hidden="true">T</span>
            </div>
            <span className="text-xl font-bold text-foreground">Tableo</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Bon retour 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Connectez-vous à votre compte</p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            aria-label="Continuer avec Google"
            aria-busy={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary focus-ring transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Chrome className="w-4 h-4" aria-hidden="true" />}
            {googleLoading ? "Connexion en cours…" : "Continuer avec Google"}
          </button>

          <div className="relative mb-6" role="separator" aria-label="ou">
            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">ou avec email</span></div>
          </div>

          {/* Erreur d'authentification globale — aria-live pour annonce lecteur d'écran */}
          {authError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
            >
              {authError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
            aria-label="Formulaire de connexion"
          >
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email <span aria-hidden="true" className="text-destructive">*</span>
                <span className="sr-only">(obligatoire)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  id="login-email"
                  {...register("email")}
                  type="email"
                  placeholder="vous@restaurant.fr"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                  className="w-full rounded-xl bg-secondary border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                />
              </div>
              {errors.email && (
                <p id="login-email-error" role="alert" className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="login-password" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Mot de passe <span aria-hidden="true" className="text-destructive">*</span>
                <span className="sr-only">(obligatoire)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  id="login-password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                  className="w-full rounded-xl bg-secondary border border-border pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-ring rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
              {errors.password && (
                <p id="login-password-error" role="alert" className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline focus-ring rounded"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.01] focus-ring transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Connexion…</>
              ) : (
                <><ArrowRight className="w-4 h-4" aria-hidden="true" /> Se connecter</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium focus-ring rounded">
            Créer un compte gratuit
          </Link>
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Sparkles className="w-3 h-3 text-primary" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Essai gratuit · Pas de carte bancaire requise</p>
        </div>
      </div>
    </div>
  );
}
