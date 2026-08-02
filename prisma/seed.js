const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("changeme123", 10);
  await prisma.user.upsert({
    where: { username: "owner" },
    update: {},
    create: {
      username: "owner",
      passwordHash: hash,
      role: "OWNER",
      permissions: {
        create: [
          { feature: "TIKTOK_DL" },
          { feature: "INSTAGRAM_DL" },
          { feature: "YOUTUBE_DL" },
          { feature: "PUBLIC_CHAT" },
          { feature: "WHATSAPP_BOT" },
          { feature: "TELEGRAM_BOT" },
          { feature: "ADMIN_PANEL" },
        ],
      },
    },
  });
  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  console.log("Seeded. Login: owner / changeme123 — GANTI PASSWORD INI SEGERA.");
}

main().finally(() => prisma.$disconnect());
