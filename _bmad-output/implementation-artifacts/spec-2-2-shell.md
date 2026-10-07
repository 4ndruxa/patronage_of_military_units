---
title: 'Е2: оболонка — хедер, футер, PageLayout, тост помилок, модалка-нагадування'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: 'd401501faab6c4c8bd7dae6e529cd2fe490f8ece'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Після нової теми оболонка лишилась старою: хедер з ручним `innerWidth`, «Logout» англійською, чорне підкреслення, `<a>` без `href`; футера немає, а авторство стоїть у hero; помилки — червоний банер на всю ширину зверху; модалка-нагадування і старі `notificationAlert.scss`/`header.css` перебивають тему (сіра шапка, власні радіуси).

**Approach:** Перенести оболонку з затверджених макетів Sally: липкий навбар `pm-nav` (бренд з логотипом, «Збори», «Організації», гість — «Увійти», користувач — аватар-меню), спільний `PageLayout` (хедер + `<main>` + футер) для всіх сторінок, футер `pm-footer` з авторством (D15), тост помилки в правому нижньому куті, модалка-нагадування в стилі бренду. Обробники входу, виходу, навігації, таймер нагадування й логіка автозакриття помилки — ті самі; маршрути не змінюються.

## Boundaries & Constraints

**Always:** розмітка й класи — з `mockups/v2` (`01-home.html` навбар і футер, `08-states.html` тост, `03-thanks-modal.html` модалка) і `pm.css` (`.pm-nav`, `.pm-avatar`, `.pm-footer`, `.pm-logo-chip`, `.pm-toast`, `.pm-toast-area`, `.pm-modal-head`); тексти — `v2/hypotheses-and-copy.md`; логотип без змін; смоук-тести 1.8 зелені (у Header змінюється лише очікуваний текст «Logout» → «Вийти» і шлях до пунктів меню).

**Never:** не чіпати `ProtectedRoutes`/`PublicRoutes` (баг D18 — після дизайну); не змінювати store, сервіси, маршрути; не переробляти hero, картки, сторінки (наступні специфікації) — з hero лише прибрати рядок авторства.

</frozen-after-approval>

## Code Map

