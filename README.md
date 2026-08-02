# Downloader Dashboard

Next.js 14 (App Router) — auth + role/permission system, TikTok/Instagram/YouTube downloader (stub), public chat, admin panel (kelola akun, splash video, koneksi bot), dark/light toggle.

## Setup lokal

```bash
npm install
cp .env.example .env       # isi DATABASE_URL (Neon) & NEXTAUTH_SECRET
npx prisma migrate dev --name init
npm run seed                # bikin akun owner default: owner / changeme123
npm run dev
```

Login pertama pake `owner` / `changeme123` — **GANTI PASSWORD-NYA LANGSUNG**, jangan males, itu password contoh doang.

## Yang masih perlu lu sambungin sendiri

1. **Extractor downloader** — `app/api/download/{tiktok,instagram,youtube}/route.ts` masih stub (return 501). Pasang library kayak `btch-downloader` (TikTok/IG) atau `yt-dlp` via `child_process` (YouTube), lalu isi `downloadUrl`.
2. **Bot WhatsApp & Telegram** — bot beneran (Baileys / Telegraf) **jalan di VPS lu sendiri** (kayak project Seraphyne lu), bukan di Vercel — serverless gak bisa nampung koneksi persisten. Di Admin Panel, klik "Buat koneksi" buat dapetin `webhookKey`, terus dari proses bot lu, `POST` ke:
   - `/api/bots/whatsapp` header `x-webhook-key: <key>`
   - `/api/bots/telegram` header `x-webhook-key: <key>`
3. **Splash video** — video default udah dibundel di `public/splash-default.mp4`, muncul otomatis setelah user/admin login (halaman `/welcome`, ada tombol skip). Mau ganti videonya? Dua cara:
   - Ganti langsung file `public/splash-default.mp4` di project, commit, push
   - Atau paste URL video lain di Admin Panel > Splash Video (video di-hosting di tempat lain)

## Deploy ke Vercel

1. Bikin database Postgres gratis di [neon.tech](https://neon.tech), copy connection string ke `DATABASE_URL`.
2. Import repo ini ke Vercel, isi env vars (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` = domain Vercel lu).
3. Build command udah otomatis jalanin `prisma generate` (lihat `package.json`).
4. Jalanin `npx prisma migrate deploy` sekali (lewat Vercel CLI atau local dengan `DATABASE_URL` prod) buat bikin tabel, terus `npm run seed` sekali buat akun owner pertama.

## Role & permission

- `OWNER` / `ADMIN` — otomatis akses semua fitur + admin panel.
- `MEMBER` — cuma akses fitur yang di-checklist admin pas bikin akunnya (lihat kolom "Fitur" di Admin Panel).
