import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGuestConfig } from "@/lib/guest-config";
import QrGenerator from "@/components/tools/QrGenerator";

export default async function QrPage() {
  const [session, config] = await Promise.all([
    getServerSession(authOptions),
    getGuestConfig(),
  ]);
  if (!session && !config.guestMode) redirect("/login?denied=guest-off");
  return <QrGenerator isGuest={!session} guestLimit={config.guestToolLimit} />;
}
