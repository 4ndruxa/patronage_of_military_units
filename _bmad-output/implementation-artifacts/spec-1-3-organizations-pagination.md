---
title: 'Е1 / B3: пагінація організацій'
type: 'bugfix'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** На сторінці «Організації» кількість сторінок рахується з `(organizations && []).length` (`organizations.tsx:45`) — це завжди 0, тож кнопок пагінації немає і організації після шостої недосяжні.

**Approach:** Рахувати сторінки з реальної кількості завантажених організацій (6 на сторінку, як зараз); решта сторінки без змін.

</frozen-after-approval>

## Implementation Notes

- Зроблено: сторінки з `organizations.length`; `data || []` (сервіс повертає `undefined` при помилці, інакше `.length` упав би); прибрано зайві `organizations &&`. Перевірка: `tsc` 0 помилок, jest 17/17; формула: 7 → 2 сторінки, 13 → 3. У демо-БД 4 організації, тож вручну видно лише 1 сторінку. Компонентний тест — у 1.8.

## Review Triage Log

- `low` reject — організації після 100-ї недосяжні (дефолтний `limit=100`): стара межа в усіх списках, рідко; потребує серверної пагінації.
- `low` reject — `currentPage` не обмежується: список на цій сторінці не зменшується (лише читання).
- `low` reject — пагінація з однією сторінкою, нема порожнього/завантаження: заплановано в Е6.3 (`Pagination` ховається при 1 сторінці, `EmptyState`, скелетони).
- `false` — невдалий запит без сигналу: `handleError` показує глобальну плашку.
- `low` patch — зайвий `currentOrganizations &&`: прибрано. `fundraisings && (...)` у `myFundraisings.tsx` дає правильний результат (масив завжди truthy) — не баг; спільний `Pagination` — Е6.3.
- `low` reject — немає компонентного тесту, `key={index}`, доступність кнопок пагінації: 1.8 і 8.1 / 6.3.
