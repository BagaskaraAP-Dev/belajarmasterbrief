# 🚀 Enterprise PHP 8.3 & Docker Compose — Lab Belajar Mandiri

> **Status:** Sedang Aktif Dipelajari & Dikembangkan  
> **Author:** Bagaskara Amukti Palapa  
> **Fokus Skill:** Modern PHP 8.3, Docker Compose Architecture, Container Security & High-Performance Caching

---

## 📌 Tentang Proyek Ini

Repositori ini adalah lingkungan belajar (*sandbox & production-grade lab*) yang saya buat untuk mendalami arsitektur **Full-Stack Backend Modern** menggunakan **Docker Compose**, menjembatani latar belakang saya di bidang **Cybersecurity / Web Security** dengan rekayasa perangkat lunak enterprise.

Di sini, saya tidak menggunakan web server *monolitik* bawaan (seperti XAMPP biasa), melainkan mengisolasi setiap tanggung jawab sistem ke dalam kontainer terpisah yang saling berkomunikasi melalui *private bridge network*.

---

## 🏗️ Arsitektur Sistem

```text
Browser User (Host: http://localhost:8080)
      │
      ▼ (Port 8080)
[1. Nginx 1.27 Alpine] ── (Reverse Proxy & Security Headers)
      │
      │ Teruskan request PHP via fastcgi_pass app:9000
      ▼
[2. PHP 8.3-FPM Alpine] ── (Custom Dockerfile + Composer + PDO + Ext-Redis)
      ├── PDO pgsql  ──► [3. PostgreSQL 16] (Relational Persistence & Audit Trail)
      └── Ext-Redis  ──► [4. Redis 7 Alpine] (In-Memory Atomic Counter & Cache Layer)
```

### Komponen Utama:
1. **Nginx 1.27 (`web`):** Pintu masuk utama yang melindungi backend, memfilter request, menangani *security headers*, dan me-route file statis tanpa membebani PHP.
2. **PHP 8.3-FPM (`app`):** Runtime backend modern dengan *strict types*, *prepared statements* (anti-SQLi), dan driver database/cache yang terisolasi.
3. **PostgreSQL 16 (`db`):** Database relasional untuk menyimpan tabel audit log secara permanen melalui *named volume* (`postgres_data`).
4. **Redis 7 (`redis`):** *In-memory storage* untuk pemrosesan super cepat (*page view hit counter* dan *cache*).

---

## 🚀 Cara Menjalankan Secara Offline / Lokal

Seluruh dependensi telah disiapkan dalam kontainer sehingga dapat dijalankan 100% secara offline di laptop:

1. **Pastikan Docker Desktop aktif di Windows.**
2. **Masuk ke folder proyek:**
   ```bash
   cd "C:\Users\User\OneDrive\Desktop\belajarmasterbrief"
   ```
3. **Deploy seluruh container:**
   ```bash
   docker compose up -d --build
   ```
4. **Buka di browser:**
   👉 [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Perintah Kontrol untuk Pembelajaran

* **Cek status & healthcheck seluruh kontainer:**
  ```bash
  docker compose ps
  ```
* **Melihat log real-time saat testing request:**
  ```bash
  docker compose logs -f
  ```
* **Masuk ke terminal kontainer PHP (untuk run composer / debug):**
  ```bash
  docker compose exec app sh
  ```
* **Mematikan sistem (data database & redis tetap tersimpan):**
  ```bash
  docker compose down
  ```
* **Reset total (menghapus container beserta volume data):**
  ```bash
  docker compose down -v
  ```

---

## 🎯 Target Pembelajaran Selanjutnya:
- [x] Konfigurasi multi-container bridge network & healthcheck dependency.
- [x] Audit trail logging otomatis ke PostgreSQL via PDO.
- [x] Atomic view counter via in-memory Redis.
- [ ] Menambahkan *Asynchronous Worker Container* untuk antrean pengiriman notifikasi.
- [ ] Mengintegrasikan PHPUnit / Pest untuk automated unit testing di dalam container.
