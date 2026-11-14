import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGuestConfig } from "@/lib/guest-config";
import UuidGenerator from "@/components/tools/UuidGenerator";

export default async function UuidPage() {
  const [session, config] = await Promise.all([
    getServerSession(authOptions),
    getGuestConfig(),
  ]);
  if (!session && !config.guestMode) redirect("/login?denied=guest-off");
  return <UuidGenerator isGuest={!session} guestLimit={config.guestToolLimit} />;
}
