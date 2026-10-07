---
title: Реалізація v2 — baseline, баги B1–B5, регресійний захист
author: Amelia
updated: 2026-10-07
---

# Реалізація v2 (частина Amelia)

Порядок строгий: Е0 baseline -> Е1 баги -> Е1.5 смоук-тести -> далі редизайн. Кожен крок закінчується комітом. Усе нижче перевірено по коду; нічого не запускалось зі змінами.

## Е0. Baseline

### 0.1 Зелений jest (клієнт)
- Причина падіння: `HEAD:patronage-client/package-lock.json` не знає про `jest`/`ts-jest` (0 згадок `ts-jest`), хоч `package.json` їх вимагає. Після `npm install` у корені `node_modules` немає `jest-util` (є лише вкладені 29.7.0), а `ts-jest/dist/legacy/config/config-set.js:54` робить `require('jest-util')` з кореня (у `ts-jest` це peer).
- Зміна: `npm i -D jest-util@^29.7.0` у `patronage-client` (змінює `package.json` + `package-lock.json`). Окремий коміт «chore: sync lockfile, add jest-util». Інших змін немає.
- Приймання: `rm -rf node_modules && npm ci` проходить (lock синхронний); `npx jest` -> 3 сьюти зелені (`src/tests/{subscription,organizationService,fundraisingService}.test.ts`); `npx tsc --noEmit` -> 0 помилок; `git diff --stat` у коміті містить лише два файли пакетів.
- Примітка: `jest.config.js` має `testEnvironment: 'node'`, `testMatch` лише `*.test.ts`, застарілий `globals['ts-jest']`. Це працює для сервісів; для компонентів див. 1.6.

### 0.2 Pytest (бекенд)
- На хості `pytest` не встановлений (`python -c "import pytest"` -> ModuleNotFoundError). `server/virtualenv` лежить у git, але це не робочий venv; не покладатись.
- `server/test_main.py` (10 тестів) імпортує `from server.sql_app...` і `from server.main import app`, тобто запускати треба з КОРЕНЯ репозиторію, не з `server/`: `python -m venv /tmp/v && /tmp/v/bin/pip install -r server/requirements.txt && /tmp/v/bin/python -m pytest server/test_main.py` (потрібні також `pytest-asyncio`, `httpx` — вже в requirements).
- У Docker: `Dockerfile` не копіює код, `docker-compose` монтує `./` (тобто `server/`) у `/app`; там пакета `server` нема, тож `from server...` не імпортується. Потрібен або `docker compose run --rm -v $(pwd)/..:/repo -w /repo backend python -m pytest server/test_main.py`, або (чистіше) прибрати префікс `server.` в імпортах тестів. Рішення: перший варіант, без зміни коду.
- Ризик, не перевірено: `test_main.py` імпортує і `server.sql_app.models`, і `server.main`, який імпортує `sql_app.models` (інша назва модуля) — можлива помилка «Table already defined». Якщо так — виправити, додавши корінь і `server/` у `PYTHONPATH` та змінивши імпорти тестів на `sql_app...`/`main`. З’ясувати першим кроком 0.2.
- Тести пишуть у `./test.db` (закомічений файл `server/test.db`). Додати в 0.2: `server/test.db` у `.gitignore`.
- Приймання: 10 з 10 зелені на чистому venv і в Docker; повторний запуск також зелений (ізоляція `setup_database`).

## Е1. Баги B1–B5 (кожен — окремий коміт з тестом, спочатку червоний)

| # | Де | Мінімальний фікс | Тест, що ловить |
|---|---|---|---|
| B1 | `server/main.py:21` (CORS) і `:370` (`AuthMiddleware`) | Додавання middleware у Starlette: останнє = зовнішнє. Перенести `app.add_middleware(CORSMiddleware, ...)` ПІСЛЯ `AuthMiddleware` (або викликати його останнім), щоб CORS обгортав відповіді 403. | pytest: `client.get('/me', headers={'Origin':'http://localhost:3000'})` -> 403 І заголовок `access-control-allow-origin == http://localhost:3000`. Зараз заголовка нема (перевірено curl). |
| B2 | `components/myFundraisings/myFundraisings.tsx:12` | Замінити `const creatorId = 1` на `user.id` з `useSelector(state.auth.user)`; у `useEffect` викликати fetch лише коли `user`; залежність `[user]` (як у `mySubscriptions.tsx`). | Смоук (1.6): мок `getFundraisingsByCreator`, store з `user.id=7` -> перевірити виклик з `7`, а не `1`. Бекенд ендпоінт `/fundraisings/by-creator/{id}` уже є (`main.py:162`). |
| B3 | `components/organizations/organizations.tsx:45` | `(organizations && []).length` -> `organizations.length`. | Смоук: мок 13 організацій -> 3 кнопки сторінок, клік по «2» показує елементи 7–12. |
| B4 | `components/fundraising/fundraising.tsx:15-19` | Якщо `location.state` нема — взяти `id` з `useParams()` і викликати вже наявний `getFundraisingById` (`services/api/fundraisings/fundraisings.tsx:18`); лишити пріоритет `state`, щоб не робити зайвий запит із карток. Додати стан помилки/404 (не вічний `Loading...`). Бекенд `GET /fundraisings/{id}` (`main.py:155`) є, 404 обробляє. `img` береться з `cover.ts` у обох гілках. | Смоук: рендер на `/fundraisings/5` без state -> викликається `getFundraisingById(5)`, показується заголовок; 404 -> повідомлення. |
| B5 | `server/sql_app/crud.py:209` (`create_subscription`) і `main.py:278` | Перед insert: знайти активну (`deleted_at is None`) пару (`user_id`, `fundraising_id`); якщо є — повернути її (ідемпотентно, 200). Якщо була м’яко видалена — створити нову. Опційно partial unique index у БД лише після прибирання існуючих дублів (одноразовий скрипт, окремий крок; Alembic нема). Клієнт без змін. | pytest: двічі `POST /subscriptions/` з тим самим тілом -> однаковий `id`, `GET /subscriptions/by-user/{id}` повертає збір один раз; відписка + повторна підписка -> новий запис. |

