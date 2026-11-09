# Design Direction: Technical Security & Audit Dashboard

Dokumen ini mendefinisikan identitas visual dan arahan desain untuk proyek ini berdasarkan preferensi pengguna.

## 1. Identity & Personality
- **Karakter:** Technical, security-focused, presisi, padat informasi.
- **Tujuan:** Menyajikan telemetri dan audit logging sistem secara cepat, jelas, dan akurat tanpa elemen dekoratif yang tidak fungsional.

## 2. Palette (Dark Theme Murni)
- **Background Utama:** Charcoal Black (`#0a0e14`)
- **Permukaan Panel (Surface):** Deep Slate (`#111827`)
- **Batas / Border:** Slate Border (`#1e293b` / `#334155`)
- **Teks Utama:** High-Contrast White (`#f8fafc`) - Rasio kontras > 14:1 (Memenuhi WCAG AAA)
- **Teks Sekunder:** Muted Slate (`#94a3b8`) - Rasio kontras > 7:1 (Memenuhi WCAG AA)
- **Aksen Utama:** Emerald Green (`#10b981`) - Menandakan status aktif/aman
- **Aksen Status Error:** Crimson Red (`#ef4444`) - Menandakan anomali/kegagalan koneksi

## 3. Typography
- **Headings & Body UI:** System Sans-serif (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Metrik, Waktu, IP Address, & Query Data:** Monospace (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`)

## 4. Craftsmanship Rules (Antislop Guardrails)
- Tidak menggunakan efek blur/glow berlebihan (glow loop dihapus, status dot bersifat solid dan tegas).
- Tidak menggunakan badge kapsul dekoratif tanpa fungsi.
- Kontras seluruh elemen teks dan indikator status wajib memenuhi standar minimum WCAG AA (4.5:1 untuk teks normal, 3:1 untuk komponen non-teks).
- Setiap elemen interaktif wajib memiliki style `:focus-visible` yang jelas saat diakses melalui keyboard.
