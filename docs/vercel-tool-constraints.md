# Vercel Tool Constraints Audit

Tanggal: 2026-11-05

## Project constraints

- Runtime: Next.js App Router on Vercel serverless functions.
- Database: PostgreSQL via Prisma/Neon.
- Build: `prisma generate` then `next build`.
- No object storage configured.
- No background worker or persistent process configured.
- No Redis/Upstash configured.
- Downloader requests currently run synchronously through third-party APIs.

## Tool architecture decisions

- QR Generator, JSON Formatter, Text Toolkit, Password Generator: browser-only. No server request, database, or file storage.
- Image Compressor: browser-only using `FileReader`/Canvas. Never upload image by default.
- Server tools must have strict input and output limits.
- Long-running conversion, video processing, and queue workers must not run inside a normal Vercel request.
- Temporary user files must not be persisted in the application filesystem.
- Sensitive tool output must not be stored in history.

## Public launch checks

- Confirm current Vercel plan limits before enabling uploads or long-running jobs.
- Keep upload size limits below the configured platform limit.
- Add request timeouts for third-party API calls.
- Add rate limiting for every server-backed tool.
- Use external storage/worker infrastructure only when a tool genuinely needs it.

## Safe first batch

1. QR Generator
2. JSON Formatter
3. Text Toolkit
4. Password Generator
5. Client-side Image Compressor

These avoid Vercel serverless limits and require no database migration.
