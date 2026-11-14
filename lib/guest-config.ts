import { prisma } from "./prisma";

export type GuestConfig = { guestMode: boolean; guestToolLimit: number; guestDownloadLimit: number };

export async function getGuestConfig(): Promise<GuestConfig> {
  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return {
    guestMode: settings?.guestMode ?? true,
    guestToolLimit: settings?.guestToolLimit ?? 10,
    guestDownloadLimit: settings?.guestDownloadLimit ?? 5,
  };
}
