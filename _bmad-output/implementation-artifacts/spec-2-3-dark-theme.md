---
title: 'Е2: опційна темна тема з перемикачем'
type: 'feature'
created: '2026-10-08'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Андрій хоче органічну темну тему: сайт відкривають із телефона, часто ввечері й у темному режимі системи, а зараз він завжди світлий.

**Approach:** Опційна темна тема за затвердженими макетами Sally (`mockups/v2/dark.css`, `pm-theme.js`, `MOBILE.md` §5) на вбудованому механізмі Bootstrap 5.3 `data-bs-theme`: типово — як у системі (`prefers-color-scheme`), перемикач у хедері з трьома станами «світла / темна / як у системі», вибір зберігається в `localStorage`, тема ставиться до першого малювання (без блимання). Світла лишається типовою для систем без темного режиму; логотип у темній — завжди у світлому крузі. Логіка застосунку, сервіси, store не змінюються.

## Boundaries & Constraints

**Always:** значення токенів — з `dark.css` (контрасти WCAG AA вже пораховані Sally); жорстко закодовані кольори в `src/styles/*.scss` і компонентних `.scss` переводяться на токени, щоб обидві теми працювали; футер і коло під логотипом — фіксовані кольори, не залежні від теми; `localStorage` — лише в `try/catch`, сайт працює без нього; смоук-тести зелені.

**Never:** третій колір-акцент чи зміна світлої теми; інверсія або фільтри логотипу; нові npm-пакети; зміни сервісів, store, маршрутів.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Перший візит, система темна | `localStorage` порожній, `prefers-color-scheme: dark` | `<html data-bs-theme="dark">` ще до React | — |
| Перший візит, система світла | те саме, світла | `data-bs-theme="light"` | — |
| Ручний вибір | клік перемикача | цикл світла → темна → як у системі; збережено; `aria-label` відображає стан | `localStorage` кидає → тема змінюється на сторінці, не зберігається |
| «Як у системі» + зміна системи | слухач `matchMedia` | тема змінюється без перезавантаження | при явній світлій/темній — не реагує |
| Перезавантаження з темною | `pm-theme=dark` | без спалаху білого | — |

</frozen-after-approval>

## Code Map

- `patronage-client/public/index.html` — синхронний інлайн-скрипт у `<head>` до посилань на шрифти/стилі: читає `localStorage['pm-theme']` (`light|dark|auto`, у `try/catch`), для `auto`/порожнього — `matchMedia('(prefers-color-scheme: dark)')`, ставить `data-bs-theme` на `<html>`. Логіка — як `mockups/v2/pm-theme.js`.
- `src/styles/_tokens.scss` — додати блок `[data-bs-theme="dark"] { … }` з токенами з `dark.css` (у т.ч. `--pm-surface-2`, `--pm-link`, `--pm-border-strong`, `--pm-focus`) і перевизначення `--bs-body-bg/-color`, `--bs-emphasis-color`, `--bs-secondary-color`, `--bs-tertiary-bg`, `--bs-border-color`, `--bs-heading-color`, `--bs-link-color(-rgb)`; нові токени, яких бракує світлій темі (`--pm-input-bg`, `--pm-input-border`, `--pm-placeholder`, `--pm-danger-soft`, `--pm-focus-ring`, `--pm-nav-bg`, `--pm-footer-bg` фіксований `#0B1E3A`/`#07111F`, `--pm-logo-chip-bg` фіксований світлий, `--pm-on-gold`, `--pm-on-primary`); `:root { color-scheme: light } [data-bs-theme=dark] { color-scheme: dark }`.
- `src/styles/_theme.scss`, `_shell.scss`, `_fundraising.scss`, `components/fundraisings/fundraisings.scss` — замінити хардкод (`#fff`, `rgba(255,255,255,.92)`, `#BDCBD8`, `#6B7A8C`, `#8A97A6`, `#FBEAEC`, `#F6D5D9`, `#D1E9F4`, `rgba(10,110,156,.22)` тощо) на токени; компонентні перевизначення для темної — з `dark.css` (`.btn-primary` з темним текстом, dropdown, форми, модалка, тост, пагінація, `.pm-source`, `.pm-panel`, бейдж організації, `.pm-cover` градієнти); після змін `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src/styles src/components --include=*.scss` має лишати лише `_tokens.scss` і свідомі фіксовані кольори.
- Новий `src/hooks/useTheme.ts` — стан `light|dark|auto`, `setTheme` пише в `localStorage` (try/catch) і ставить атрибут, слухач `matchMedia` лише в `auto`.
- `src/components/header/header.tsx` — кнопка-перемикач (іконка сонце/місяць/авто, `aria-label` «Тема: світла/темна/як у системі», 44 px), на десктопі поряд з аватаром/«Увійти», на мобільному біля бургера; бренд-логотип у колі `--pm-logo-chip-bg` у темній.
- `src/setupTests.ts` — заглушка `window.matchMedia`.
- Тести: новий `src/tests/ui/theme.test.tsx` за матрицею (атрибут, цикл, `localStorage` кидає, `auto` слухає зміну) + перемикач є в хедері.

## Tasks & Acceptance

**Execution:**
- [ ] `public/index.html` -- скрипт без блимання -- матриця 1, 2, 5
- [ ] `src/styles/_tokens.scss` + усі `.scss` з хардкодом -- токени темної теми -- вигляд
- [ ] `src/hooks/useTheme.ts`, `src/components/header/header.tsx` -- перемикач -- матриця 3, 4
- [ ] `src/setupTests.ts`, `src/tests/ui/theme.test.tsx` -- тести матриці -- захист

**Acceptance Criteria:**
- Given темна тема, then головна, сторінка збору, вхід, організації й форми читаються (немає білого тексту на білому/темного на темному), логотип у світлому крузі, жовта «Задонатити» з темним текстом.
- Given світла тема, then вигляд не змінився відносно поточного (порівняння скріншотів).

## Verification

**Commands:**
- `cd patronage-client && npx jest && npx tsc --noEmit` -- expected: зелено
- `grep` з Code Map -- expected: хардкод лише в токенах
- headless-скріншоти `/patronage_of_military_units`, `/fundraisings/3`, `/organizations`, `/login` у світлій і темній (темну задати через `localStorage` у профілі або `?`-параметр не потрібен — достатньо Firefox-префа `ui.systemUsesDarkTheme=1` у скретч-профілі) на 1366 і 500 px -- expected: як `mockups/v2/shots/dark-*.png`

## Implementation Notes

- Оточення: dev-сервер працює у фоні (http://localhost:3000). Для темних скріншотів: скретч-профіль Firefox з `user.js`: `user_pref("ui.systemUsesDarkTheme", 1);` (тоді `prefers-color-scheme: dark`).

## Spec Change Log

## Review Triage Log
