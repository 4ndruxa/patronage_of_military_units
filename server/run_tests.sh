#!/usr/bin/env bash
# Runs the backend test suite inside the backend Docker image.
# test_main.py imports `server.*` while main.py imports `sql_app.*`,
# so the repo root and server/ must both be on PYTHONPATH.
# DATABASE_URL only keeps sql_app/database.py from failing at import time;
# test_main.py hardcodes its own sqlite:///./test.db, so both point at the
# same file in the repo root. Keep them in sync if either changes.
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

exec docker compose -f "$repo_root/server/docker-compose.yaml" run --rm --no-deps --build \
  --user "$(id -u):$(id -g)" \
  -v "$repo_root":/repo -w /repo \
  -e DATABASE_URL=sqlite:///./test.db \
  -e PYTHONPATH=/repo:/repo/server \
  backend python -m pytest server/test_main.py "$@"
