import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGuestConfig } from "@/lib/guest-config";
import LoremIpsum from "@/components/tools/LoremIpsum";

export default async function LoremPage() {
  const [session, config] = await Promise.all([
    getServerSession(authOptions),
    getGuestConfig(),
  ]);
  if (!session && !config.guestMode) redirect("/login?denied=guest-off");
  return <LoremIpsum isGuest={!session} guestLimit={config.guestToolLimit} />;
}
