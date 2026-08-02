import DownloaderForm from "@/components/DownloaderForm";
import BackButton from "@/components/BackButton";

export default function Page() {
  return (
    <div>
      <BackButton />
      <DownloaderForm platform="youtube" apiPath="/api/download/youtube" />
    </div>
  );
}
