import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  civilite: z.enum(["M.", "Mme", ""]).optional(),
  prenom: z.string().min(2, "Prénom requis").max(50),
  nom: z.string().min(2, "Nom requis").max(50),
  email: z.string().email("Email invalide").max(100),
  telephone: z.string().max(20).optional(),
  objet: z.enum(["support", "commercial", "rgpd", "partenariat", "autre"], {
    errorMap: () => ({ message: "Veuillez sélectionner un objet" }),
  }),
  message: z.string().min(20, "Message trop court (20 caractères minimum)").max(2000),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter la politique de confidentialité" }),
  }),
  /* Honeypot — doit être vide. Rempli = bot. */
  website: z.string().max(0, "Champ invalide").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /* Honeypot check — silently discard without revealing detection */
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { civilite, prenom, nom, email, telephone, objet, message } = result.data;

    /* Log en développement */
    if (process.env.NODE_ENV === "development") {
      console.log("[CONTACT]", { civilite, prenom, nom, email, objet });
    }

    /*
     * Envoi d'email via SMTP (à configurer avec les variables d'environnement).
     * Exemple avec nodemailer :
     *
     * const transporter = nodemailer.createTransport({
     *   host: process.env.SMTP_HOST,
     *   port: Number(process.env.SMTP_PORT ?? 587),
     *   secure: false,
     *   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
     * });
     * await transporter.sendMail({
     *   from: `"Tableo Contact" <noreply@kayzen-lyon.fr>`,
     *   to: "contact@kayzen-lyon.fr",
     *   replyTo: email,
     *   subject: `[Tableo] ${OBJET_LABELS[objet]} — ${civilite ?? ""} ${prenom} ${nom}`,
     *   text: `Expéditeur : ${civilite ?? ""} ${prenom} ${nom} <${email}>\nTél : ${telephone ?? "N/C"}\n\n${message}`,
     * });
     */

    return NextResponse.json(
      {
        success: true,
        message: "Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CONTACT ERROR]", err);
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
