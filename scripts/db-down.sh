#!/usr/bin/env bash
set -euo pipefail

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker compose down
  exit 0
fi

if command -v pg_ctlcluster >/dev/null 2>&1; then
  pg_ctlcluster 16 main stop >/dev/null 2>&1 || true
  exit 0
fi

echo "No supported local database runtime found." >&2
exit 1
