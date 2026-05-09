import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export const dynamic = "force-dynamic";
function generateReferralCode(userId: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TAB-";
  for (let i = 0; i < 6; i++) {
    code += chars[userId.charCodeAt(i % userId.length) % chars.length];
  }
  return code;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const referralCode = generateReferralCode(userId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tableo.app";

  return NextResponse.json({
    code: referralCode,
    url: `${baseUrl}/signup?ref=${referralCode}`,
    referralCount: 0,
    rewardPerReferral: "1 mois gratuit",
  });
}
