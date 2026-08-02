// Run sekali dari terminal: node prisma/update-owner.js
// Edit dulu NEW_USERNAME & NEW_PASSWORD di bawah sebelum run.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const OLD_USERNAME = "owner";        // username lama yang mau diganti
const NEW_USERNAME = "gantiini";     // username baru
const NEW_PASSWORD = "gantiJugaIni123"; // password baru, min 8 karakter

async function main() {
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);
  const updated = await prisma.user.update({
    where: { username: OLD_USERNAME },
    data: { username: NEW_USERNAME, passwordHash: hash },
  });
  console.log(`Berhasil. Login baru: ${updated.username} / ${NEW_PASSWORD}`);
}

main()
  .catch((e) => console.error("Gagal:", e.message))
  .finally(() => prisma.$disconnect());
