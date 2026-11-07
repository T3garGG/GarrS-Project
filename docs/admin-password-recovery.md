# Admin password recovery

Recovery memakai CLI lokal. Tidak ada endpoint publik.

## Jalankan

```bash
npm run reset-admin-password -- Garr
```

Script:

- Membaca database dari `DATABASE_URL` di `.env`.
- Hanya menerima role `ADMIN` atau `OWNER`.
- Meminta password secara tersembunyi di terminal.
- Mewajibkan minimal 12 karakter.
- Hash password memakai bcrypt cost 12.
- Tidak mencetak password atau password hash.

Jika username tidak diberikan:

```bash
npm run reset-admin-password
```

## Aturan keamanan

- Jalankan hanya dari komputer yang dipercaya.
- Jangan menaruh password sebagai argumen command.
- Jangan menambah endpoint reset password publik tanpa email/token one-time.
- Setelah berhasil, login dan pastikan password lama tidak lagi berlaku.
- Hapus salinan password dari catatan sementara.
