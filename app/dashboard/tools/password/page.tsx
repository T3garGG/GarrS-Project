import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGuestConfig } from "@/lib/guest-config";
import PasswordGenerator from "@/components/tools/PasswordGenerator";

export default async function PasswordPage() {
  const [session, config] = await Promise.all([
    getServerSession(authOptions),
    getGuestConfig(),
  ]);
  if (!session && !config.guestMode) redirect("/login?denied=guest-off");
  return <PasswordGenerator isGuest={!session} guestLimit={config.guestToolLimit} />;
}
