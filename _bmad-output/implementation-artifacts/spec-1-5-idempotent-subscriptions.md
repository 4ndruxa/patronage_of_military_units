---
title: 'Е1 / B5: ідемпотентна підписка без дублікатів'
type: 'bugfix'
created: '2026-10-07'
status: 'done'
baseline_commit: 'fed3adeb412bc6fe4a3286f927663a81554993dc'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Кожне натискання «Підписатись» вставляє новий рядок (`crud.create_subscription` — безумовний INSERT), тож у «Моїх підписках» той самий збір з'являється кілька разів. Відписка (`soft_remove_subscription`) нічого не повертає, і `DELETE /subscriptions/{u}/{f}` після успішної відписки відповідає 404.

**Approach:** Одна пара (користувач, збір) — один рядок назавжди: повторна підписка повертає наявний рядок, підписка після відписки реактивує його. Відписка повертає рядок; 404 — лише коли активної підписки немає. Наявні дублікати прибирає одноразовий ідемпотентний скрипт (звіт за замовчуванням, видалення лише з явним прапорцем і після бекапу), він же створює унікальний індекс. Тіла й коди відповідей ендпоінтів не змінюються.

## Boundaries & Constraints

**Always:** працює однаково на SQLite і Postgres; скрипт можна запускати повторно без шкоди; бекап бойової БД перед будь-яким `--apply` (D11); кожна поведінка — з pytest, спершу червоним.

**Never:** не змінювати колонки таблиці `subscriptions`; не міняти статус-коди (POST лишається 200); не чіпати клієнт; не видаляти дані без `--apply`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Перша підписка | пари немає | 200, новий рядок | — |
| Повтор | активна пара є | 200, той самий `id`; у `by-user` збір один раз | — |
| Після відписки | пара soft-deleted | 200, той самий `id`, `deleted_at` знято | — |
| Збору немає | `fundraising_id` неіснуючий/видалений | 404 | — |
| Гонка двох POST | унікальний індекс спрацював | 200 з наявним рядком | ловити `IntegrityError`, rollback, перечитати |
| Відписка | активна пара є | 200 з рядком (`deleted_at` заповнено) | — |
| Повторна відписка | активної немає | 404 | — |
| Скрипт без прапорця | БД з дублями | звіт про дублі, БД без змін | — |
| Скрипт `--apply` двічі | БД з дублями | лишається один рядок на пару (активний, найменший id; якщо активних нема — найновіший), індекс створено; другий прогін — без змін | — |

</frozen-after-approval>

## Code Map

- `server/sql_app/crud.py:209-232` — `create_subscription` (INSERT), `soft_remove_subscription` (оновлює всі рядки пари, нічого не повертає): переписати під матрицю.
- `server/main.py` `create_subscription` / `soft_remove_subscription` маршрути — вже з `get_current_user` і `ensure_owner` (spec-1-1); додати 404 для відсутнього/видаленого збору (через `crud.get_fundraising`), відписка — 404 лише коли crud повернув `None`.
- `server/sql_app/models.py:101-109` `Subscriptions` — додати `__table_args__ = (Index('ux_subscriptions_user_fundraising', 'user_id', 'fundraising_id', unique=True),)`: нові БД (тести) отримають індекс з `create_all`; наявні — через скрипт (та сама назва). Колонки не чіпати.
- Новий `server/scripts/dedupe_subscriptions.py` — SQLAlchemy, `DATABASE_URL` з env; без прапорця — звіт; `--apply` — видалення в транзакції + `CREATE UNIQUE INDEX IF NOT EXISTS ux_subscriptions_user_fundraising ON subscriptions (user_id, fundraising_id)`. Логіку вибору «який рядок лишити» винести у функцію, яку тестує pytest.
- `server/test_main.py` — фікстури з `spec-1-1` (власник id 1, другий користувач id 2 з підпискою); додати тести матриці; `server/run_tests.sh` уже запускає все.
- Бойова БД зараз: Postgres у `server-db-1`, дублів немає (4 пари × 1 рядок). Бекап: `pg_dump` у `server/backups/` (додати в `.gitignore`).
- Не змінювати: клієнт (`subscriptions.tsx` уже обробляє 200 і ковтає помилки), схеми Pydantic.

