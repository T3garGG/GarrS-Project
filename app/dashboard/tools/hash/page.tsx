import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HashGenerator from "@/components/tools/HashGenerator";

export default async function HashPage() {
  const session = await getServerSession(authOptions);
  return <HashGenerator isGuest={!session} />;
}
