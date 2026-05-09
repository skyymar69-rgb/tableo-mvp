import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { ensureUserHasRestaurant } from "./auto-provision";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        // Cast `role` car le module NextAuth typed les rôles enum manuellement,
        // alors que Prisma fournit l'enum complet (ADMIN/OWNER/MANAGER/STAFF).
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role } as any;
      },
    }),
  ],
  events: {
    /** Au tout 1er signin, on auto-provisionne un restaurant pour l'utilisateur */
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.id) {
        try { await ensureUserHasRestaurant(user.id, user.name); }
        catch (e) { console.error("[auth] ensureUserHasRestaurant failed", e); }
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        // Filet de sécurité : si pour une raison X (re-login après bug, etc.)
        // l'utilisateur n'a aucun restaurant, on en crée un.
        try { await ensureUserHasRestaurant(user.id as string, user.name); }
        catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
