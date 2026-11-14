import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ImageCompressor from "@/components/tools/ImageCompressor";

export default async function ImagePage() {
  const session = await getServerSession(authOptions);
  return <ImageCompressor isGuest={!session} />;
}
