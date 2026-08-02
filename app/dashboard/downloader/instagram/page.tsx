import DownloaderForm from "@/components/DownloaderForm";
import BackButton from "@/components/BackButton";

export default function Page() {
  return (
    <div>
      <BackButton />
      <DownloaderForm platform="instagram" apiPath="/api/download/instagram" />
    </div>
  );
}
