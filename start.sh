#!/bin/sh
set -e

echo "→ Running database migrations..."
npx prisma migrate deploy 2>/dev/null || echo "→ Migrations skipped"

echo "→ Seeding demo data..."
node prisma/seed.mjs 2>/dev/null || echo "→ Seed skipped"

echo "→ Starting server on port ${PORT:-8080}..."
npx next start -p ${PORT:-8080}
