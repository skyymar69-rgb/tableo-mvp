"use client";

import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const ContactSchema = z.object({
  civilite: z.enum(["M.", "Mme", ""]).optional(),
  prenom: z.string().min(2, "Prénom requis (2 caractères minimum)").max(50),
  nom: z.string().min(2, "Nom requis (2 caractères minimum)").max(50),
  email: z.string().email("Adresse email invalide").max(100),
  telephone: z.string().max(20).optional(),
  objet: z.enum(["support", "commercial", "rgpd", "partenariat", "autre"], {
    errorMap: () => ({ message: "Veuillez sélectionner un objet" }),
  }),
  message: z.string().min(20, "Message trop court (20 caractères minimum)").max(2000),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter la politique de confidentialité pour envoyer ce formulaire" }),
  }),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactSchema>;

const OBJET_OPTIONS = [
  { value: "support", label: "Support technique" },
  { value: "commercial", label: "Question commerciale / Abonnement" },
  { value: "rgpd", label: "Demande relative à mes données (RGPD)" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setServerMessage(json.message);
        reset();
      } else {
        setStatus("error");
        setServerMessage(json.message ?? "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setStatus("error");
      setServerMessage("Impossible de contacter le serveur. Veuillez vérifier votre connexion et réessayer.");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Message envoyé !</h2>
        <p className="text-sm text-muted-foreground">{serverMessage}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-primary hover:underline focus-ring rounded"
        >
          Envoyer un nouveau message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulaire de contact"
      className="space-y-6"
    >
      {/* Erreur serveur */}
      {status === "error" && (
        <div role="alert" aria-live="assertive" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-400">{serverMessage}</p>
        </div>
      )}

      {/* Honeypot — invisible pour les humains, piège pour les robots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor={`${formId}-website`}>Ne pas remplir ce champ</label>
        <input
          id={`${formId}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {/* Civilité + Prénom + Nom */}
      <fieldset className="space-y-1">
        <legend className="text-sm font-medium text-foreground mb-3">Identité <span className="text-red-500" aria-hidden="true">*</span></legend>
        <div className="flex flex-wrap gap-3">
          {/* Civilité */}
          <div className="w-28">
            <label htmlFor={`${formId}-civilite`} className="sr-only">Civilité</label>
            <select
              id={`${formId}-civilite`}
              autoComplete="honorific-prefix"
              className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus-ring transition-colors"
              {...register("civilite")}
            >
              <option value="">Civilité</option>
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
            </select>
          </div>

          {/* Prénom */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor={`${formId}-prenom`} className="sr-only">Prénom <span aria-label="obligatoire">*</span></label>
            <input
              id={`${formId}-prenom`}
              type="text"
              placeholder="Prénom *"
              autoComplete="given-name"
              aria-required="true"
              aria-invalid={!!errors.prenom}
              aria-describedby={errors.prenom ? `${formId}-prenom-error` : undefined}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-colors aria-invalid:border-red-500/50"
              {...register("prenom")}
            />
            <FieldError id={`${formId}-prenom-error`} message={errors.prenom?.message} />
          </div>

          {/* Nom */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor={`${formId}-nom`} className="sr-only">Nom <span aria-label="obligatoire">*</span></label>
            <input
              id={`${formId}-nom`}
              type="text"
              placeholder="Nom *"
              autoComplete="family-name"
              aria-required="true"
              aria-invalid={!!errors.nom}
              aria-describedby={errors.nom ? `${formId}-nom-error` : undefined}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-colors aria-invalid:border-red-500/50"
              {...register("nom")}
            />
            <FieldError id={`${formId}-nom-error`} message={errors.nom?.message} />
          </div>
        </div>
      </fieldset>

      {/* Email + Téléphone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-medium text-foreground block mb-1.5">
            Email <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">obligatoire</span>
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            placeholder="votre@email.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-colors aria-invalid:border-red-500/50"
            {...register("email")}
          />
          <FieldError id={`${formId}-email-error`} message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor={`${formId}-telephone`} className="text-sm font-medium text-foreground block mb-1.5">
            Téléphone <span className="text-xs text-muted-foreground font-normal">(optionnel)</span>
          </label>
          <input
            id={`${formId}-telephone`}
            type="tel"
            autoComplete="tel"
            placeholder="+33 6 00 00 00 00"
            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-colors"
            {...register("telephone")}
          />
        </div>
      </div>

      {/* Objet */}
      <div>
        <label htmlFor={`${formId}-objet`} className="text-sm font-medium text-foreground block mb-1.5">
          Objet de votre demande <span className="text-red-500" aria-hidden="true">*</span>
          <span className="sr-only">obligatoire</span>
        </label>
        <select
          id={`${formId}-objet`}
          aria-required="true"
          aria-invalid={!!errors.objet}
          aria-describedby={errors.objet ? `${formId}-objet-error` : undefined}
          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus-ring transition-colors aria-invalid:border-red-500/50"
          {...register("objet")}
        >
          <option value="">-- Sélectionner un objet --</option>
          {OBJET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <FieldError id={`${formId}-objet-error`} message={errors.objet?.message} />
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${formId}-message`} className="text-sm font-medium text-foreground block mb-1.5">
          Message <span className="text-red-500" aria-hidden="true">*</span>
          <span className="sr-only">obligatoire</span>
        </label>
        <textarea
          id={`${formId}-message`}
          rows={5}
          placeholder="Décrivez votre demande..."
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={`${formId}-message-count${errors.message ? ` ${formId}-message-error` : ""}`}
          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-colors resize-none aria-invalid:border-red-500/50"
          {...register("message")}
        />
        <FieldError id={`${formId}-message-error`} message={errors.message?.message} />
      </div>

      {/* Consentement RGPD */}
      <div className="rounded-xl border border-border bg-secondary/20 p-4">
        <div className="flex items-start gap-3">
          <input
            id={`${formId}-consentement`}
            type="checkbox"
            aria-required="true"
            aria-invalid={!!errors.consentement}
            aria-describedby={`${formId}-consentement-desc${errors.consentement ? ` ${formId}-consentement-error` : ""}`}
            className="w-4 h-4 rounded border-border mt-0.5 shrink-0 focus-ring accent-primary"
            {...register("consentement")}
          />
          <div>
            <label htmlFor={`${formId}-consentement`} className="text-sm text-foreground">
              J'accepte que mes données personnelles soient traitées par KAYZEN LYON afin de répondre à ma demande, conformément à la{" "}
              <Link href="/politique-confidentialite" target="_blank" className="text-primary hover:underline focus-ring rounded">
                politique de confidentialité
              </Link>
              . <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">obligatoire</span>
            </label>
            <p id={`${formId}-consentement-desc`} className="text-xs text-muted-foreground mt-1">
              Vos données sont traitées sur la base légale de l'intérêt légitime (réponse à votre demande) et conservées 3 ans. Vous disposez d'un droit d'accès, rectification et effacement.
            </p>
            <FieldError id={`${formId}-consentement-error`} message={errors.consentement?.message} />
          </div>
        </div>
      </div>

      {/* Champ obligatoire note */}
      <p className="text-xs text-muted-foreground">
        <span className="text-red-500" aria-hidden="true">*</span> Champs obligatoires
      </p>

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        aria-label={status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.01] transition-all focus-ring disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {status === "loading" ? (
          <>
            <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
