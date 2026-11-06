# Website UMKM (Next.js 16 + Docker + PostgreSQL 18)

Aplikasi website UMKM modern full-stack berbasis Next.js 16 (App Router), PostgreSQL 18, Tailwind CSS v4, Better Auth, dan Prisma ORM 7, yang berjalan sepenuhnya di atas Docker.

---

## Persyaratan Sistem

- **Docker** & **Docker Compose** terpasang dan berjalan di mesin host.
- Tidak membutuhkan Node.js atau PostgreSQL terpasang di host karena seluruh runtime berjalan di dalam container Docker.

---

## Perintah Standar

| Tujuan | Perintah |
| :--- | :--- |
| **Jalankan Lingkungan Dev** | `docker compose up --watch` |
| **Migrasi Database Baru** | `docker compose run --rm web pnpm prisma migrate dev --name <nama>` |
| **Deploy Migrasi (Produksi)** | `docker compose run --rm web pnpm prisma migrate deploy` |
| **Seed Data Contoh** | `docker compose run --rm web pnpm db:seed` |
| **Jalankan Unit Test** | `docker compose run --rm web pnpm test` |
| **Jalankan E2E Test** | `docker compose run --rm web pnpm test:e2e` |
| **Lint & Typecheck** | `docker compose run --rm web pnpm lint && docker compose run --rm web pnpm typecheck` |
| **Jalankan Produksi (Caddy + SSL)** | `docker compose -f compose.yaml -f compose.prod.yaml up -d --build` |
| **Backup Database** | `./scripts/backup.sh` |
| **Restore Database** | `./scripts/restore.sh <path_file.sql.gz>` |

---

## Variabel Lingkungan (`.env`)

Salin file `.env.example` menjadi `.env` sebelum menjalankan aplikasi:

```bash
cp .env.example .env
```

Konfigurasi penting:
- `DATABASE_URL`: URL koneksi PostgreSQL internal Docker.
- `BETTER_AUTH_SECRET`: Kunci enkripsi minimal 32 karakter acak.
- `NEXT_PUBLIC_WA_NUMBER`: Nomor WhatsApp admin/toko (format internasional, tanpa tanda `+`, contoh `6281234567890`).
- `ADMIN_EMAIL` & `ADMIN_INITIAL_PASSWORD`: Akun awal admin untuk seeding pertama kali.
- `UPLOAD_MAX_MB`: Batas ukuran upload media (default: 5 MB).
