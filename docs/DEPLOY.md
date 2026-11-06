# Panduan Deployment Produksi (DEPLOY.md)

Panduan langkah-demi-langkah penerapan (deployment) Website UMKM ke Virtual Private Server (VPS) berbasis **Ubuntu Linux** menggunakan **Docker Compose**, **PostgreSQL 18**, dan **Caddy Reverse Proxy (HTTPS Otomatis)**.

---

## 1. Prasyarat Server & Domain

- **VPS**: Ubuntu 24.04 LTS atau 22.04 LTS (Rekomendasi minimal 1 vCPU, 2 GB RAM, 20 GB SSD).
- **Akses**: Akses root atau user dengan hak `sudo`.
- **Domain**: Domain aktif yang sudah diarahkan DNS **A Record** ke alamat IP publik VPS:
  - `@` (root domain) -> `IP_VPS`
  - `www` -> `IP_VPS` (opsional)

---

## 2. Persiapan Lingkungan VPS

Hubungkan SSH ke VPS Anda:
```bash
ssh user@IP_VPS
```

Perbarui paket sistem dan pasang utilitas dasar:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw gzip tar
```

### Konfigurasi Firewall (UFW)
Buka port 22 (SSH), 80 (HTTP), dan 443 (HTTPS):
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Pasang Docker Engine & Docker Compose
Gunakan skrip instalasi resmi Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```
*(Keluar dari sesi SSH dan login kembali agar izin grup docker aktif)*.

---

## 3. Clone Repository & Konfigurasi Lingkungan (.env)

Clone repository ke folder `/opt/umkm` atau home direktori:
```bash
sudo mkdir -p /opt/umkm && sudo chown -R $USER:$USER /opt/umkm
git clone <URL_REPOSITORY_ANDA> /opt/umkm
cd /opt/umkm
```

Salin template konfigurasi:
```bash
cp .env.example .env
```

Buka dan sesuaikan berkas `.env` menggunakan nano atau editor teks:
```bash
nano .env
```

Pastikan mengisi variabel penting berikut:
```env
# Database PostgreSQL (Internal Docker)
POSTGRES_DB=umkm_db
POSTGRES_USER=umkm_user
POSTGRES_PASSWORD=GantiDenganPasswordDatabaseSangatKuatDanAcak
DATABASE_URL=postgresql://umkm_user:GantiDenganPasswordDatabaseSangatKuatDanAcak@db:5432/umkm_db

# Kunci Rahasia Better Auth (Wajib diisi string acak minimal 32 karakter)
# Buat string acak dengan perintah: openssl rand -base64 32
BETTER_AUTH_SECRET=GantiDenganStringRahasiaAcakMinimal32Karakter

# URL Domain Publik
BETTER_AUTH_URL=https://nama-domain-umkm.com
NEXT_PUBLIC_SITE_URL=https://nama-domain-umkm.com
DOMAIN=nama-domain-umkm.com

# Kontak WhatsApp & Admin Pertama
NEXT_PUBLIC_WA_NUMBER=6281234567890
ADMIN_EMAIL=admin@nama-domain-umkm.com
ADMIN_INITIAL_PASSWORD=GantiDenganPasswordAdminKuat123!
```

---

## 4. Menjalankan Aplikasi di Lingkungan Produksi

Jalankan container produksi menggunakan berkas gabungan `compose.yaml` dan `compose.prod.yaml`:
```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

### Verifikasi Status Service:
Periksa apakah seluruh service (`db`, `migrate`, `web`, `caddy`) berjalan dengan baik:
```bash
docker compose -f compose.yaml -f compose.prod.yaml ps
```
- `db`: berstatus *healthy*
- `migrate`: berstatus *exited (0)* (sukses menjalankan migrasi)
- `web`: berstatus *healthy*
- `caddy`: berstatus *running*

Cek healthcheck aplikasi web secara langsung:
```bash
curl -f http://127.0.0.1:3000/api/health
# Harus mengembalikan: {"status":"ok","timestamp":...}
```

Buka domain Anda di browser (`https://nama-domain-umkm.com`). Caddy akan secara otomatis menerbitkan sertifikat SSL TLS gratis dari Let's Encrypt / ZeroSSL.

