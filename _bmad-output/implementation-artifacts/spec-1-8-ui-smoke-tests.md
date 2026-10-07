---
title: 'Е1 / 1.8: смоук-тести сторінок клієнта перед редизайном'
type: 'chore'
created: '2026-10-08'
status: 'done'
baseline_commit: 'fed3adeb412bc6fe4a3286f927663a81554993dc'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Компонентних тестів немає: jest налаштовано на `node` і лише `*.test.ts`, тож редизайн розмітки (Е2–Е7) може непомітно зламати вхід, підписку, донат чи форми.

**Approach:** Додати jsdom-середовище для `*.test.tsx` і ~12 смоук-тестів, що фіксують поведінку обробників ключових сторінок (рішення D16), — до будь-якої зміни розмітки. Тести шукають елементи за роллю й текстом, а не за класами, щоб пережити редизайн.

## Boundaries & Constraints

**Always:** наявні 17 тестів сервісів лишаються зеленими й запускаються тим самим `npx jest`; сервіси (`services/api/*`) мокаються через `jest.mock`; компоненти рендеряться в `Provider` (справжній store) + `MemoryRouter`.

**Never:** не змінювати код компонентів, сервісів чи store; без знімків екрана/снапшотів; не підключати другий тест-раннер (`react-scripts test`).

</frozen-after-approval>

## Code Map

- `patronage-client/jest.config.js` — `preset: ts-jest`, `testEnvironment: 'node'`, `testMatch` лише `src/tests/**/*.test.ts`, застарілий `globals['ts-jest']`. Перейти на `projects`: `services` (node, `*.test.ts`) і `ui` (`jest-environment-jsdom`, `*.test.tsx`, `setupFilesAfterEach: src/setupTests.ts`); transform `ts-jest` з `tsconfig` через опції transform; `moduleNameMapper` для `\.(css|scss)$` і зображень (`png|svg|webp|jpg`) на заглушки в `src/tests/__mocks__/`.
- `patronage-client/package.json` — потрібен `jest-environment-jsdom@^29.7.0` (у корені лише v27 від react-scripts, несумісна з jest 29). Це єдиний новий dev-пакет. `@testing-library/react@15`, `jest-dom@6`, React 18 вже є.
- `src/setupTests.ts` — вже імпортує `@testing-library/jest-dom`.
- `src/index.tsx` — `GoogleOAuthProvider`; для Login мокати `@react-oauth/google` (`useGoogleLogin` повертає `jest.fn`).
- `bootstrap.bundle` імпортується лише в `index.tsx` — у тестах не потрібен.
- Компоненти й обробники під тестом:
  - `components/header/header.tsx` — гість: «Увійти» → `/login`; користувач: «Logout» → `logoutUser` + `/login`.
  - `components/fundraisings/fundraisings.tsx` — картки з `getFundraisings`; клік → `/fundraisings/:id`.
  - `components/organizations/organizations.tsx` — 7 організацій → 2 сторінки, «2» показує 7-му (B3).
  - `components/fundraising/fundraising.tsx` — зі `state` без запиту; без `state` → `getFundraisingById(id)`; 404 → «Збір не знайдено» (B4); «Підписатись» → `createSubscription({fundraising_id, user_id})`; «Задонатити зараз» → `/redirect-bank-link` зі `state.url`.
  - `components/mySubscriptions/mySubscriptions.tsx` — «Відписатись» → `deleteSubscription` + перезапит.
  - `components/myFundraisings/myFundraisings.tsx` — запит з `user.id`, а не 1 (B2); «Видалити» → `deleteFundraising`.
  - `components/addEditFundraising/addEditFundraising.tsx` — сабміт → `createFundraising` з полями форми; «Додати ще одне джерело» з'являється лише після заповнення першого.
  - `components/addEditOrganization/addEditOrganization.tsx` — сабміт → `createOrganization(data, user.id)`.
  - `components/login/login.tsx` — клік → функція з `useGoogleLogin`.
- Перевірити навігацію: допоміжний `<Routes>` з маркерами шляхів або мок `useNavigate`.

## Tasks & Acceptance

**Execution:**
- [x] `patronage-client/package.json`, `package-lock.json` -- `npm i -D jest-environment-jsdom@^29.7.0` -- jsdom для jest 29
- [x] `patronage-client/jest.config.js`, `src/tests/__mocks__/*` -- два проєкти, заглушки стилів і картинок -- інфраструктура
- [x] `patronage-client/src/tests/ui/*.test.tsx` -- смоук-тести зі списку Code Map (спільний `renderWithProviders`) -- захист обробників

**Acceptance Criteria:**
- Given чистий `npm ci`, when `npx jest`, then запускаються обидва проєкти, усе зелене, у виводі ≥ 12 нових тестів.
- Given у `myFundraisings.tsx` тимчасово повернути `creatorId = 1`, when `npx jest`, then тест B2 падає (перевірка, що тести ловлять регресію; зміну відкотити).

## Verification

**Commands:**
- `cd patronage-client && npx jest` -- expected: зелено, 2 проєкти
- `npx tsc --noEmit` -- expected: 0 помилок

## Implementation Notes

- Оточення (з планування): паралельно інший агент змінює лише `server/` (B5, незакомічено) — не чіпати й не комітити `server/`; змінювати тільки `patronage-client/`. Dev-сервер клієнта працює у фоні — `npm i` не має його зупиняти.

- Після рев'ю: `resetMocks: true` замість `clearMocks` (повне скидання, у т.ч. черг `mockResolvedValueOnce`) — 35/35 зелені; регресія B2 (`getFundraisingsByCreator(1)`) ловиться тестом; `npm ci` з нуля в ізольованій копії проходить, жоден пакет верхнього рівня не зник.

## Spec Change Log

## Review Triage Log

- `low` patch — `moduleNameMapper` без jpeg/gif/ico/шрифтів/sass: перший такий імпорт у Е2–Е7 зламає весь UI-набір.
- `low` patch — `testMatch` лише `src/tests/**`: тест поруч із компонентом тихо не запускався б.
- `low` patch — непослідовне скидання моків: `clearMocks: true` у спільному конфігу.
- `low` patch — сторінка «2» шукається за текстом: за роллю.
- `low` patch — гілка некоректного id (B4) без тесту.
- `low` patch — вихід не перевіряє очищення `sessionStorage`.
- `low` patch — успішний шлях входу (`onSuccess` → `login(code)`) без тесту, мок `auth` був мертвим.
- `medium` defer — режим редагування форм і валідація: перед Е7.2.
- `low` defer — помилки йдуть у глобальний store (`handleError`), тестовий store їх не бачить: разом із тостами Е2.5.
- `false` — відхилений `getFundraisingById` лишає сторінку порожньою: сервіси не відхиляють проміс (ловлять і повертають `undefined`).
- `low` reject — `findAllByRole(...)[0]` для дубльованих кнопок: дубль прибирається в Е3.1, тоді тест уточниться.
- `low` reject — серіалізований state у `LocationProbe`, тип `testUser`, порядок `type` серед імпортів, хибний state (0/''), параметризований `path` без `route`: допоміжний код тестів, наслідок — лише незручність при написанні нових тестів.
- Verification-gap: прогалин не знайдено (jest 33/33, tsc чисто, B2-регресія ловиться).
