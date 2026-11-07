# Auth Validation — Downloader Dashboard

Tanggal: 2026-11-05

## Implemented

- Credentials login lewat NextAuth.
- Password diverifikasi memakai bcrypt.
- JWT session menyimpan `role` dan `permissions`.
- `/dashboard/*` dan `/admin/*` dilindungi middleware.
- API downloader memeriksa session dan permission platform.
- Admin dan owner mendapat akses privileged.
- Prisma schema valid.

## Seed account

`prisma/seed.js` sekarang membutuhkan `SEED_OWNER_PASSWORD` dari environment. Tidak ada password default yang disimpan di repository.

## Risiko yang tersisa

- Password seed sekarang wajib berasal dari environment.
- Password hash tidak bisa dibalik untuk mengetahui password account lain.
- Belum ada audit log login dan perubahan permission.

## Tindakan wajib

1. Login dengan account seed jika account tersedia.
2. Ganti password lewat halaman profile.
3. Hapus atau ubah password seed sebelum publik.
4. Rotasi `NEXTAUTH_SECRET` bila pernah bocor.
5. Pastikan database production berbeda dari database development.
