import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Si l'utilisateur n'a aucun restaurant ACTIVE, on l'envoie sur l'onboarding
  // (cas typique : 1er login, restaurant auto-créé en status ONBOARDING)
  const userId = (session.user as any).id as string | undefined;
  if (userId) {
    const activeRestaurant = await prisma.restaurant.findFirst({
      where: { ownerId: userId, status: "ACTIVE" },
      select: { id: true },
    });
    if (!activeRestaurant) redirect("/onboarding");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto pb-16 md:pb-0 focus:outline-none">
        {children}
      </main>
      <AIAssistant />
      <MobileNav />
    </div>
  );
}
