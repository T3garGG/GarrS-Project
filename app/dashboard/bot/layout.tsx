import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function BotLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  const username = session.user?.name || "";
  const displayName = (session.user as any)?.displayName || "";
  const permissions: string[] = (session.user as any).permissions || [];
  const isPrivileged = role === "OWNER" || role === "ADMIN";

  if (!isPrivileged && !permissions.includes("WHATSAPP_BOT") && !permissions.includes("TELEGRAM_BOT")) {
    redirect("/dashboard?denied=1");
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 0" }}>
      <Navbar role={role} username={username} displayName={displayName} permissions={permissions} />
      {children}
    </div>
  );
}
