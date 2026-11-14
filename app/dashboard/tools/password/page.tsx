import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PasswordGenerator from "@/components/tools/PasswordGenerator";

export default async function PasswordPage() {
  const session = await getServerSession(authOptions);
  return <PasswordGenerator isGuest={!session} />;
}
