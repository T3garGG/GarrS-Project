# API and Secret Exposure Audit

Tanggal: 2026-11-05

## Environment files

- `.env` exists locally and is ignored by `.gitignore`.
- `.env.example` is present and safe: it contains placeholders only.
- `git ls-files` shows `.env` is not tracked.
- `.env` was not printed or committed.

## API route access

Protected by session:

- `/api/profile`
- `/api/chat`
- `/api/download/tiktok`
- `/api/download/instagram`
- `/api/download/youtube`
- `/api/bots/events`
- `/api/admin/users`
- `/api/admin/users/[id]`
- `/api/admin/bots`
- `/api/admin/splash`

Intentionally unauthenticated:

- `/api/auth/[...nextauth]`: required by NextAuth.
- `/api/bots/whatsapp`: protected by `x-webhook-key` lookup.
- `/api/bots/telegram`: protected by `x-webhook-key` lookup.

These webhook routes still need rate limiting, payload validation, replay protection, and safer event-size limits before public launch.

## Sensitive data risks

- `prisma/update-owner.js` was deleted because it contained hardcoded placeholder credentials and printed passwords.
- `prisma/seed.js` now requires `SEED_OWNER_PASSWORD` from environment and never prints it.
- Admin UI still displays bot `webhookKey` to admins. This is functional but should be masked and revealable only once.
- Password validation now requires 12 characters for admin-created and self-changed passwords.
- Basic in-process rate limits now cover login, downloads, chat, and bot webhooks. A shared Redis limiter is still recommended for multi-instance Vercel deployments.

## Conclusion

`.env` is correctly ignored and not tracked. No accidental `.env` commit found. Public API surface is mostly session-protected, with two key-protected webhook exceptions. Hardcoded password cleanup and baseline rate limiting are complete. Webhook key masking and distributed rate limiting remain before public launch.
