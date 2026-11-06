# 🚀 Belajar Master Brief & Web Full-Stack Development (Next.js 16 + Docker)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![PostgreSQL 18](https://img.shields.io/badge/PostgreSQL-18.6-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7.10.1-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth_1.7-purple?style=flat-square)](https://better-auth.com/)

> **"Terus belajar dan mendalami dunia teknologi agar semakin pintar, adaptif, dan mampu membangun solusi digital kelas dunia."**

---

## 📌 Informasi Repository & Pembelajar

- **Author / Developer:** Bagaskara Amukti Palapa ([@BagaskaraAP-Dev](https://github.com/BagaskaraAP-Dev))
- **Tanggal Dibuat:** Jumat, 6 November 2026
- **Waktu Pembuatan:** 18:36:03 WIB (GMT+7)
- **Topik Pembelajaran:** Penyusunan Dokumen Rekayasa Perangkat Lunak (*Master Brief*) dan Implementasi Aplikasi Web Full-Stack Modern (*Production-Ready Architecture*).

---

## 📖 Tentang Proyek Ini

Repository ini merupakan dokumentasi komprehensif dan kode sumber hasil belajar merancang serta membangun aplikasi web **Full-Stack UMKM Modern**. Proyek ini diawali dari pembuatan dokumen **Master Brief** (spesifikasi arsitektur menyeluruh) hingga eksekusi kode nyata dari nol (Milestone 0 sampai Milestone 7).

### 💡 Konsep Utama yang Dipelajari:
1. **Master Brief Engineering**: Belajar menyusun spesifikasi kebutuhan bisnis, non-fungsional, batasan teknologi, skema basis data, dan aturan kerja agent/tim secara terstruktur sebelum baris kode pertama ditulis.
2. **Next.js 16 App Router & Turbopack**: Mempelajari Server Components, Server Actions mutasi data, dynamic params as Promise, serta konvensi baru `proxy.ts` (menggantikan middleware lama).
3. **Multi-stage Docker Architecture**: Membangun kontainerisasi efisien (`base` → `deps` → `dev` → `builder` → `migrator` → `runner`), menghasilkan image produksi yang aman, non-root (`uid 1001`), dan berukuran ramping (<250 MB).
4. **PostgreSQL 18 & Prisma ORM 7**: Integrasi driver adapter native `@prisma/adapter-pg` dan skema database relasional modern.
5. **Keamanan Web (OWASP Top 10)**: Content Security Policy (CSP) ketat, sliding window rate limiting per IP, perlindungan anti-spam honeypot, pencegahan path traversal, sanitasi metadata EXIF/GPS foto dengan Sharp, dan kepatuhan privasi data (UU PDP).
6. **Reverse Proxy & HTTPS Otomatis**: Integrasi Caddy Server untuk penanganan sertifikat SSL Let's Encrypt / ZeroSSL otomatis dan kompresi zstd/gzip.
7. **CI/CD & Otomasi DevOps**: GitHub Actions pipeline untuk linting, typechecking, unit testing (Vitest), dan uji coba build image Docker.

---

## 🛠️ Stack Teknologi (Dicek per 6 November 2026)

| Komponen | Teknologi | Versi | Peran |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.4.5` | Frontend + Backend Server Actions |
| **UI Library** | React | `19.3.1` | Komponen interaktif & Server Components |
| **Bahasa** | TypeScript | `5.9.3` | Strict type checking & keandalan kode |
| **Styling** | Tailwind CSS v4 | `4.3.4` | Konfigurasi CSS-first (`@theme` tanpa file config js) |
| **Database** | PostgreSQL | `18.6` | Penyimpanan data utama (Postgres Alpine) |
| **ORM** | Prisma ORM | `7.10.1` | Pemetaan relasional & migrasi otomatis |
| **Autentikasi** | Better Auth | `1.7.18` | Login admin, manajemen sesi, rate limiting |
| **Validasi** | Zod | `4.6.7` | Validasi skema formulir klien & server |
| **Manipulasi Media** | Sharp | `0.35.5` | Re-encode WebP & pembuangan metadata privasi |
| **Reverse Proxy** | Caddy Server | `2.x Alpine` | Reverse proxy internal & SSL TLS otomatis |
| **Testing** | Vitest & Playwright | `5.1.0` / `1.65` | Unit testing & E2E integration testing |
| **Kontainer** | Docker & Compose | Multi-stage | Orkesstrasi 4 service: `db`, `migrate`, `web`, `caddy` |

---

## 📂 Struktur Proyek

```
.
├── .github/workflows/    # CI Pipeline (ESLint, Typecheck, Vitest, Docker Build)
├── docs/
│   ├── BRIEF.md          # Dokumen Master Brief spesifikasi UMKM lengkap
│   ├── DECISIONS.md      # Catatan keputusan arsitektur (Architecture Decision Log)
│   └── DEPLOY.md         # Panduan deployment VPS Ubuntu + Docker langkah demi langkah
├── prisma/
│   ├── schema.prisma     # Skema database Prisma ORM 7
│   ├── migrations/       # Riwayat migrasi PostgreSQL
│   └── seed.ts           # Seeding data toko, kategori, produk, dan admin awal
├── public/               # Asset statis, favicon, og-image default
├── scripts/
│   ├── backup.sh         # Skrip pencadangan PostgreSQL (pg_dump gz) + folder uploads
│   ├── migrate.sh        # Skrip inisialisasi migrasi database di container
│   └── restore.sh        # Skrip pemulihan database dan uploads
├── src/
│   ├── app/
│   │   ├── (site)/       # Halaman publik: Beranda, Katalog, Detail, Keranjang, Kontak, Tentang
│   │   ├── admin/        # Dashboard admin terlindungi Better Auth
│   │   ├── api/          # Route handlers: /api/auth, /api/health, /api/media
│   │   └── proxy.ts      # Proxy routing proteksi admin Next.js 16
│   ├── components/       # Komponen UI katalog, produk, keranjang, admin manager
│   ├── features/         # Logika fitur (actions, queries, zod schema)
│   └── lib/              # Utilitas database, auth, format rupiah, WhatsApp, rate limiter
├── tests/
│   ├── unit/             # Unit tests logika harga, WhatsApp, format, upload, rate limit
│   └── e2e/              # E2E Playwright tests
├── compose.yaml          # Konfigurasi bersama service Docker
├── compose.override.yaml # Konfigurasi hot reload untuk development
├── compose.prod.yaml     # Hardening & isolasi untuk lingkungan produksi
├── Caddyfile             # Konfigurasi reverse proxy & HTTPS Caddy
└── Dockerfile            # Multi-stage build (base, deps, dev, builder, migrator, runner)
```

---

## ⚡ Perintah Penting (Docker Standar)

| Tujuan | Perintah |
| :--- | :--- |
| **Menjalankan Dev (Hot Reload)** | `docker compose up --watch` |
| **Migrasi Database Baru** | `docker compose run --rm web pnpm prisma migrate dev --name <nama>` |
| **Seed Data Contoh** | `docker compose run --rm web pnpm db:seed` |
| **Menjalankan Unit Test** | `docker compose run --rm web pnpm test` |
| **Pengecekan Lint & TypeScript** | `docker compose run --rm web pnpm lint && docker compose run --rm web pnpm typecheck` |
| **Menjalankan Produksi (Caddy + SSL)** | `docker compose -f compose.yaml -f compose.prod.yaml up -d --build` |
| **Cadangkan Database & Uploads** | `./scripts/backup.sh` |
| **Pulihkan Data (Restore)** | `./scripts/restore.sh <path_file.sql.gz> [path_uploads.tar.gz]` |

---

## 📚 Dokumen Panduan & Rekayasa Lengkap

Pelajari dokumentasi teknis mendalam yang ada di dalam repository ini:
- 📑 [Master Brief Spesifikasi Lengkap (docs/BRIEF.md)](docs/BRIEF.md)
- 🧠 [Catatan Keputusan Arsitektur & Log Teknis (docs/DECISIONS.md)](docs/DECISIONS.md)
- 🚀 [Panduan Deployment VPS Ubuntu Produksi (docs/DEPLOY.md)](docs/DEPLOY.md)

---

## 🌟 Pesan Belajar

> *"Kunci menjadi hebat dalam dunia teknologi bukanlah menghafal seluruh sintaks, melainkan memahami arsitektur, tekun memecahkan masalah, dan tidak pernah berhenti bereksplorasi."*  
> **— Bagaskara Amukti Palapa (Nov 2026)**