Додатково (поза B1–B5, дешево): `deleteSubscription(userId, subscriptionId)` у `mySubscriptions.tsx` насправді отримує id збору — це лише хибна назва параметра, поведінка коректна; перейменувати без зміни логіки.

Приймання Е1: pytest +5 нових тестів зелені; `jest` зелений; ручна перевірка B1: гостем відкрити `/` — червоної плашки «Network Error» немає.

## Е1.5. Захист від регресій UI
Компонентних тестів нема, тож редизайн розмітки нічим не прикрито. Пропозиція (проти вичитування ручним чек-листом):

1.6 Смоук-рендер. `@testing-library/react@15` і `jest-dom` уже є в devDependencies. Варіант запуску: окремий jest-проєкт `jsdom` для `src/**/*.test.tsx` з `moduleNameMapper` для `.scss/.css/.png/.svg/.webp` (заглушки) і `jest-environment-jsdom`; перевірити версію React і пакета середовища. Альтернатива без нових залежностей — `npx react-scripts test --watchAll=false` (CRA 5 сам обробляє стилі й картинки; потребує `src/**/*.test.tsx`). Рішення за прогоном 0.1; вибираємо те, що працює без нових пакетів. Мокаємо `services/api/*` через `jest.mock`; обгортаємо в `Provider` + `MemoryRouter`.

Мінімальний набір (по одному тесту на сторінку/обробник, 1–2 год):
- Header: гість бачить «Увійти» і клік веде на `/login`; користувач бачить «Вийти» (після перейменування з Logout), клік викликає `logoutUser`, потім навігація на `/login`.
- Home/Fundraisings: рендер карток із моку; клік по картці викликає `navigate('/fundraisings/:id', {state})`.
- Organizations: B3-тест; клік по картці — `/organizations/:id`.
- Fundraising: «Підписатись» викликає `createSubscription({fundraising_id,user_id})`; «Задонатити» навігує на `/redirect-bank-link` зі `state.url`; B4-тести.
- MySubscriptions: «Відписатись» викликає `deleteSubscription` і перезавантажує список; порожній стан показує кнопку «Переглянути збори».
- MyFundraisings: B2-тест; «Видалити» викликає `deleteFundraising` (з підтвердженням після рішення Q2).
- AddEdit: сабміт викликає `createFundraising`/`updateFundraising` із тими самими полями; `addSource` додає блок джерела.
- Login: клік викликає `useGoogleLogin` (мок).

Приймання: `npx jest` (або `react-scripts test`) зелений; тести пишуться ДО зміни розмітки відповідної сторінки (червоно/зелено на старій розмітці, потім редизайн не повинен їх ламати: запити шукаємо за роллю і текстом, не за класами).

## Ручний чек-лист регресії (1366px і 390px, гість і користувач)
Виконується в кінці кожного епіку; скріншоти в `screenshots/`.
- Усі сторінки: немає червоної плашки помилки при вході гостем (B1); Tab проходить по всіх контролах із видимим фокусом; немає горизонтального скролу на 390px; консоль без помилок.
- Головна: hero, CTA ведуть куди треба; сітка 1/2/3 колонки; клік по картці відкриває збір.
- Організації: пагінація видима при >6 (B3); картка веде на сторінку організації.
- Збір (через картку і через пряме посилання/F5): заголовок, опис, бейдж організації, джерела; «Задонатити» відкриває редірект до банки; «Підписатись» створює одну підписку (повторний клік не дублює); гість бачить «Увійти, щоб підписатись».
- Організація: опис, збори організації, порожній стан без зборів (бекенд віддає 404 для порожнього списку — UI не показує помилку).
- Вхід: кнопка Google відкриває OAuth; залогіненого `PublicRoutes` відправляє геть.
- Мої підписки: список, відписка оновлює список, порожній стан.
- Мої збори: показує збори саме поточного користувача (B2); редагування відкриває форму з даними; видалення прибирає картку.
- Мої організації: те саме.
- Додати/редагувати збір і організацію: валідація полів, додавання кількох джерел, збереження повертає на список, дані в БД ті самі що й до редизайну.
- Модалка-нагадування: з’являється через таймер, «Задонатити» веде на `/patronage_of_military_units` (перевірити у `notificationAlert.tsx` фактичну ціль).
- Вихід: «Вийти» очищає сесію, веде на `/login`, захищені маршрути знову редіректять.

## Залежності й ризики
- Нові таблиці/колонки (термометр: `goal_amount`, `collected` у `Fundraisings`; серія: `Contributions`) — через `Base.metadata.create_all`, який не змінює існуючі таблиці. Для нових колонок у наявній БД потрібен ручний `ALTER TABLE` (скрипт у `server/`) або `ADD COLUMN` у seed; Alembic нема. Окремі істoрії та тести — після Е1.
- Серія й термометр — самозвіт; у UI підписувати чесно (рішення кімнати).
