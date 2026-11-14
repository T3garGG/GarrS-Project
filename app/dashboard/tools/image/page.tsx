import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGuestConfig } from "@/lib/guest-config";
import ImageCompressor from "@/components/tools/ImageCompressor";

export default async function ImagePage() {
  const [session, config] = await Promise.all([
    getServerSession(authOptions),
    getGuestConfig(),
  ]);
  if (!session && !config.guestMode) redirect("/login?denied=guest-off");
  return <ImageCompressor isGuest={!session} />;
}
