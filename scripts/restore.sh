#!/bin/sh
set -e

if [ -z "$1" ]; then
  echo "Penggunaan: ./scripts/restore.sh <path_to_backup_file.sql.gz> [path_to_uploads.tar.gz]"
  exit 1
fi

DB_BACKUP_FILE="$1"
UPLOADS_BACKUP_FILE="$2"

if [ ! -f "$DB_BACKUP_FILE" ]; then
  echo "Error: Berkas database $DB_BACKUP_FILE tidak ditemukan."
  exit 1
fi

echo "=== Memulai Pemulihan Data (Restore) ==="
echo "1. Memulihkan database dari $DB_BACKUP_FILE..."
gunzip -c "$DB_BACKUP_FILE" | docker compose exec -T db psql -U "${POSTGRES_USER:-umkm_user}" -d "${POSTGRES_DB:-umkm_db}"
echo "   Database berhasil dipulihkan."

if [ -n "$UPLOADS_BACKUP_FILE" ]; then
  if [ -f "$UPLOADS_BACKUP_FILE" ]; then
    echo "2. Memulihkan berkas uploads dari $UPLOADS_BACKUP_FILE..."
    mkdir -p ./uploads
    tar -xzf "$UPLOADS_BACKUP_FILE" -C ./uploads
    # Sinkronisasi ke volume container jika sedang berjalan
    docker compose exec -T web tar -xzf - -C /app/uploads < "$UPLOADS_BACKUP_FILE" 2>/dev/null || true
    echo "   Berkas uploads berhasil dipulihkan."
  else
    echo "Peringatan: Berkas uploads $UPLOADS_BACKUP_FILE tidak ditemukan, dilewati."
  fi
fi

echo "=== Pemulihan Selesai Sukses ==="
