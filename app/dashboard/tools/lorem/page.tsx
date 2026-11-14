import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoremIpsum from "@/components/tools/LoremIpsum";

export default async function LoremPage() {
  const session = await getServerSession(authOptions);
  return <LoremIpsum isGuest={!session} />;
}
