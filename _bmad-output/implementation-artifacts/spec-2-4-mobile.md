---
title: 'Е2: мобільні правки — цілі дотику, нижня панель, дзвіночок, легкі картинки'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: '43ac8edaf6d077130e34bceb3f8f0d854d003bfc'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Основні дії донора — з телефона, а аудит Sally (`mockups/v2/MOBILE.md`) знайшов: цілі дотику менші за 44 px (кнопки `btn-sm`, пагінація, хрестики, пункти меню), на сторінці збору дві однакові золоті «Задонатити» одночасно (у панелі й у нижній смузі), немає швидкого шляху до «Мої підписки» з хедера, а картинки важать кілька мегабайт (`hero-background.webp` ≈ 2 МБ, PNG по ≈ 1 МБ). Дрібниці: під джерелами оплати видно технічний тип (`monobank`, `card`), футер досі каже «на сторінці організації».

**Approach:** Перенести затверджені Андрієм правки Sally (раунд 6): на ширині < 992 px мінімум 44 px для `.btn`, `.btn-sm`, `.nav-link`, `.page-link`, `.btn-close`, `.dropdown-item`, поля форм ≥ 48 px і 16 px шрифт; нижня панель сторінки збору з'являється лише коли головна «Задонатити» в панелі вийшла з поля зору; у хедері для залогіненого — дзвіночок-посилання на «Мої підписки» (поки без лічильника — заглушка до API); стиснути картинки без зміни вигляду (логотип — лише зменшена копія для хедера/футера, сам файл-оригінал не змінюється). Підписи джерел — людською мовою, футер — «на сторінці оплати». Правки форм і кабінету з аудиту — в Е7, не тут.

## Boundaries & Constraints

**Always:** розміри й поведінка — з `MOBILE.md` і `pm.css`; `prefers-reduced-motion` поважається; нижня панель без JS-підтримки `IntersectionObserver` поводиться як зараз (завжди видима); у jsdom — заглушка `IntersectionObserver` у `setupTests.ts`; смоук-тести зелені.

**Never:** вигаданий лічильник на дзвіночку; зміна вигляду логотипу; зміни сервісів, store, маршрутів; форми й кабінет (Е7).

</frozen-after-approval>

## Code Map

- `src/styles/_theme.scss` (або новий `_mobile.scss`, підключений в `index.scss`) — `@media (max-width: 991.98px)` цілі 44 px і поля 48 px / 16 px — значення з `mockups/v2/pm.css` (секція мобільних цілей).
- `src/components/fundraising/fundraising.tsx` + `_fundraising.scss` — `IntersectionObserver` на головній «Задонатити» в панелі; клас стану (напр. `pm-actionbar--visible`) з плавною появою (transform/opacity, вимикається reduced-motion); `body.pm-has-actionbar` і відступи футера/тосту — лише коли панель видима або лишити як є (не повинно бути стрибків). Без підтримки IO — панель видима.
- `src/components/header/header.tsx` — для користувача іконка-дзвіночок (`Link` на `/my-subscriptions`, `aria-label="Мої підписки"`, 44 px) поряд із перемикачем теми, на мобільному біля бургера; `{/* TODO(API): лічильник «ще не позначено: N» — Е5 */}`.
- Картинки `src/assets/` і `public/`: `hero-background.webp` → ≤ 300 КБ (ширина ~1600, якість ~75); `hero.png`, `organization-default.png`, `fundraising-default.png` → WebP або стиснений PNG ≤ 200 КБ (зберегти імена або оновити імпорти); нова `src/assets/logo-96.png` (або webp) — зменшена копія `logo.png` для хедера/футера (44–56 px), `logo.png` не чіпати. Інструменти — `magick` (є в системі) або Pillow; перевірити, що імпорти в коді збігаються.
- Підписи джерел: мапа типів (`monobank` → «Відкриється сторінка банки», `card` → «Реквізити картки», `paypal` → «Відкриється PayPal», інше → «Відкриється сторінка оплати») у `fundraising.tsx`.
- `src/components/layout/footer.tsx` — «донат ви робите на сторінці оплати».
- Тести: `setupTests.ts` (заглушка IO), `fundraising.test.tsx` (панель видима без IO; підписи джерел людською мовою), `shell.test.tsx`/`header.test.tsx` (дзвіночок для користувача веде на `/my-subscriptions`, гостю немає).

## Tasks & Acceptance

**Execution:**
- [x] мобільні цілі дотику (SCSS) -- 44/48 px
- [x] `fundraising.tsx`, `_fundraising.scss` -- панель за IO -- одна золота кнопка на екрані
- [x] `header.tsx` -- дзвіночок -- швидкий шлях до підписок
- [x] картинки + імпорти -- вага -- швидкість на телефоні
- [x] підписи джерел, футер -- тексти
- [x] тести -- захист

**Acceptance Criteria:**
- Given 390–500 px сторінка збору на початку, then нижня панель прихована; given прокрутка нижче панелі, then панель з'являється.
- Given `du -k` картинок, then `hero-background.webp` ≤ 300 КБ, жодна інша картинка в `src/assets` (крім оригіналу `logo.png`) > 250 КБ.

## Verification

**Commands:**
- `cd patronage-client && npx jest && npx tsc --noEmit` -- expected: зелено
- `du -k src/assets/* public/*.png` -- expected: межі вище
- headless-скріншоти головної й `/fundraisings/3` на 500 px, світла й темна -- expected: без змін у вигляді, крім доданого дзвіночка/прихованої панелі

## Implementation Notes

- Оточення: dev-сервер працює у фоні; темний скретч-профіль Firefox: `user.js` з `user_pref("ui.systemUsesDarkTheme", 1);`. Для входу немає Google — стан користувача перевіряти тестами.

## Spec Change Log

## Review Triage Log

- `low` reject — дзвіночок лише мобільний (`d-lg-none`) всупереч Code Map: свідоме рішення оркестратора за макетом 01-home (на десктопі до підписок веде аватар-меню); зафіксовано тут.
- `low` patch — невикористані `cat-money-maker.webp`, `hero.webp`, `logoInPhone.webp`: видалити.
- `medium` patch — `public/logo.png` 780 КБ досі favicon/apple-touch/manifest: окремі 192/512/180 px копії, оригінал не чіпаємо.
- `low` patch — тост піднятий, коли панель прихована: окремий клас за видимістю панелі.
- `low` patch — 72 px висоти хедера зашито в `rootMargin`: вимірювати `.pm-nav`.
- `low` patch — `card` з посиланням підписано «Реквізити картки»: за наявністю посилання.
- `low` patch — `.page-link` фіксованої ширини, `.btn` inline-flex без gap, вузькі хлібні крихти.
- `low` patch — дзвіночок без `aria-current`: `NavLink`.
- `low` patch — порожній рядок і коментар після `return` у ефекті.
- `low` reject — `.btn` з `display:none` нижчої специфічності знову з'являться: у проєкті ховаємо лише `d-none` (`!important`).
- `low` reject — фокус лишається на прихованій панелі: `visibility: hidden` забирає елемент із фокус-порядку; рідкісний сценарій.
- `low` reject — експорт мок-класу з `setupTests.ts`, глобальний мок без `afterEach`: допоміжний код тестів.
- `low` patch — тести: підписи для джерел без посилання, спостерігач на неактивній кнопці, клас підняття тосту (verification-gap).
