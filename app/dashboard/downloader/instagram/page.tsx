import DownloaderForm from "@/components/DownloaderForm";

export default function Page() {
  return (
    <div style={{ padding: 32 }}>
      <DownloaderForm platform="instagram" apiPath="/api/download/instagram" />
    </div>
  );
}
