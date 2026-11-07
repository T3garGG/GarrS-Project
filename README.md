# Downloader Dashboard

Next.js 14 App Router — auth + role/permission system, TikTok/Instagram/YouTube downloader, public chat, admin panel, splash video, and bot webhooks.

## Setup lokal

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Seed owner hanya memakai credential dari environment:

```bash
SEED_OWNER_USERNAME=owner SEED_OWNER_PASSWORD="password-random-minimal-12" npm run seed
```

Tidak ada password default di repository.

## Admin password recovery

Untuk reset admin yang lupa password, jalankan dari komputer tepercaya:

```bash
npm run reset-admin-password -- Garr
```

Password diketik tersembunyi dan tidak ditaruh sebagai argument command.

## Fitur

- Login Credentials dengan role `OWNER`, `ADMIN`, dan `MEMBER`.
- Permission per fitur.
- Downloader TikTok, Instagram, dan YouTube lewat third-party API.
- Public chat.
- Admin user management.
- Splash video yang bisa dikonfigurasi.
- WhatsApp/Telegram webhook untuk bot eksternal.
- Rate limit baseline untuk login, downloader, chat, dan webhook.
- Responsive dashboard dengan dark/light theme.

## Catatan production

1. Isi `DATABASE_URL`, `NEXTAUTH_SECRET`, dan `NEXTAUTH_URL` di Vercel.
2. Jalankan `npx prisma migrate deploy` ke database production.
3. Bot WhatsApp/Telegram harus berjalan di VPS, bukan sebagai proses persisten Vercel.
4. Jangan commit `.env`, password, webhook key, atau token.
5. Rate limiter in-process perlu diganti Redis/Upstash untuk deployment Vercel multi-instance.
6. Downloader wajib mematuhi Terms of Service dan hak cipta platform sumber.
