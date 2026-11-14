import { prisma } from "./prisma";

export type GuestConfig = { guestMode: boolean; guestToolLimit: number };

export async function getGuestConfig(): Promise<GuestConfig> {
  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return { guestMode: settings?.guestMode ?? true, guestToolLimit: settings?.guestToolLimit ?? 10 };
}
