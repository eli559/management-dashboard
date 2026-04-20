#!/bin/sh
set -e

echo "→ Running database migrations..."
npx prisma migrate deploy || echo "⚠ Migration failed"

echo "→ Bootstrapping projects..."
node prisma/bootstrap.mjs || echo "⚠ Bootstrap failed"

echo "→ Starting server on port ${PORT:-8080}..."
exec npx next start -H 0.0.0.0 -p ${PORT:-8080}
