import { prisma } from "@/lib/prisma";
import SplashClient from "./SplashClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return <SplashClient videoUrl={settings?.splashVideoUrl || "/splash-default.mp4"} />;
}
