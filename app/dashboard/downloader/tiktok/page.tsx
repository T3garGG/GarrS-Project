import DownloaderForm from "@/components/DownloaderForm";

export default function Page() {
  return (
    <div style={{ padding: 32 }}>
      <DownloaderForm platform="tiktok" apiPath="/api/download/tiktok" />
    </div>
  );
}
