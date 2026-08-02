import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  const username = session.user?.name || "";
  const permissions: string[] = (session.user as any).permissions || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 0" }}>
      <Navbar role={role} username={username} permissions={permissions} />
      {children}
    </div>
  );
}
