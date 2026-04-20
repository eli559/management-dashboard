#!/bin/sh
set -e

echo "→ Running database migrations..."
npx prisma migrate deploy || echo "⚠ Migration failed, continuing..."

echo "→ Seeding demo data..."
node prisma/seed.mjs || echo "⚠ Seed failed, continuing..."

echo "→ Starting server on port ${PORT:-8080}..."
exec npx next start -p ${PORT:-8080}
