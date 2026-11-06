#!/bin/sh
set -e

echo "Starting database migration..."
pnpm prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "RUN_SEED is set to true. Seeding database..."
  pnpm db:seed || echo "Seed executed or skipped."
fi

echo "Migration finished successfully."
