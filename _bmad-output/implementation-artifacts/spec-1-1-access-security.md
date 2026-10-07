---
title: 'Е1: доступ і безпека API (B1, S6, JWT-секрет)'
type: 'bugfix'
created: '2026-10-07'
status: 'done'
baseline_commit: '37a752237e1fa74491f4232db82b86fabfb8a3d6'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Гість бачить червону плашку «Network Error» на кожній сторінці (403 від `/me` без CORS-заголовків + клієнт показує будь-який rejected як помилку). Будь-хто без входу може створювати, змінювати й видаляти збори, організації, підписки й користувачів (`AuthMiddleware` пропускає ці префікси для всіх методів, ідентичність береться з тіла). JWT підписано публічним ключем `"SECRET"` і без терміну дії.

**Approach:** CORS — зовнішній middleware; гостьовий 403 від `/me` клієнт трактує як «не увійшов», а не як помилку. Небезпечні методи (POST/PUT/PATCH/DELETE) вимагають валідного токена, а маршрути звіряють власність з користувачем із токена; GET лишаються відкритими, крім даних, що розкривають чужі e-mail чи підписки. Секрет — з `JWT_SECRET` (`server/.env`, поза git), токени з `exp`; наявні сесії інвалідуються (рішення D13).

## Boundaries & Constraints

**Always:** контракти тіл і відповідей наявних ендпоінтів не змінюються; помилки — `{"detail": ...}`; 401 = немає/невалідний/прострочений токен, 403 = не власник; `/me` для гостя лишається 403. Кожна зміна поведінки — з pytest, спершу червоним.

**Never:** не чіпати B2–B5, розмітку, схему БД; не комітити секрет; не додавати залежностей; не логувати токени.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Гість відкриває сайт | `GET /me`, `Origin: http://localhost:3000`, без куки | 403 **з** `access-control-allow-origin`; плашки немає | клієнт не диспатчить `showError` для `auth/fetchUser` |
| Гість мутує | `DELETE /fundraisings/1` без куки | 401, рядок у БД не змінено | — |
| Чужий ресурс | A видаляє/патчить збір чи організацію B | 403 | — |
| Підміна ідентичності | A шле `creator_id`/`user_id` = B | 403 | — |
| Власник | A патчить/видаляє своє | як раніше (200) | — |
| Токен старим ключем / без `exp` / прострочений | будь-яка мутація | 401 | — |
| Чужі приватні дані | `GET /users/`, `/users/{інший}`, `/subscriptions/`, `/subscriptions/by-user/{інший}` | 401 гостю / 403 не власнику; свої — 200 | — |
| Немає `JWT_SECRET` | старт сервера | dev-дефолт + `WARNING` у лог | — |

</frozen-after-approval>

## Code Map

- `server/main.py:14-27` — `CORSMiddleware` додається першим ⇒ внутрішній; має стати останнім `add_middleware` у файлі.
- `server/main.py:~322-370` — `InitStateMiddleware`, `AuthMiddleware` (`open_paths` + `startswith`, `raise HTTPException` всередині middleware ⇒ 500, гілка `/me`). Замінити на: middleware пропускає safe-методи й `/oauth/google/callback`, `/logout`; для решти без валідного токена повертає `JSONResponse(401)` (не raise).
- `server/main.py:76,89,347,360` — `jwt.encode/decode(..., "SECRET")` → спільні `encode_token(email)` / `decode_token(token)` з `JWT_SECRET`, `exp` = 24 год (узгоджено з клієнтською кукою `expires: 1`), `decode` вимагає `exp`.
- `server/main.py` маршрути-мутації: fundraisings (POST/PATCH/DELETE), organizations (POST/PATCH/DELETE), subscriptions (POST/PUT/DELETE `/{user_id}/{fundraising_id}`), users (POST/PATCH/DELETE), posts, media — додати `current_user = Depends(get_current_user)` і перевірки власності (`creator_id`/`user_id` == `current_user.id`). `POST /users/` — лише автентифікованим (користувачі створюються через OAuth).
- `server/main.py` GET `/users/`, `/users/{id}`, `/subscriptions/`, `/subscriptions/{id}`, `/subscriptions/by-user/{id}` — лише власник/автентифікований (клієнт використовує тільки `by-user` зі своїм id).
- `server/test_main.py` — `generate_token` з `"SECRET"`; токен видається `testuser@`, а власник даних — `testuserinit@` (id 1). Оновити фікстури: секрет з env, токен власника, `client.cookies.clear()` між тестами; додати тести з матриці.
- `server/run_tests.sh` — передати `-e JWT_SECRET=test-secret`.
- `server/.env` (gitignored, вже має GOOGLE_*) — додати згенерований `JWT_SECRET`.
- `patronage-client/src/store/middleware/errorMiddleware.tsx` — не показувати помилку для `auth/fetchUser/rejected`.
- Не змінювати: `crud.py`, `models.py`, `schemas.py`, клієнтські сервіси (вже `withCredentials: true`).

