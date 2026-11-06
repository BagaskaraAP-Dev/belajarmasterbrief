# Architecture & Decision Log (DECISIONS.md)

Dokumen ini mencatat semua keputusan teknis, pilihan arsitektur, dan penyesuaian yang diambil selama implementasi Website UMKM sesuai Master Brief.

---

## 1. Versi Dependencies & Pilihan Paket (Dicek per 6 Nov 2026)

- **Node.js**: `node:26-slim` (Active LTS).
- **Package Manager**: `pnpm` (diinstall global via `npm i -g pnpm` di Dockerfile). Konfigurasi `pnpm.onlyBuiltDependencies` diset untuk `@prisma/client`, `@prisma/engines`, `prisma`, `esbuild`, dan `sharp` agar script native build diizinkan berjalan di pnpm 12+.
- **Next.js**: `16.4.5` (App Router, standalone output, Cache Components, proxy.ts).
- **React / React-DOM**: `19.3.1` (versi aman dari celah Server Components).
- **TypeScript**: `5.9.3` dengan strict mode (`"strict": true`).
- **Styling**: Tailwind CSS `4.3.4` + `@tailwindcss/postcss` (CSS-first, `@import "tailwindcss";`, `@theme` token tanpa tailwind.config.js).
- **Database**: PostgreSQL `18.6` (`postgres:18-alpine`). Catatan: direktori data PostgreSQL 18 berada di `/var/lib/postgresql/18/docker`, sehingga volume mapping `pgdata:/var/lib/postgresql` mencakup seluruh data dengan aman.
- **ORM**: Prisma `7.10.1`, `@prisma/client` `7.10.1`, `@prisma/adapter-pg` `7.10.1` (dikunci ke Prisma 7, bukan Prisma 8 RC). Output client diarahkan ke `src/generated/prisma`.
- **Autentikasi**: `better-auth` `1.7.18` (terintegrasi dengan Prisma adapter).
- **Validasi Schema**: `zod` `4.6.7` (didukung native oleh Better Auth 1.7.x dan Next Server Actions).
- **Manipulasi Gambar**: `sharp` `0.35.5`.
- **Testing**: `vitest` `5.1.0` (unit test) dan `@playwright/test` `1.65.0` (E2E test).
- **Icons & UI Helpers**: `lucide-react` `1.70.0`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- **Server Guard**: `server-only` `^0.0.1` (memastikan `db.ts` dan fungsi server tidak dapat diimpor ke komponen client).


---

## 2. Pilihan Nilai Konfigurasi Default & Placeholder

Karena variabel bisnis di Section 2 belum diisi pemilik:
- `{{NAMA_USAHA}}`: `[ISI_NAMA_USAHA]` (Toko Berkah UMKM)
- `{{JENIS_USAHA}}`: `[ISI_JENIS_USAHA]` (Kuliner & Makanan Ringan)
- `{{KOTA}}`: `[ISI_KOTA]` (Palembang, Sumatera Selatan)
- `{{ALAMAT_LENGKAP}}`: `[ISI_ALAMAT_LENGKAP]` (Jl. Merdeka No. 123)
- `{{NO_WHATSAPP}}`: `6281234567890` (format internasional tanpa +)
- `{{JAM_BUKA}}`: `[ISI_JAM_BUKA]` (Senin - Sabtu 08.00 - 20.00 WIB)
- `{{DOMAIN}}`: `contoh-umkm.my.id`
- `{{WARNA_BRAND}}`: `#B45309` (Amber-700 / oranye-keemasan hangat khas UMKM)
- `{{MEDSOS}}`: `{"instagram": "https://instagram.com/[ISI]", "tiktok": "https://tiktok.com/@[ISI]", "shopee": "https://shopee.co.id/[ISI]", "tokopedia": "https://tokopedia.com/[ISI]"}`
- `{{BAHASA}}`: `Bahasa Indonesia` (id-ID)

---

## 3. Arsitektur Docker & Keamanan

