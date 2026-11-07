const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_OWNER_USERNAME || "owner";
  const password = process.env.SEED_OWNER_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error("Set SEED_OWNER_PASSWORD with at least 12 characters before running seed.");
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
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

  console.log(`Seed complete for ${username}. Password was not printed.`);
}

main()
  .catch((error) => {
    console.error(`Seed gagal: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
