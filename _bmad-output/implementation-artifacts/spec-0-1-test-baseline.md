---
title: 'Е0: зелений baseline тестів (jest + pytest)'
type: 'chore'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Клієнтський `npx jest` не стартує (`Cannot find module 'jest-util'`: lock-файл у HEAD не знає про `ts-jest`, а `ts-jest` шукає peer `jest-util` у корені `node_modules`), а бекенд-тести не мають відтворюваної команди запуску й пишуть у закомічений `server/test.db`. Без зеленого baseline жоден наступний епік (баги, безпека, редизайн) не можна перевірити.

**Approach:** Додати `jest-util@^29.7.0` у devDependencies і закомітити синхронний lock; додати скрипт `server/run_tests.sh`, що запускає pytest у Docker-образі бекенду з кореня репозиторію під UID користувача; прибрати `test.db` з git і додати в `.gitignore`. Поведінка застосунку не змінюється.

</frozen-after-approval>

## Implementation Notes

- Розслідування (2026-10-07): `server/test_main.py` імпортує `server.sql_app`/`server.main`, а `server/main.py` — `sql_app` ⇒ потрібен `PYTHONPATH=/repo:/repo/server`. `main.py` на імпорті робить `create_engine(os.getenv('DATABASE_URL'))` ⇒ змінна обов'язкова. Ризик «Table already defined» НЕ підтвердився: дві копії модулів мають різні `Base`, конфлікту немає.
- Пробний запуск у контейнері `backend` (Python 3.11, залежності вже встановлені): 10 passed, повторно — 10 passed. Проблеми пробного запуску: тест пише `./test.db` у корінь репозиторію від root; додаток — у `DATABASE_URL`. Рішення: `--user $(id -u):$(id -g)`, обидва шляхи вказують на один файл у корені (`sqlite:///./test.db`), `test.db` у `.gitignore`, `server/test.db` — `git rm --cached` (файл на диску лишається).
- Python 3.14 хоста не підходить (закріплені `pydantic_core 2.18.1` тощо не збираються), тому лише Docker.
- Окремі коміти: (1) пакети клієнта, (2) скрипт тестів + `.gitignore` + untrack `test.db`.
- Реалізація: `npm i -D jest-util@^29.7.0` → `npx jest` 3 сьюти / 15 тестів зелені; `rm -rf node_modules && npm ci` проходить і jest знову зелений; `tsc --noEmit` — 0 помилок. Lock переписано npm 11 (lockfileVersion 3) — це очікувано, бо HEAD-lock був розсинхронізований з `package.json`.
- Додано `server/run_tests.sh` (виконуваний), `test.db` у кореневому `.gitignore`, `git rm --cached server/test.db` (файл на диску лишився, тепер ігнорується). Два запуски поспіль — 10 passed, файли належать користувачу.
- Несподіванка: пробний запуск від root залишив root-owned `.pytest_cache` у корені (pytest попереджав, що не може писати кеш) — видалено через контейнер; з `--user` проблема не повторюється.
- Побічне: dev-сервер клієнта, запущений у фоні, міг втратити модулі під час `rm -rf node_modules` — перезапустити після коміту.

## Review Triage Log

- `false` — «npm ci впаде з ERESOLVE через typescript 5.9.3»: `npm ci` на чистому node_modules пройшов (legacy-peer-deps=false), бо в react-scripts peer `typescript` позначено `optional: true`; `npm run build` теж компілюється.
- `low` patch — lock перегенеровано повністю / HEAD-lock був розсинхронізований (TS 4.9.5 → 5.9.3, нові redux/jest записи): неминуче для синхронного lock; пояснено в повідомленні коміту.
- `low` patch — не пояснено, навіщо `jest-util`: пояснено в повідомленні коміту (peer `ts-jest`, що шукається з кореня).
- `low` reject — застарілі `@types/react-redux`: були в package.json і до зміни; `tsc --noEmit` без помилок.
- `low` defer — `jest.config.js` (`globals['ts-jest']`, без `.tsx`): стара конфігурація; знадобиться для 1.8.
- `low` reject — неприв'язане правило `test.db` у .gitignore: свідомо, щоб покривати і корінь, і вже не відстежуваний `server/test.db` на диску.
- `low` patch — два engine на один файл без пояснення: додано коментар у `server/run_tests.sh`.
- `low` patch — запуск на застарілому образі: додано `--build`.
- `medium` patch — README з неробочою командою тестів: оновлено на `server/run_tests.sh`.
- `low` defer — `server/sql_app.db`, `server/virtualenv` у git: стара проблема.
- `false` — змішаний стан індексу: коміти робляться з явним додаванням усіх файлів зміни.
- `low` defer — немає CI: ідея на потім.