- **Multi-stage Dockerfile**:
  1. `base`: `node:26-slim` + install `pnpm`.
  2. `deps`: install dependencies menggunakan `pnpm install --frozen-lockfile`.
  3. `dev`: mounting kode sumber untuk development dengan hot-reloading (`next dev`).
  4. `builder`: menjalankan `prisma generate` dan `next build`.
  5. `migrator`: menjalankan `prisma migrate deploy` (dan seed untuk dev).
  6. `runner`: image produksi minimal tanpa devDependencies, user non-root `nodejs:nextjs` (uid 1001), `output: "standalone"`.
- **Jaringan & Akses**: Hanya Caddy (port 80/443) yang terbuka ke internet pada lingkungan produksi. Database PostgreSQL dan web server internal tidak diekspos ke publik di produksi.
- **Upload Directory**: Disimpan pada volume Docker `uploads` di `/app/uploads`, disajikan melalui route aman `/api/media/[...path]` dengan validasi magic bytes, re-encode sharp (hapus metadata EXIF/GPS), dan proteksi path traversal.
- **Proteksi Admin**: `src/proxy.ts` (Next.js 16) untuk redirect layer pertama + verifikasi sesi Better Auth di setiap Server Action / API route (`requireAdmin()`). Catatan penting Next.js 16: file `src/middleware.ts` tidak boleh ada bersamaan dengan `src/proxy.ts` agar tidak terjadi error bentrok konvensi.

---

## 4. Keamanan & Hardening (Milestone 6)

- **HTTP Security Headers & CSP**: Diterapkan melalui `next.config.ts` untuk seluruh rute (`/:path*`), mencakup Content Security Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, dan Permissions-Policy.
- **Rate Limiting**:
  - Login Admin: Dikonfigurasi di `src/lib/auth.ts` dengan batas maksimal 5 percobaan per 15 menit per IP.
  - Checkout Publik: Dilindungi in-memory sliding window rate limiter di `src/lib/rate-limit.ts` (maksimal 10 pesanan per 10 menit per IP) dan validasi honeypot field (`hp_website`) tak kasat mata di form keranjang untuk menangkal bot spam.
- **Kepatuhan Privasi Data (UU PDP)**: Disediakan Server Action `deleteOldOrdersAction()` dan tombol pembersihan pada dashboard admin untuk menghapus riwayat pesanan pelanggan yang berusia lebih dari 90 hari.
- **Keamanan Media & Isolasi Kontainer**:
  - Validasi magic bytes (JPEG/PNG/WebP), penghapusan metadata EXIF/GPS via Sharp, pembatasan ukuran maksimal, penolakan path traversal (`..`, `/`, `\`).
  - Runner container berjalan sebagai user non-root (`nextjs:1001`), root filesystem diset `read_only: true`, direktori tulis temporer dialokasikan ke tmpfs (`/tmp:rw,noexec,nosuid,size=64m`), dan volume `uploads` dimount terisolasi.

---

## 5. Produksi & Operasional (Milestone 7)

- **Reverse Proxy Caddy**: Menangani terminate SSL/TLS otomatis dari Let's Encrypt / ZeroSSL, kompresi gzip dan zstd, serta memforward lalu lintas secara internal ke service `web:3000`.
- **Pencadangan & Pemulihan (Backup & Restore)**:
  - `scripts/backup.sh`: Mengompresi dump PostgreSQL (`pg_dump` gzip) dan mengarsipkan folder upload media produk, dengan rotasi retensi 7 backup terakhir.
  - `scripts/restore.sh`: Mendukung pemulihan database dari file `backup_*.sql.gz` dan sinkronisasi kembali folder media dari file `uploads_*.tar.gz`.
- **CI / CD Pipeline**: Dikonfigurasi pada `.github/workflows/ci.yml` untuk menjalankan linting ESLint, typecheck TypeScript, Vitest unit test, Next.js build, serta verifikasi build target image Docker runner.
- **Dokumentasi Deployment**: Panduan instalasi dan deployment lengkap langkah demi langkah dari nol ke VPS Ubuntu dicatat di `docs/DEPLOY.md`, lengkap dengan checklist pasca-deploy (Google Search Console, sitemap, Google Business Profile).
