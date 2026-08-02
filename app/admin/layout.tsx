import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") redirect("/dashboard?denied=1");

  const username = session.user?.name || "";
  const displayName = (session.user as any)?.displayName || "";
  const permissions: string[] = (session.user as any).permissions || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 0" }}>
      <Navbar role={role} username={username} displayName={displayName} permissions={permissions} />
      {children}
    </div>
  );
}
