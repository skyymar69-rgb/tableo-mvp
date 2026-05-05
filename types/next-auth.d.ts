/**
 * Amélioration #10 — Extension de types NextAuth pour éliminer tous les (user as any).id
 * Remplace le pattern (session?.user as any).id / (session?.user as any).role
 */
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "ADMIN" | "OWNER" | "STAFF";
      restaurantId?: string | null;
    };
  }

  interface User {
    id: string;
    role?: "ADMIN" | "OWNER" | "STAFF";
    restaurantId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "ADMIN" | "OWNER" | "STAFF";
    restaurantId?: string | null;
  }
}