## Tasks & Acceptance

**Execution:**
- [x] `server/test_main.py` -- тести матриці (спершу червоні) -- доказ
- [x] `server/sql_app/crud.py`, `server/main.py`, `server/sql_app/models.py` -- upsert/реактивація, відписка з поверненням, 404 для збору, індекс у моделі -- суть
- [x] `server/scripts/dedupe_subscriptions.py`, `.gitignore` -- скрипт і місце для бекапів -- прибирання наявних даних
- [x] бойова БД -- бекап `pg_dump`, прогін скрипта без прапорця, потім `--apply` -- індекс на наявній таблиці

**Acceptance Criteria:**
- Given увійшов користувач, when він тричі тисне «Підписатись» на тому самому зборі, then у «Моїх підписках» збір один раз.
- Given підписка є, when користувач тисне «Відписатись», then збір зникає зі списку, а сервер відповідає 200.
- Given бойова БД, when виконано `--apply`, then `server/backups/` містить дамп, а індекс `ux_subscriptions_user_fundraising` існує.

## Verification

**Commands:**
- `server/run_tests.sh -q` -- expected: усе зелене (67 + нові)
- `DATABASE_URL=... python server/scripts/dedupe_subscriptions.py` двічі з `--apply` -- expected: другий прогін «дублів немає», без помилок

## Implementation Notes

- Оточення: docker-команди через `printf '<команда>\n' | newgrp docker`; Postgres: `docker compose -f /home/andrii/patronage_of_military_units/server/docker-compose.yaml exec -T db pg_dump -U postgres mydatabase`; скрипт на бойовій БД запускати в контейнері `backend` (`docker compose ... exec -T backend python scripts/dedupe_subscriptions.py`, там `DATABASE_URL` уже вказує на Postgres, а `server/` змонтовано в `/app`).

## Spec Change Log

## Review Triage Log

- `low` patch — PUT переносить підписку на наявну пару → необроблений IntegrityError (500): унікальний індекс з'явився в цій зміні; 409.
- `low` reject — збір видалено між перевіркою і вставкою: вузьке вікно, наслідок — підписка на видалений збір.
- `low` patch — `_find_subscription` обирає найменший id серед лише видалених рядків, а скрипт лишає найновіший: вирівняно порядок.
- `low` reject — гонка на БД без індексу: бойова БД уже має індекс; стосується лише неочищених БД.
- `low` reject — вставка дубля під час `--apply` валить транзакцію: падає гучно і повністю відкочується; в docstring додано «зупинити бекенд».
- `false` — індекс із такою назвою, але не унікальний: такий індекс ніде не створюється, стан недосяжний.
- `low` patch — скрипт не каже, як робити бекап: у docstring точна команда pg_dump (примусову перевірку бекапу не додаємо — інструмент оператора).
- `false` — змінено статус-коди: 404 для неіснуючого збору і 200 для відписки задані матрицею intent; POST лишився 200.
- `low` reject — видалені рядки лише в stdout: бекап зроблено, дублів не було.
- `medium` defer — Postgres-гілка скрипта не тестується автоматично: перевірено ручним прогоном на бойовій БД (verification-gap, defer).
- `low` defer — «Мої підписки» показують видалені збори: стара поведінка `get_subscriptions_by_user`.
- `low` reject — `user_id`/`fundraising_id` nullable; 201 vs 200 (intent: лишаємо 200); старий `created_at` при реактивації; прогалини в тесті гонки; політика зберігання бекапів.
- `medium` defer — немає тесту для БД з дублями (порядок `_find_subscription`, відписка всіх активних) (verification-gap, defer).
