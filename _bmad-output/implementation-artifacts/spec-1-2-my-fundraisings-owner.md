---
title: 'Е1 / B2: «Мої збори» показують збори поточного користувача'
type: 'bugfix'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Сторінка «Мої збори» завжди запитує збори користувача з id 1 (`myFundraisings.tsx:12`, `const creatorId = 1`), тож кожен бачить чужі збори, а власних не бачить.

**Approach:** Брати id з `auth.user` у Redux (як у `mySubscriptions.tsx`) і робити запит лише коли користувач відомий; решта сторінки без змін.

</frozen-after-approval>

## Implementation Notes

- Компонентний тест для B2 не пишеться в цій зміні: jest зараз налаштований на `testEnvironment: 'node'` і лише `*.test.ts`, а в корені `node_modules` лежить `jest-environment-jsdom@27` (від react-scripts), несумісний з jest 29. Інфраструктура компонентних тестів — історія 1.8; тест «MyFundraisings: запит з `user.id`, а не 1» уже в її мінімальному наборі (v2/implementation.md §1.6). Тут — перевірка `tsc` і вручну через API.
- Зроблено: `myFundraisings.tsx` бере `user` з `state.auth.user`, запит лише при наявному `user`, залежність `[user]`; `data || []` — щоб помилка запиту (сервіс повертає `undefined`) не валила `.slice`. `tsc` — 0 помилок, jest 17/17. API `/fundraisings/by-creator/{id}` повертає різні набори для різних id — сторінка тепер показуватиме набір поточного користувача.

## Review Triage Log

- `low` patch — ефект залежить від усього об'єкта `user` (новий об'єкт від `setUser` → зайвий запит): залежність тепер `user?.id`.
- `low` reject — немає захисту від запізнілої відповіді: сторінка під `ProtectedRoutes`, вихід веде на `/login` і демонтує компонент; гонка рідкісна, захист додає гілку.
- `false` — список не очищається, коли `user` стає null: при виході компонент демонтується (навігація на `/login`).
- `low` reject — немає стану завантаження / порожнього стану: заплановано в Е6.4 і Е7.1 (скелетони, EmptyState).
- `false` — помилки приховано: сервіс викликає `handleError`, який показує глобальну плашку; `data || []` лише не дає впасти `.slice`.
- `low` patch — `getFundraisingsByCreator` без типу повернення: додано `Promise<Fundraising[] | void>` і generic.
- `medium` defer — невдале видалення все одно прибирає картку: стара поведінка, разом із 7.3.
- `low` reject — `currentPage` не обмежується після видалення; ліміт 100; `key={index}`; порожня перевірка `fundraisings &&`: старі дрібниці, сторінка переробляється в Е7.
- `low` reject — немає тестів: інфраструктура компонентних тестів — 1.8, тест B2 у її наборі (див. Implementation Notes).
