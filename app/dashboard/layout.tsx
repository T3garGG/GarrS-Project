import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const pathIsPublic = true;

  if (!session && !pathIsPublic) redirect("/login");

  const role = (session?.user as any)?.role || "GUEST";
  const username = session?.user?.name || "Guest";
  const permissions: string[] = (session?.user as any)?.permissions || [];

  return (
    <div className="shell">
      <Navbar role={role} username={username} permissions={permissions} guest={!session} />
      {children}
    </div>
  );
}
