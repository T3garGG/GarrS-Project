import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BackButton from "@/components/BackButton";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const username = session.user?.name || "";
  const displayName = (session.user as any)?.displayName || "";

  return (
    <div style={{ maxWidth: 480 }}>
      <BackButton />
      <ProfileClient currentUsername={username} currentDisplayName={displayName} />
    </div>
  );
}
