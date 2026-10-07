"""One-off, re-runnable cleanup of duplicate subscriptions (B5).

Keeps one row per (user_id, fundraising_id) pair and creates the unique index
`ux_subscriptions_user_fundraising` that new databases get from the model.

    python scripts/dedupe_subscriptions.py           # report only, changes nothing
    python scripts/dedupe_subscriptions.py --apply   # delete duplicates + create index

Which row survives: the active one (deleted_at IS NULL) with the smallest id;
if the pair has no active row, the most recently soft-deleted one.

Before --apply, back up the database (from the repo root):

    docker compose -f server/docker-compose.yaml exec -T db pg_dump -U postgres mydatabase > server/backups/mydatabase-before-dedupe-subscriptions-<timestamp>.sql

Then stop the backend (or run in a quiet window): a subscription inserted
while --apply runs can recreate a duplicate and make the index step fail.
DATABASE_URL is read from the environment. Works on SQLite and Postgres.
"""
import argparse
import os
import sys
from collections import defaultdict

from sqlalchemy import create_engine, text

INDEX_NAME = "ux_subscriptions_user_fundraising"
CREATE_INDEX_SQL = (
    f"CREATE UNIQUE INDEX IF NOT EXISTS {INDEX_NAME} "
    "ON subscriptions (user_id, fundraising_id)"
)
SELECT_ROWS_SQL = "SELECT id, user_id, fundraising_id, deleted_at FROM subscriptions ORDER BY id"


def _group_pairs(rows):
    """{(user_id, fundraising_id): [row, ...]} for pairs with more than one row.
    Rows with a NULL key are left alone (the unique index does not cover them)."""
    groups = defaultdict(list)
    for row in rows:
        _, user_id, fundraising_id, _ = row
        if user_id is None or fundraising_id is None:
            continue
        groups[(user_id, fundraising_id)].append(row)
    return {pair: group for pair, group in groups.items() if len(group) > 1}


def _keeper(group):
    active = [row for row in group if row[3] is None]
    if active:
        return min(active, key=lambda row: row[0])
    return max(group, key=lambda row: (row[3], row[0]))


def choose_ids_to_delete(rows):
    """rows: iterable of (id, user_id, fundraising_id, deleted_at).
    Returns the ids to delete so that one row per pair remains."""
    to_delete = []
    for group in _group_pairs(rows).values():
        keep_id = _keeper(group)[0]
        to_delete.extend(row[0] for row in group if row[0] != keep_id)
    return to_delete


def _report(rows):
    duplicates = _group_pairs(rows)
    if not duplicates:
        print("No duplicates found.")
        return
    print(f"Found duplicates for {len(duplicates)} (user_id, fundraising_id) pair(s):")
    for (user_id, fundraising_id), group in sorted(duplicates.items()):
        keep_id = _keeper(group)[0]
        drop = [row[0] for row in group if row[0] != keep_id]
        print(f"  user {user_id}, fundraising {fundraising_id}: keep id {keep_id}, delete ids {drop}")


def main(argv=None, database_url=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--apply", action="store_true", help="delete duplicates and create the unique index")
    args = parser.parse_args(argv)

    url = database_url or os.getenv("DATABASE_URL")
    if not url:
        print("DATABASE_URL is not set.", file=sys.stderr)
        return 2
    engine = create_engine(url)

    try:
        if not args.apply:
            with engine.connect() as conn:
                _report(conn.execute(text(SELECT_ROWS_SQL)).fetchall())
            print("Report only; run with --apply to delete duplicates and create the index.")
            return 0

        with engine.begin() as conn:
            rows = conn.execute(text(SELECT_ROWS_SQL)).fetchall()
            _report(rows)
            ids = choose_ids_to_delete(rows)
            for start in range(0, len(ids), 500):
                chunk = ids[start:start + 500]
                params = {f"id{i}": value for i, value in enumerate(chunk)}
                placeholders = ", ".join(f":id{i}" for i in range(len(chunk)))
                conn.execute(text(f"DELETE FROM subscriptions WHERE id IN ({placeholders})"), params)
            conn.execute(text(CREATE_INDEX_SQL))
        print(f"Deleted {len(ids)} row(s); unique index {INDEX_NAME} is in place.")
        return 0
    finally:
        engine.dispose()


if __name__ == "__main__":
    sys.exit(main())
