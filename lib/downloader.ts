import { prisma } from "./prisma";

export type DownloadResult = {
  downloadUrl: string | null;
  error: string | null;
};

export async function callThirdPartyApi(
  platform: "tiktok" | "instagram" | "youtube",
  videoUrl: string
): Promise<DownloadResult> {
  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });

  const apiField: Record<typeof platform, string | null | undefined> = {
    tiktok: settings?.tiktokApiUrl,
    instagram: settings?.instagramApiUrl,
    youtube: settings?.youtubeApiUrl,
  };

  const apiUrl = apiField[platform];
  if (!apiUrl) {
    return {
      downloadUrl: null,
      error: `API ${platform} belum dikonfigurasi. Minta admin set di Admin Panel > Downloader API.`,
    };
  }

  if (!isValidUrl(apiUrl)) {
    return { downloadUrl: null, error: `URL API ${platform} tidak valid.` };
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl }),
      // 60s timeout for third-party API calls
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        downloadUrl: null,
        error: `API ${platform} error (${res.status}): ${errText || res.statusText}`,
      };
    }

    const data = await res.json().catch(() => null);
    if (!data) {
      return { downloadUrl: null, error: `API ${platform} mengembalikan respon kosong.` };
    }

    // extract download URL from common response shapes
    const downloadUrl =
      data.downloadUrl ||
      data.url ||
      data.data?.url ||
      data.data?.downloadUrl ||
      data.download_link ||
      null;

    if (!downloadUrl) {
      return {
        downloadUrl: null,
        error: `API ${platform} berhasil tapi tidak mengembalikan downloadUrl. Response: ${JSON.stringify(data).slice(0, 200)}`,
      };
    }

    return { downloadUrl, error: null };
  } catch (err: any) {
    if (err.name === "TimeoutError") {
      return { downloadUrl: null, error: `API ${platform} timeout (>60s). Coba lagi nanti.` };
    }
    return { downloadUrl: null, error: `Gagal hubungi API ${platform}: ${err.message}` };
  }
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
