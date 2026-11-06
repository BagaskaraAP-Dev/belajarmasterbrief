#!/bin/sh
set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
UPLOADS_BACKUP_FILE="$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"

echo "=== Memulai Pencadangan Harian UMKM ==="
echo "1. Mencadangkan database PostgreSQL ke $DB_BACKUP_FILE..."
docker compose exec -T db pg_dump -U "${POSTGRES_USER:-umkm_user}" -d "${POSTGRES_DB:-umkm_db}" | gzip > "$DB_BACKUP_FILE"
echo "   Database berhasil dicadangkan."

echo "2. Mencadangkan folder berkas upload ke $UPLOADS_BACKUP_FILE..."
if [ -d "./uploads" ] && [ "$(ls -A ./uploads 2>/dev/null)" ]; then
  tar -czf "$UPLOADS_BACKUP_FILE" -C ./uploads .
  echo "   Berkas uploads berhasil dicadangkan."
else
  # Coba cadangkan langsung dari container jika folder host kosong
  docker compose exec -T web tar -czf - -C /app/uploads . > "$UPLOADS_BACKUP_FILE" 2>/dev/null || rm -f "$UPLOADS_BACKUP_FILE"
  if [ -f "$UPLOADS_BACKUP_FILE" ] && [ -s "$UPLOADS_BACKUP_FILE" ]; then
    echo "   Berkas uploads dari container berhasil dicadangkan."
  else
    echo "   Folder uploads kosong atau belum ada berkas."
  fi
fi

# Retain only the last 7 backups
echo "3. Membersihkan cadangan lama (hanya menyimpan 7 cadangan terakhir)..."
ls -t "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f
ls -t "$BACKUP_DIR"/uploads_*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm -f

echo "=== Pencadangan Selesai Sukses: $TIMESTAMP ==="
