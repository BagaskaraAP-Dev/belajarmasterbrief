#!/bin/sh
set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

echo "Creating compressed backup at $BACKUP_FILE..."

# Backup PostgreSQL via docker compose
docker compose exec -T db pg_dump -U "${POSTGRES_USER:-umkm_user}" -d "${POSTGRES_DB:-umkm_db}" | gzip > "$BACKUP_FILE"

echo "Backup completed: $BACKUP_FILE"

# Keep only the last 7 backups
echo "Retaining only the last 7 backups..."
ls -t "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f

echo "Done."
