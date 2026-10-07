---
title: 'Е2: тема з логотипу (кольори, шрифти, базові стилі Bootstrap)'
type: 'feature'
created: '2026-10-08'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Сайт має дефолтну тему Bootstrap з випадковими кольорами (`#006785`, `#5b99ac`) і тонкий весільний шрифт Cormorant Garamond, нав'язаний через `!important`; `index.html` — англійською (`lang="en"`, чорний `theme-color`, manifest «Create React App Sample»). Це не відповідає ні логотипу, ні затвердженим макетам.

**Approach:** Перенести глобальний шар затверджених макетів Sally (`mockups/v2/pm.css`, styleguide) у клієнт: кольори логотипу — у змінні Bootstrap і токени `--pm-*`; шрифти Unbounded (заголовки) і Manrope (текст) замість Cormorant; базові стилі кнопок, полів, модалок, пагінації, фокусу. `index.html` і `manifest.json` — українською, з кольорами бренду. Компоненти (хедер, футер, картки, hero) не переробляються — це наступні специфікації; логіка не змінюється.

</frozen-after-approval>

## Implementation Notes

- Зроблено: `_variables.scss` — кольори/радіуси/шрифт Bootstrap з логотипу (`$color-contrast-dark` = ink, щоб текст на жовтому був navy, не чорний); `styles/_tokens.scss` — `--pm-*` з `pm.css`; `styles/_theme.scss` — глобальний шар `pm.css` (база, фокус, заголовки, кнопки вкл. `.btn-donate`/`.btn-outline-ink`/ghost, dropdown, форми, модалки, пагінація); `index.scss` без Cormorant і `!important`. Шрифти підключено `<link>` у `index.html` (з preconnect) — так вони гарантовано йдуть до стилів Bootstrap, без порядку `@import` у Sass. `index.html`: `lang="uk"`, українські title/description, `theme-color #0B1E3A`; `manifest.json` українською з `logo.png` і кольорами бренду.
- Перевірка: jest 35/35, `tsc` 0 помилок, dev-сервер «compiled with 1 warning» (старі ESLint-попередження), headless-скріншоти головної, збору й входу — шрифти й кольори застосовано, сторінки не зламані.
- Свідомо не перенесено зараз: `.pm-*` компонентів (навбар, hero, картки, футер, тости, бейджі, порожні стани) — наступні специфікації Е2–Е7.

## Review Triage Log

- `low` patch — глобальний `:focus-visible { border-radius: 6px }` робив сфокусовану кнопку-таблетку кутастою, плюс подвійне кільце (outline + box-shadow Bootstrap): прибрано радіус, у `.btn:focus-visible` вимкнено box-shadow.
- `low` patch — спільний padding `.form-control, .form-select` ховав текст під стрілкою select: `.form-select { padding-right: 2.25rem }`.
- `low` reject — зламані `-sm`/`-lg` розміри полів: у проєкті не використовуються.
- `low` reject — стиль `.page-item.active` не діє, бо списки використовують `active-card-page`: спільний `Pagination` замінить це в Е6.3.
- `low` defer — `notificationAlert.scss` і `header.css` перебивають тему (сіра шапка модалки, чорне підкреслення): наступна специфікація оболонки.
- `low` patch — коментар «Values mirror» хибний щодо радіусів: уточнено (кольори дзеркалять токени, радіуси — мапінг Bootstrap з макетів).
- `low` reject — кольори дубльовано в SCSS і CSS-змінних, хардкод `#BDCBD8` тощо: значення взято з затвердженого `pm.css` як є.
- `low` reject — `.h1/.h2`, розмір `h4`: заголовки сторінок переробляються в Е3–Е7.
- `low` patch — reduced-motion вимикав і спінери: стандартний підхід із майже нульовою тривалістю та винятком для спінерів, плюс `::before/::after`.
- `low` reject — `.modal-content { overflow: hidden }` обрізає dropdown у модалках: таких модалок немає; стиль із макету.
- `low` reject — manifest без іконок 192/512 і maskable: PWA-встановлення не ціль демо-режиму (D11).
- `low` patch — `<noscript>` англійською: перекладено.
- `low` reject — Google Fonts блокують рендер / IP до Google / вага 800: джерело шрифтів затверджено в DESIGN.md, вагу 800 використовує бренд у навбарі (наступна специфікація).
- `low` reject — немає скріншотів «після»: Е8.2.
