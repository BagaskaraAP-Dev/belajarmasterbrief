Master Brief — Website UMKM (Next.js 16 + Docker)
Nov 6, 2026 · @BAGASKARA AMUKTI PALAPA
1. Cara pakai brief ini
Brief ini adalah spesifikasi lengkap untuk satu website UMKM full-stack: Next.js 16 + PostgreSQL 18, seluruhnya berjalan di Docker. Ekspor dokumen ini ke Markdown, simpan sebagai docs/BRIEF.md di root repo, lalu tempel prompt pembuka di bawah ke AI agent.
Sebelum diserahkan, isi semua variabel {{...}} di bagian 2. Variabel yang dibiarkan kosong akan diganti agent dengan placeholder yang jelas bertanda, bukan data karangan.
Prompt pembuka untuk agent (salin apa adanya):
Kamu adalah senior full-stack engineer. Baca docs/BRIEF.md sampai habis sebelum menulis kode apa pun.

Aturan:
1. Kerjakan per milestone (bagian 11). Selesaikan satu milestone, jalankan semua cek di Definition of Done (bagian 12), commit, lalu lanjut.
2. Sebelum memasang dependency, cek versi stabil terbaru dengan `npm view <paket> version` / dokumentasi resmi. Jangan pakai versi dari ingatanmu.
3. Semua perintah dijalankan lewat Docker (`docker compose ...`). Jangan berasumsi Node atau Postgres terpasang di host.
4. Jika brief ambigu atau bertentangan, pilih opsi paling sederhana, catat keputusannya di docs/DECISIONS.md, lalu lanjut.
5. Jangan mengarang testimoni, harga, alamat, atau angka bisnis. Pakai placeholder bertanda [ISI].
6. Di akhir setiap milestone, tulis ringkasan singkat: apa yang dibuat, cara mengujinya, dan apa yang belum.
2. Konteks bisnis & tujuan
Tujuan utama: calon pembeli bisa menemukan usaha di Google, melihat katalog, lalu memesan lewat WhatsApp dalam kurang dari 3 klik. Pemilik bisa mengelola produk sendiri tanpa menyentuh kode.
Variabel yang diisi pemilik sebelum diserahkan ke agent:
| Variabel | Contoh | Isi |
| --- | --- | --- |
| {{NAMA_USAHA}} | Pempek Cek Ana |  |
| {{JENIS_USAHA}} | Kuliner / kerajinan / fashion / jasa |  |
| {{KOTA}} | Palembang, Sumatera Selatan |  |
| {{ALAMAT_LENGKAP}} | Jl. ..., Kel. ..., Kec. ... |  |
| {{NO_WHATSAPP}} | 628xxxxxxxxxx (format internasional, tanpa +) |  |
| {{JAM_BUKA}} | Sen–Sab 08.00–20.00 WIB |  |
| {{DOMAIN}} | contoh-umkm.my.id |  |
| {{WARNA_BRAND}} | #B45309 (atau "tentukan sendiri") |  |
| {{MEDSOS}} | Instagram, TikTok, Shopee, Tokopedia (URL) |  |
| {{BAHASA}} | Bahasa Indonesia (default) |  |

