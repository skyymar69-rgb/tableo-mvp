import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const isAdmin =
    (session.user as any).role === "ADMIN" ||
    ADMIN_EMAILS.includes(session.user.email ?? "");

  if (!isAdmin) redirect("/dashboard");

  // QueryProvider est désormais fourni par le root layout (couvre toute l'app)
  return <div className="min-h-screen bg-background">{children}</div>;
}