---

## 5. Otomasi Pencadangan Harian (Backup Cron)

Proyek ini telah dilengkapi skrip pencadangan otomatis `scripts/backup.sh` yang mencadangkan database PostgreSQL (`pg_dump` gzip) dan seluruh folder upload gambar produk, dengan retensi otomatis 7 hari terakhir.

Jadikan skrip dapat dieksekusi:
```bash
chmod +x ./scripts/*.sh
```

Buka crontab VPS:
```bash
crontab -e
```

Tambahkan baris berikut untuk menjalankan backup setiap hari pukul 02:00 pagi:
```cron
0 2 * * * cd /opt/umkm && ./scripts/backup.sh >> /var/log/umkm-backup.log 2>&1
```

---

## 6. Prosedur Pemulihan Data (Restore Test)

Jika sewaktu-waktu server dipindahkan atau data perlu dipulihkan:

1. Pastikan container database sedang berjalan:
   ```bash
   docker compose up -d db
   ```
2. Jalankan skrip restore dengan menyertakan berkas backup sql.gz dan berkas tar.gz uploads:
   ```bash
   ./scripts/restore.sh ./backups/backup_YYYYMMDD_HHMMSS.sql.gz ./backups/uploads_YYYYMMDD_HHMMSS.tar.gz
   ```
3. Restart seluruh service:
   ```bash
   docker compose -f compose.yaml -f compose.prod.yaml restart
   ```

---

## 7. Checklist Pasca-Deploy & SEO Lokal untuk Pemilik UMKM

Setelah situs online, selesaikan daftar periksa berikut agar toko langsung menghasilkan penjualan:

### 1. Keamanan & Akun Admin
- [ ] Buka `https://nama-domain-umkm.com/admin/login`
- [ ] Masuk menggunakan `ADMIN_EMAIL` dan `ADMIN_INITIAL_PASSWORD` dari `.env`
- [ ] Buka menu **Pengaturan Toko**, perbarui data toko (nama usaha, logo, jam operasional, alamat lengkap, link medsos, nomor WhatsApp pemesanan).

### 2. Google Business Profile (Google Bisnisku)
- [ ] Buka [Google Business Profile](https://business.google.com/)
- [ ] Daftarkan nama toko, kategori usaha, jam operasional, dan sematkan titik lokasi Maps yang sama persis dengan yang ada di website.
- [ ] Masukkan URL website toko Anda di profil Google Bisnis.

### 3. Google Search Console & Peta Situs (Sitemap)
- [ ] Buka [Google Search Console](https://search.google.com/search-console)
- [ ] Tambahkan properti domain Anda dan lakukan verifikasi via DNS TXT record atau tag HTML.
- [ ] Masuk ke menu **Sitemaps**, kirimkan URL: `https://nama-domain-umkm.com/sitemap.xml`.
- [ ] Periksa bahwa URL `/admin` dan `/api` ditutup oleh `robots.txt` (`https://nama-domain-umkm.com/robots.txt`).

### 4. Uji Alur Belanja via Ponsel (Smartphone Nyata)
- [ ] Buka website lewat browser HP di koneksi seluler 4G.
- [ ] Tambahkan 2 produk ke keranjang belanja.
- [ ] Buka halaman Keranjang, isi nama dan alamat, lalu klik tombol **"Kirim Pesanan ke WhatsApp"**.
- [ ] Pastikan aplikasi WhatsApp terbuka dengan format pesan rapi beserta rincian pesanan dan total harga yang benar.
- [ ] Buka `/admin/pesanan` di dashboard admin dan pastikan status pesanan baru telah tercatat.