Pengguna:
Pengunjung/pembeli — mayoritas dari HP Android kelas menengah, sinyal 4G tidak stabil. Butuh cepat, jelas harga, dan tombol pesan yang mencolok.
Admin (pemilik UMKM) — tidak teknis. Butuh dashboard sederhana: tambah produk, ganti harga, tandai stok habis, lihat pesanan masuk.
Ukuran keberhasilan: Lighthouse mobile ≥ 90 untuk Performance, SEO, Accessibility, Best Practices; LCP < 2,5 detik di 4G; halaman produk terindeks Google; admin bisa menambah produk baru dalam < 1 menit.
Di luar cakupan MVP: pembayaran online otomatis, multi-cabang, multi-bahasa, aplikasi mobile native.
3. Stack teknologi (dicek per 6 November 2026)
Pilihan utamanya: semua versi stabil/LTS terbaru, kecuali ORM — Prisma 8 masih release candidate, jadi kita kunci di Prisma 7.
| Lapisan | Pilihan | Versi target | Alasan / catatan |
| --- | --- | --- | --- |
| Runtime | Node.js | 26 LTS | Masuk Active LTS 28 Okt 2026, didukung sampai Apr 2029 (fireup.pro). Fallback ke 24 LTS jika ada paket native yang belum kompatibel. |
| Package manager | pnpm | stabil terbaru | Pasang dengan npm i -g pnpm di Dockerfile. |
| Framework | Next.js (App Router) | 16.4.x | Rilis terbaru 16.4.3 (23 Okt 2026) (versionlog). Cache Components direkomendasikan untuk semua app baru sejak 16.4 (Next.js blog). |
| UI library | React | 19.2.x (≥ 19.2.3) | Versi di bawah 19.2.3 punya celah RCE di Server Components (codercops). |
| Bahasa | TypeScript | 5.9+ mode strict |  |
| Styling | Tailwind CSS + shadcn/ui | Tailwind 4.3.x | Konfigurasi CSS-first (@import "tailwindcss" + @theme), tanpa tailwind.config.js (versionlog). Ikon: lucide-react. |
| Database | PostgreSQL | 18 (postgres:18-alpine) | PostgreSQL 19 baru dijadwalkan GA 19 Nov 2026 (postgresql.org); upgrade setelah stabil. |
| ORM | Prisma ORM 7 | dikunci prisma@7, @prisma/client@7, @prisma/adapter-pg@7 | npm install prisma tanpa versi sekarang memasang Prisma 8 RC yang API-nya berbeda total (Prisma release status). |
| Auth admin | Better Auth | stabil terbaru | Auth.js sudah bergabung ke Better Auth; proyek baru disarankan pakai Better Auth (TurboStarter). |
| Validasi | Zod | 4.x | Dipakai bersama di form, Server Action, dan route handler. |
| Gambar | next/image + sharp |  | File upload disimpan di Docker volume; opsi S3-compatible (mis. Cloudflare R2) di fase 2. |
| Reverse proxy | Caddy | 2.x | HTTPS otomatis (Let's Encrypt), konfigurasi singkat. |
| Testing | Vitest + Playwright | stabil terbaru | Unit/integrasi + E2E. |
| Lint/format | ESLint (flat config) + Prettier |  | Next.js 16 tidak lagi menyediakan next lint; jalankan ESLint CLI langsung. |
| CI | GitHub Actions |  | Lint, typecheck, test, build image. |

Jebakan versi yang wajib diketahui agent:
Di Next.js 16, middleware.ts diganti namanya menjadi proxy.ts.
params dan searchParams di page/layout adalah Promise dan harus di-await.
Turbopack adalah bundler default untuk dev dan build; jangan menambah konfigurasi webpack.
Prisma 7 memakai prisma.config.ts, generator prisma-client dengan output di dalam src/, dan driver adapter @prisma/adapter-pg. Jangan memakai contoh kode Prisma 6 ke bawah.
Jangan memakai Tailwind v3 (@tailwind base; dan tailwind.config.js).
4. Arsitektur & Docker
Satu repo, satu aplikasi Next.js (frontend + backend sekaligus lewat Server Components, Server Actions, dan Route Handlers), satu database. docker compose up harus cukup untuk menjalankan semuanya dari nol di laptop mana pun.
Service Docker:
| Service | Image | Dev | Prod | Tugas |
| --- | --- | --- | --- | --- |
| db | postgres:18-alpine | port 5432 dibuka ke 127.0.0.1 | tidak dibuka ke luar | Data utama, volume pgdata, healthcheck pg_isready |
| migrate | build target migrator | jalan sekali | jalan sekali | prisma migrate deploy (+ seed di dev), lalu exit |
| web | build target dev / runner | next dev + hot reload | Next.js output: "standalone" | Aplikasi, volume uploads di /app/uploads |
| caddy | caddy:2-alpine | — | port 80/443 | HTTPS otomatis, reverse proxy ke web:3000, gzip/zstd |


arsitektur produksi · 4 service + 1 volume upload
Hanya Caddy yang terbuka ke internet; database dan service migrate tidak punya port publik.
Urutan start: db sehat → migrate selesai sukses → web → caddy. Pakai depends_on dengan condition: service_healthy dan service_completed_successfully.
File yang harus dibuat:
Dockerfile — multi-stage: base (node:26-slim + pnpm) → deps (pnpm install --frozen-lockfile) → dev → builder (prisma generate + next build) → migrator (Prisma CLI + folder migrations) → runner (hanya .next/standalone, .next/static, public).
compose.yaml — definisi bersama db, migrate, web.
compose.override.yaml — otomatis dipakai saat dev: target dev, develop.watch (sync src/, rebuild saat package.json berubah), port 3000.
compose.prod.yaml — target runner, restart: unless-stopped, service caddy, batas memori.
Caddyfile, .dockerignore, .env.example, scripts/backup.sh.
Aturan image runner: jalan sebagai user non-root (uid 1001), NODE_ENV=production, HOSTNAME=0.0.0.0, PORT=3000, HEALTHCHECK memanggil /api/health, tanpa source code, tanpa devDependencies, target ukuran < 250 MB.
Kerangka compose.yaml:
name: umkm
services:
  db:
    image: postgres:18-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: [pgdata:/var/lib/postgresql]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      retries: 10
  migrate:
    build: { context: ., target: migrator }
    env_file: .env
    depends_on: { db: { condition: service_healthy } }
    restart: "no"
  web:
    build: { context: ., target: runner }
    env_file: .env
    volumes: [uploads:/app/uploads]
    depends_on:
      migrate: { condition: service_completed_successfully }
volumes: { pgdata: {}, uploads: {} }
Catatan: image Postgres 18 menyimpan data di /var/lib/postgresql (bukan lagi /var/lib/postgresql/data); agent wajib memverifikasi path ini di dokumentasi image resmi sebelum memakai volume.
Perintah standar (tulis juga di README):
| Tujuan | Perintah |
| --- | --- |
| Jalankan dev | docker compose up --watch |
| Migrasi baru | docker compose run --rm web pnpm prisma migrate dev --name <nama> |
| Seed data contoh | docker compose run --rm web pnpm db:seed |
| Test | docker compose run --rm web pnpm test |
| Jalankan prod | docker compose -f compose.yaml -f compose.prod.yaml up -d --build |
| Backup DB | ./scripts/backup.sh (pg_dump terkompresi, simpan 7 terakhir) |

.env.example minimal: DATABASE_URL, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_WA_NUMBER, ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD, UPLOAD_MAX_MB=5, DOMAIN.
5. Halaman & fitur
MVP = situs publik 7 halaman + dashboard admin; pemesanan lewat WhatsApp, bukan payment gateway.
Situs publik (MVP):
| Rute | Halaman | Isi wajib |
| --- | --- | --- |
| / | Beranda | Hero (foto, tagline, tombol "Pesan via WhatsApp"), produk unggulan, keunggulan usaha, testimoni (hanya dari data admin), lokasi singkat, CTA |
| /produk | Katalog | Grid produk, filter kategori, pencarian, urut harga/terbaru, badge "Habis", paginasi |
| /produk/[slug] | Detail produk | Galeri foto, harga (format Rp 25.000), varian, deskripsi, tombol tambah ke keranjang & pesan langsung, produk terkait |
| /keranjang | Keranjang | Ubah jumlah, catatan, nama & alamat pembeli, tombol "Kirim pesanan ke WhatsApp" |
| /tentang | Tentang kami | Cerita usaha, foto, nilai |
| /kontak | Kontak & lokasi | Alamat, jam buka, embed Google Maps, tombol WA, link marketplace & medsos |
| /blog + /blog/[slug] | Artikel (opsional) | Untuk SEO: resep, tips, promo |

Alur pesan via WhatsApp:
Pembeli mengisi keranjang (disimpan di localStorage, tanpa login).
Saat checkout, Server Action memvalidasi harga & stok dari database (harga dari klien tidak dipercaya), menyimpan pesanan berstatus BARU, lalu mengembalikan nomor pesanan.
Browser membuka https://wa.me/{{NO_WHATSAPP}}?text=... berisi nomor pesanan, daftar item, total, nama, dan alamat.
Admin melihat pesanan yang sama di dashboard dan memperbarui statusnya.
Dashboard admin (/admin, MVP):
Login email + password (Better Auth), tanpa pendaftaran publik; akun admin pertama dibuat oleh seed dari .env.
Ringkasan: jumlah pesanan hari ini/minggu ini, produk habis, 5 pesanan terbaru.
CRUD produk: nama, slug otomatis, kategori, harga, harga coret, stok/tersedia, varian, foto (maks 5, drag untuk urutkan), unggulan ya/tidak.
CRUD kategori, testimoni, artikel blog.
Pesanan: daftar + filter status (BARU, DIPROSES, SELESAI, BATAL), detail, tombol buka chat WA pembeli.
Pengaturan toko: nama, logo, alamat, jam buka, nomor WA, link medsos, teks hero — semua tampil di situs tanpa deploy ulang.
Fase 2 (jangan dikerjakan sebelum MVP lolos Definition of Done):
Pembayaran online (Midtrans atau Xendit: QRIS, VA, e-wallet) + webhook.
Ongkir otomatis (RajaOngkir/Biteship).
Voucher & promo berjadwal.
Notifikasi pesanan ke admin (email atau bot Telegram).
Penyimpanan gambar S3-compatible dan CDN.
Laporan penjualan bulanan + ekspor CSV.
PWA (bisa di-install di HP).
6. Model data
Harga selalu disimpan sebagai Int dalam rupiah (tanpa desimal), dan harga di OrderItem disalin saat pesanan dibuat agar riwayat tidak berubah ketika harga produk diganti.
// prisma/schema.prisma (Prisma ORM 7)
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
datasource db { provider = "postgresql" }

model StoreSetting {           // satu baris saja (id = 1)
  id          Int     @id @default(1)
  name        String
  tagline     String?
  logoUrl     String?
  address     String?
  mapsEmbed   String?
  waNumber    String
  openHours   String?
  socials     Json    @default("{}")
  heroTitle   String?
  heroText    String?
  updatedAt   DateTime @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  sort     Int       @default(0)
  products Product[]
}

model Product {
  id           String           @id @default(cuid())
  name         String
  slug         String           @unique
  description  String
  price        Int
  comparePrice Int?
  isAvailable  Boolean          @default(true)
  stock        Int?             // null = tidak dilacak
  isFeatured   Boolean          @default(false)
  categoryId   String?
  category     Category?        @relation(fields: [categoryId], references: [id])
  images       ProductImage[]
  variants     ProductVariant[]
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  deletedAt    DateTime?        // soft delete
  @@index([categoryId, isAvailable])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  path      String  // relatif terhadap /app/uploads
  alt       String
  width     Int
  height    Int
  sort      Int     @default(0)
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String  // mis. "Level pedas 3", "Ukuran L"
  priceDiff Int     @default(0)
}

enum OrderStatus { BARU DIPROSES SELESAI BATAL }

model Order {
  id            String      @id @default(cuid())
  code          String      @unique // mis. UMK-20261106-0007
  customerName  String
  customerPhone String
  address       String?
  note          String?
  total         Int
  status        OrderStatus @default(BARU)
  items         OrderItem[]
  createdAt     DateTime    @default(now())
  @@index([status, createdAt])
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String?
  productName String  // snapshot
  variantName String?
  unitPrice   Int     // snapshot
  qty         Int
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  content   String
  rating    Int?
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String    // Markdown
  coverPath   String?
  publishedAt DateTime?
  updatedAt   DateTime  @updatedAt
}
Tabel autentikasi (user, session, account, verification) dibuat lewat generator skema Better Auth untuk Prisma, lalu digabungkan ke file skema yang sama. URL koneksi dibaca dari prisma.config.ts, bukan dari blok datasource.
7. Struktur folder & konvensi kode
.
├─ docs/                 BRIEF.md, DECISIONS.md, DEPLOY.md
├─ prisma/               schema.prisma, migrations/, seed.ts
├─ public/               favicon, og-default.jpg, robots tambahan
├─ scripts/              backup.sh, restore.sh
├─ src/
│  ├─ app/
│  │  ├─ (site)/          beranda, produk, keranjang, tentang, kontak, blog
│  │  ├─ admin/           dashboard (layout terproteksi)
│  │  ├─ api/             auth/[...all], health, media/[...path]
│  │  ├─ sitemap.ts, robots.ts, manifest.ts
│  │  └─ layout.tsx, not-found.tsx, error.tsx
│  ├─ components/
│  │  ├─ ui/              komponen shadcn/ui
│  │  ├─ site/            header, footer, product-card, wa-button
│  │  └─ admin/           tabel, form produk, uploader
│  ├─ features/            products/, orders/, settings/ → actions.ts, queries.ts, schema.ts
│  ├─ lib/                 db.ts, auth.ts, format.ts (rupiah, tanggal), whatsapp.ts, upload.ts
│  ├─ generated/prisma/    hasil prisma generate (gitignore)
│  └─ proxy.ts             proteksi /admin
├─ tests/                unit/, e2e/
├─ Dockerfile, compose*.yaml, Caddyfile, .env.example
└─ prisma.config.ts, next.config.ts, eslint.config.mjs, tsconfig.json
Konvensi:
Default ke Server Components; "use client" hanya untuk komponen interaktif (keranjang, galeri, form).
Mutasi lewat Server Actions di features/*/actions.ts; setiap action memvalidasi input dengan Zod dan memeriksa sesi admin di dalam action itu sendiri (jangan hanya mengandalkan proxy.ts).
Query database hanya di features/*/queries.ts dan file server; Prisma client tidak boleh diimpor ke komponen client (tandai dengan import "server-only").
Data publik di-cache dengan Cache Components ("use cache" + cacheTag); setelah admin mengubah produk/pengaturan, panggil revalidasi tag terkait.
Format angka & tanggal lewat Intl locale id-ID, zona waktu Asia/Jakarta.
Nama file kebab-case, komponen PascalCase, teks UI berbahasa Indonesia, komentar & commit boleh bahasa Inggris.
Commit gaya Conventional Commits (feat:, fix:, chore:).
8. Keamanan
Target: lolos checklist OWASP Top 10 dasar dan tidak ada temuan High/Critical dari pnpm audit serta scan image (Trivy atau Docker Scout) saat rilis.
| Area | Aturan wajib |
| --- | --- |
| Rahasia | Semua secret di .env (tidak di-commit); .env.example tanpa nilai asli. BETTER_AUTH_SECRET minimal 32 byte acak. |
| Auth admin | Password di-hash oleh Better Auth; rate limit login (mis. 5 percobaan / 15 menit per IP); cookie HttpOnly, Secure, SameSite=Lax; sesi kedaluwarsa 7 hari. |
| Otorisasi | Setiap Server Action & route handler admin memanggil requireAdmin(); proxy.ts hanya lapis pertama. |
| Input | Semua input divalidasi Zod di server; harga & stok saat checkout dihitung ulang dari DB. |
| SQL | Hanya lewat Prisma; $queryRaw hanya dengan template tag yang ter-parameter. |
| XSS | Tanpa dangerouslySetInnerHTML kecuali konten Markdown yang sudah disanitasi; embed Maps hanya menerima URL google.com/maps/embed. |
| Upload | Hanya JPEG/PNG/WebP, cek magic bytes (bukan hanya ekstensi), maks UPLOAD_MAX_MB, re-encode lewat sharp (membuang metadata EXIF/GPS), nama file acak, path traversal ditolak di /api/media. |
| Header | CSP ketat, Strict-Transport-Security, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy, frame-ancestors 'none'. |
| Spam | Checkout publik dibatasi rate limit per IP + honeypot field. |
| Container | User non-root, image minimal, read_only: true untuk web kecuali volume uploads & /tmp, DB tidak diekspos ke internet. |
| Data pribadi | Nomor HP & alamat pembeli hanya terlihat oleh admin; sediakan penghapusan pesanan lama (sejalan dengan UU PDP). |
| Backup | pg_dump harian + salinan folder uploads; uji restore sekali sebelum go-live. |

9. SEO lokal, performa, aksesibilitas
Prioritasnya: muncul di pencarian "{{JENIS_USAHA}} {{KOTA}}" dan tetap cepat di HP murah.
SEO:
generateMetadata per halaman: title unik (Nama Produk – {{NAMA_USAHA}}), description 140–160 karakter, canonical, Open Graph + gambar OG per produk.
JSON-LD: LocalBusiness (atau subtipe seperti Restaurant/Store) di beranda & kontak, dengan alamat, jam buka, nomor telepon, koordinat; Product + Offer (harga IDR, ketersediaan) di detail produk; BreadcrumbList.
sitemap.ts dinamis dari produk, kategori, artikel; robots.ts menutup /admin dan /api.
URL bersih berbasis slug, lang="id", heading berurutan (satu h1 per halaman).
Checklist untuk pemilik di docs/DEPLOY.md: daftarkan Google Business Profile & Google Search Console, submit sitemap.
Performa (target di HP, koneksi 4G):
| Metrik | Target |
| --- | --- |
| LCP | < 2,5 detik |
| INP | < 200 ms |
| CLS | < 0,1 |
| JS awal halaman publik | < 150 KB gzip |
| Skor Lighthouse mobile (4 kategori) | ≥ 90 |

Caranya: Server Components sebanyak mungkin, next/image dengan sizes yang benar dan format AVIF/WebP, next/font untuk font lokal (tanpa request ke Google Fonts saat runtime), gambar hero di-preload (cek prop yang berlaku di Next.js 16: preload menggantikan priority), tanpa library animasi berat, embed Google Maps di-lazy-load lewat tombol "Tampilkan peta".
Aksesibilitas (WCAG 2.2 AA): kontras teks ≥ 4.5:1, semua gambar punya alt (wajib diisi admin saat upload), navigasi keyboard penuh dengan fokus terlihat, target sentuh ≥ 44×44 px, label pada semua input, pesan error form dibacakan screen reader (aria-live).
10. Arah desain UI
Kesan yang dituju: hangat, lokal, dan bisa dipercaya — seperti etalase toko yang rapi, bukan template startup generik.
Mobile-first: desain dimulai dari lebar 360 px; tombol WhatsApp melayang (sticky) di pojok kanan bawah pada halaman publik.
Warna: satu warna brand {{WARNA_BRAND}} sebagai aksen, netral hangat untuk latar; didefinisikan sebagai token di @theme Tailwind dan dipakai juga oleh shadcn/ui. Sediakan mode gelap hanya jika tidak memperlambat MVP.
Tipografi: satu font sans untuk teks (mis. Plus Jakarta Sans), opsional satu font display untuk judul; ukuran teks dasar 16 px.
Foto produk adalah bintang utama: rasio konsisten (1:1 untuk kartu, 4:3 untuk galeri), latar bersih. Jika foto belum ada, pakai placeholder abu-abu bertuliskan "Foto produk", bukan foto stok.
Kartu produk: foto, nama (maks 2 baris), harga tebal, harga coret bila ada, badge "Habis"/"Terlaris", tombol "+ Keranjang".
Admin: layout sidebar + tabel shadcn/ui, tombol aksi besar, konfirmasi sebelum menghapus, toast setelah simpan, semua label berbahasa Indonesia sederhana ("Simpan", "Produk habis", bukan "Out of stock").
Copywriting: gunakan bahasa santai-sopan sesuai {{JENIS_USAHA}}; teks contoh harus ditandai [ISI] agar pemilik menggantinya.
11. Rencana kerja bertahap
Delapan milestone berurutan; setiap milestone diakhiri commit dan ringkasan, dan milestone berikutnya baru dimulai setelah kriteria "selesai" terpenuhi.
M0 — Fondasi. Init Next.js 16 (TypeScript, App Router, src/), Tailwind 4, shadcn/ui, ESLint + Prettier, Dockerfile multi-stage, compose.yaml + override, .env.example, /api/health.
Selesai jika: docker compose up --watch menampilkan halaman awal di localhost:3000 dan hot reload berjalan.
M1 — Database. Prisma 7 + adapter pg, skema bagian 6, migrasi awal, service migrate, seed (pengaturan toko, 3 kategori, 8 produk contoh bertanda [ISI], akun admin dari .env).
Selesai jika: DB kosong → docker compose up → data seed tampil di Prisma Studio.
M2 — Situs publik. Layout, header/footer, beranda, katalog dengan filter & pencarian, detail produk, tentang, kontak, halaman 404.
Selesai jika: semua rute bagian 5 tampil dengan data dari DB dan responsif di 360 px.
M3 — Keranjang & pesanan WA. Keranjang localStorage, Server Action checkout dengan validasi ulang harga, pembuatan kode pesanan, redirect ke wa.me.
Selesai jika: test E2E "tambah 2 produk → checkout → URL WhatsApp berisi item & total yang benar" lulus.
M4 — Admin. Better Auth login, proteksi /admin, dashboard ringkasan, CRUD produk + upload gambar, kategori, testimoni, pesanan, pengaturan toko, revalidasi cache.
Selesai jika: admin bisa menambah produk berfoto dan produk itu langsung muncul di katalog.
M5 — SEO & performa. Metadata, JSON-LD, sitemap, robots, gambar OG, optimasi gambar & font.
Selesai jika: Lighthouse mobile ≥ 90 di beranda, katalog, detail produk; Rich Results Test valid.
M6 — Keamanan & hardening. Header keamanan & CSP, rate limit, validasi upload, container non-root & read-only, audit dependency, scan image.
Selesai jika: checklist bagian 8 tercentang semua dan tidak ada temuan High/Critical.
M7 — Produksi. compose.prod.yaml, Caddy + HTTPS, skrip backup/restore, GitHub Actions (lint, typecheck, test, build), docs/DEPLOY.md langkah deploy ke VPS (Ubuntu + Docker).
Selesai jika: deploy dari nol ke VPS mengikuti DEPLOY.md berhasil dan restore backup teruji.
12. Definition of Done & aturan kerja agent
Sebuah milestone dianggap selesai hanya jika semua cek di bawah lulus di dalam container, bukan di host.
Cek wajib per milestone:
☐ pnpm lint dan pnpm typecheck (tsc --noEmit) tanpa error
☐ pnpm test (Vitest) lulus; logika harga, format rupiah, dan pesan WhatsApp punya unit test
☐ pnpm test:e2e (Playwright) lulus untuk alur yang sudah ada
☐ docker compose build sukses dan image runner berjalan sehat (/api/health = 200)
☐ Tidak ada console.log sisa, any baru, atau TODO tanpa catatan di DECISIONS.md
☐ README & .env.example diperbarui bila ada perubahan perintah atau variabel
Cek akhir sebelum go-live:
☐ Semua placeholder [ISI] dan {{...}} sudah diganti data asli oleh pemilik
☐ Lighthouse mobile ≥ 90 (4 kategori) di 3 halaman utama
☐ Uji di HP Android sungguhan: katalog, keranjang, dan tombol WA berfungsi
☐ Backup & restore teruji, HTTPS aktif, /admin tidak terindeks
☐ Pemilik berhasil login dan menambah produk sendiri tanpa bantuan
Aturan kerja agent:
Jangan menambah dependency di luar bagian 3 tanpa alasan tertulis di DECISIONS.md.
Selalu pakai dokumentasi resmi versi terkini (Next.js 16, Prisma 7, Tailwind 4, Better Auth); abaikan tutorial lama.
Perubahan kecil dan bisa di-review: satu fitur per commit.
Jangan menghapus data, migrasi, atau volume tanpa izin eksplisit.
Jika sebuah perintah gagal dua kali dengan cara yang sama, berhenti dan laporkan error lengkap beserta dugaan penyebabnya.
Sumber versi
Next.js 16.4 — Next.js Blog
Next.js release history — versionlog
Node.js 26 LTS — fireup.pro
PostgreSQL 19 RC 1 — postgresql.org
Tailwind CSS release history — versionlog
Prisma ORM release status — prisma.io
Better Auth vs Clerk vs NextAuth vs Supabase Auth — TurboStarter
React 19.2 vs React 20 — CoderCops