import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session) redirect("/login");
  if (role !== "OWNER" && role !== "ADMIN") redirect("/dashboard?denied=1");
  return <AdminClient />;
}
