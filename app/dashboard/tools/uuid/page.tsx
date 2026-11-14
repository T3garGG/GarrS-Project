import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UuidGenerator from "@/components/tools/UuidGenerator";

export default async function UuidPage() {
  const session = await getServerSession(authOptions);
  return <UuidGenerator isGuest={!session} />;
}
