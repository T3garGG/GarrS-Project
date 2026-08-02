import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WelcomeClient from "./WelcomeClient";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return (
    <WelcomeClient
      videoUrl={settings?.splashVideoUrl || "/splash-default.mp4"}
      username={session.user?.name || ""}
    />
  );
}