## Tasks & Acceptance

**Execution:**
- [x] `server/test_main.py` -- тести з I/O-матриці (спершу червоні); фікстури під новий секрет і власника -- доказ дірки й фіксу
- [x] `server/main.py` -- `encode_token`/`decode_token`, `get_current_user`, новий `AuthMiddleware`, перевірки власності, CORS останнім -- суть зміни
- [x] `server/run_tests.sh`, `server/.env` -- `JWT_SECRET` -- секрет поза кодом
- [x] `patronage-client/src/store/middleware/errorMiddleware.tsx` -- пропуск `auth/fetchUser/rejected` -- плашка для гостя

**Acceptance Criteria:**
- Given запущений стек, when гість відкриває головну, then червоної плашки немає, а `curl -H Origin /me` дає 403 з CORS-заголовком.
- Given `grep -rn '"SECRET"' server`, then збігів немає.
- Given увійшов користувач, when він створює/редагує/видаляє свій збір і підписується через UI, then усе працює як раніше.

## Verification

**Commands:**
- `server/run_tests.sh -q` -- expected: усі тести зелені (старі 10 + нові)
- `cd patronage-client && npx jest && npx tsc --noEmit` -- expected: зелено
- `curl -i -H 'Origin: http://localhost:3000' localhost:8000/me` -- expected: 403 + `access-control-allow-origin`
- `curl -o /dev/null -w '%{http_code}' -X DELETE localhost:8000/fundraisings/99999` -- expected: 401

## Implementation Notes

- Оточення (з планування): поточний shell не в групі `docker`, тому docker-команди запускати як `printf '<команда>\n' | newgrp docker` (напр. `printf '/home/andrii/patronage_of_military_units/server/run_tests.sh -q\n' | newgrp docker`). Бекенд уже працює в контейнері з `uvicorn --reload` і змонтованим `server/` — правки `main.py` підхоплюються самі; `server/.env` читається через `load_dotenv()`, тож `JWT_SECRET` треба читати після нього. Після зміни секрету всі поточні сесії в браузері стануть недійсними — це очікувано (D13).

## Spec Change Log

## Review Triage Log

- `low` patch — cookie `max_age=3600` vs JWT 24 год (усі три рецензенти): httponly-кука сервера має пріоритет над клієнтською, сесія реально 1 год, коментар хибний; max_age від JWT_LIFETIME.
- `false` — часткові PATCH/PUT без `creator_id`/`user_id` дають 403: `FundraisingsUpdate` і `SubscriptionsCreate` мають ці поля обов'язковими (`schemas.py:69,112`), `None` неможливий.
- `low` reject — брати власника з токена замість тіла: дизайн-пропозиція; intent зберігає контракт тіл.
- `medium` defer — збір під чужою організацією: стара поведінка, продуктове рішення разом з Е10.
- `low` defer — `POST /users/` створює акаунти для інших: маршрут не використовується клієнтом.
- `false` — видалений користувач далі проходить `get_current_user`: `crud.get_user_by_email` фільтрує `deleted_at == None` (`crud.py:9`).
- `medium` defer — dev-секрет fail-open: так задано в intent (рядок матриці); перед публікацією зробити fail-closed.
- `low` reject — тихе ігнорування будь-якого `auth/fetchUser/rejected` (і 500/мережі на `/me`): інші запити сторінки однаково покажуть плашку при збої; розрізнення статусу додає гілку на нестабільному тексті помилки.
- `medium` defer — немає обробки простроченої сесії на клієнті: стара UX-прогалина.
- `low` reject — подвійне декодування токена (middleware + залежність): навмисно — middleware грубий фільтр, залежність дає ідентичність.
- `low` patch — тести відкритих шляхів (`/logout`, `/oauth/google/callback` гостем) і токена для неіснуючого користувача відсутні (verification-gap, підтверджено).
- `low` patch — `soft_remove_fundraising` шукає рядок без фільтра `deleted_at` (повторне видалення → 200): перейти на `crud.get_fundraising`.
- `low` reject — `read_users`/`read_subscriptions` з від'ємними skip/limit: так само в усіх наявних списках; рідко.
- `low` patch — тест і middleware тримають літерал `'auth/fetchUser/rejected'` (verification-gap): перейти на `fetchUser.rejected.type`.
- `false` — токен без `email` → KeyError на `/me`: такий токен неможливо підписати без секрету; стан недосяжний.
- `low` reject — `/logout/` з кінцевим слешем → 401: клієнт викликає точні шляхи, маршрутів зі слешем немає.
- `low` reject — мертві `crud.get_users`/`get_all_subscriptions`: нешкідливі, використовуються в тестах/можуть знадобитись з фільтром.
