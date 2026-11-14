import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QrGenerator from "@/components/tools/QrGenerator";

export default async function QrPage() {
  const session = await getServerSession(authOptions);
  return <QrGenerator isGuest={!session} />;
}
