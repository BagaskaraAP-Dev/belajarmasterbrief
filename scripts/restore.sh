#!/bin/sh
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/restore.sh <path_to_backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: File $BACKUP_FILE does not exist."
  exit 1
fi

echo "Restoring database from $BACKUP_FILE..."

gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql -U "${POSTGRES_USER:-umkm_user}" -d "${POSTGRES_DB:-umkm_db}"

echo "Database restore completed successfully."
