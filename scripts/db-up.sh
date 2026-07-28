#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${POSTGRES_DB:-portfolio}"
DB_USER="${POSTGRES_USER:-payload}"
DB_PASSWORD="${POSTGRES_PASSWORD:-payload}"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker compose up -d postgres
  exit 0
fi

if command -v pg_ctlcluster >/dev/null 2>&1 && command -v runuser >/dev/null 2>&1; then
  pg_ctlcluster 16 main start >/dev/null 2>&1 || true

  if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'" | grep -q 1; then
    runuser -u postgres -- psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'"
  fi

  if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1; then
    runuser -u postgres -- createdb -O "${DB_USER}" "${DB_NAME}"
  fi

  echo "Postgres is running at postgres://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
  exit 0
fi

echo "Could not start a local database. Start Docker Desktop, or install PostgreSQL 16 locally." >&2
exit 1