- `patronage-client/src/components/header/header.tsx` + `header.css` — переписати розмітку на `navbar navbar-expand-lg sticky-top pm-nav` (Bootstrap collapse замість `isMobile`/`resize`); активний пункт через `useLocation` + `NavLink`/`Link` (клас `active`), прибрати `activeTab` і `.highlight`; `header.css` видалити, стилі `.pm-nav`/`.pm-avatar` перенести з `pm.css` у `src/styles/_shell.scss`. Зберегти `handleLoginClick`, `handleLogoutClick` (logoutUser → dispatch(logout) → sessionStorage.removeItem('user') → navigate('/login')) і `status === 'loading'`. **Відхилення від макета:** у макеті немає меню «Додати», але сторінки створення досяжні лише з нього до Е7 — додати в аватар-меню пункти «Додати збір» і «Додати організацію». Аватар — ініціали з `user.name`; у мобільному меню поруч ім'я.
- Новий `src/components/layout/pageLayout.tsx` (Header + `<main id="main">` + Footer) і `src/components/layout/footer.tsx` — розмітка футера з `01-home.html`; авторство: «Ми не збираємо гроші: донат ви робите на сторінці організації. Проєкт розробив Андрій Боднар.» + посилання на `https://github.com/4ndruxa/patronage_of_military_units` + «Слава Україні!».
- `src/views/*/*.tsx` (10 файлів) — замінити `<Header />` + вміст на `<PageLayout>…</PageLayout>`.
- `src/components/hero/hero.tsx` — прибрати лише рядок «Виконав: ФІОТ…».
- `src/components/error/errorAlert.tsx` — та сама логіка (`useSelector`, таймер 5 с, `hideError`), розмітка тосту `pm-toast` у `pm-toast-area`, заголовок «Не вдалося виконати дію», деталь — `error`; `role="alert"`, кнопка закриття з `aria-label="Закрити"`.
- `src/components/notificationAlert/notificationAlert.tsx` + `.scss` — та сама логіка таймера й `handleDonateClick`; шапка `pm-modal-head` з логотипом, кнопки `btn-outline-ink` «Закрити» і `btn-donate` «Перейти до підписок»; тексти — канон Mary (без обіцянки листів); `.scss` видалити.
- `src/index.scss` — підключити `styles/_shell.scss`.
- `src/tests/ui/header.test.tsx` — оновити очікуваний текст і шлях до «Вийти» (тепер у аватар-меню); суть перевірок не змінювати.

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/_shell.scss`, `src/index.scss` -- стилі оболонки з `pm.css` -- тема компонентів
- [x] `src/components/header/*` -- новий навбар, видалити `header.css` -- хедер
- [x] `src/components/layout/*`, `src/views/*`, `src/components/hero/hero.tsx` -- PageLayout і футер -- оболонка всіх сторінок
- [x] `src/components/error/errorAlert.tsx`, `src/components/notificationAlert/*` -- тост і модалка -- сповіщення
- [x] `src/tests/ui/header.test.tsx` -- оновити тексти -- тести зелені

**Acceptance Criteria:**
- Given будь-яка сторінка, then вгорі липкий навбар з логотипом, знизу футер з авторством і посиланням на репозиторій; рядка «Виконав…» у hero немає.
- Given ширина 390 px, when користувач тисне бургер, then меню розгортається, після вибору пункту згортається.
- Given помилка запиту, then тост з'являється в правому нижньому куті й зникає через 5 с або по хрестику.
- Given гість/користувач, then «Увійти» веде на `/login`, «Вийти» виходить як раніше, «Додати збір/організацію» ведуть на `/add-fundraising` і `/add-organization`.

## Verification

**Commands:**
- `cd patronage-client && npx jest && npx tsc --noEmit` -- expected: зелено
- headless-скріншоти головної, сторінки збору й входу на 1366 і 390 -- expected: як у `mockups/v2/shots/01-home-*.png` для навбару й футера

## Implementation Notes

- Оточення: dev-сервер клієнта працює у фоні (http://localhost:3000, головна — `/patronage_of_military_units`); headless Firefox: `firefox --headless --profile <скретч-профіль> --window-size=W,H --screenshot out.png URL` (вужче ~500 px Firefox не робить — для 390 достатньо 500).

## Spec Change Log

## Review Triage Log

- `medium` patch — бургер не згортається, якщо вибрати пункт поточної сторінки (порушує AC): закривати й в onClick посилань.
- `low` patch — у статусі `idle` залогінений бачить «Увійти» на мить: кнопка входу лише при `succeeded`/`failed` без користувача.
- `low` patch — порожній кружок аватара / зламаний перший символ (емодзі): trim, `Array.from`, запасний «?».
- `low` patch — гість бачить «Мої підписки» у футері: лише для користувача.
- `medium` patch — модалка-нагадування показується гостям, хоча текст і кнопка про підписки: лише для користувача; Escape закриває, фокус на кнопку закриття.
- `low` patch — немає посилання «Перейти до змісту» для `<main id="main">`.
- `low` patch — правило активного пункту не покрите тестом (verification-gap): `test.each` для трьох маршрутів.
- `low` defer — PageLayout вручну в 10 views (перемонтування хедера): потребує layout-маршруту, а маршрути цією специфікацією не змінюються.
- `low` reject — `/redirect-bank-link` без оболонки: це миттєвий редирект, не сторінка.
- `low` reject — `HOME_PATH` у хедері й імпорт у футер, літерал шляху в інших файлах: косметика.
- `low` reject — прибрано ранній `return` на `loading`: свідоме рішення (навбар видно одразу, ховається лише блок входу), описано реалізатором.
- `low` defer — FontAwesome більше не використовується.
- `low` reject — інлайн-стилі, невикористаний `.pm-toast--ok`: модифікатор знадобиться для тосту успіху в Е3/Е5.
- `low` defer — живий регіон тосту, повтор тієї ж помилки, пастка фокусу/скрол модалки, тести стану завантаження, ініціалів і PageLayout у views: a11y-прохід Е8.1.
- `low` reject — на сторінках редагування жоден пункт не активний: так і має бути (це не «Збори» і не «Організації»).
