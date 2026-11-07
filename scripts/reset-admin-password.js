const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("node:readline");

const prisma = new PrismaClient();

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!hidden || !process.stdin.isTTY) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    process.stdout.write(question);
    let answer = "";
    const onData = (chunk) => {
      const char = chunk.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.off("data", onData);
        process.stdout.write("\n");
        rl.close();
        resolve(answer);
      } else if (char === "\u0003") {
        process.exit(130);
      } else if (char === "\u007f") {
        answer = answer.slice(0, -1);
      } else {
        answer += char;
      }
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}

async function main() {
  const username = process.argv[2] || await ask("Admin username: ");
  if (!username) throw new Error("Username wajib diisi.");

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true },
  });

  if (!user) throw new Error("Account tidak ditemukan.");
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Hanya ADMIN atau OWNER yang bisa di-reset lewat recovery.");
  }

  const password = await ask("Password baru (minimal 12 karakter): ", true);
  const confirmation = await ask("Ulangi password baru: ", true);

  if (password.length < 12) throw new Error("Password minimal 12 karakter.");
  if (password !== confirmation) throw new Error("Konfirmasi password tidak cocok.");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  console.log(`Password account ${user.username} berhasil diubah.`);
  console.log("Hapus terminal history atau catatan password. Jangan bagikan password.");
}

main()
  .catch((error) => {
    console.error(`Recovery gagal: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
