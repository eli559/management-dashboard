#!/bin/sh
set -e

echo "→ Running database migrations..."
npx prisma migrate deploy || echo "⚠ Migration failed"

echo "→ Seeding demo data..."
npx tsx prisma/seed.ts || echo "⚠ Seed failed"

echo "→ Starting server on port ${PORT:-8080}..."
exec npx next start -H 0.0.0.0 -p ${PORT:-8080}
