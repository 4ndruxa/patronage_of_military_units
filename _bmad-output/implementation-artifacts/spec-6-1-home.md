---
title: 'Е6: головна — hero з логотипом, «Як це працює», картки зборів, смуга з фото'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: 'd3e5f135200ab718eb9e4c25ce7ff26a2ce23702'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-6-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Головна — перше, що бачить людина, і вона найбільше відстає від затвердженого макета: велике фото зі зброєю на весь перший екран, текст із README без жодної кнопки дії, сім однакових карток з однаковою картинкою, пагінація навіть для однієї сторінки.

**Approach:** Перенести макет `mockups/v2/01-home.html` (і його темний варіант): hero з одним головним об'єктом (логотип у колі з м'яким світінням, великий заголовок, CTA «Переглянути збори» і «Організації» без прокрутки), компактне «Як це працює» з трьох кроків, сітка карток зборів (обкладинка-градієнт за `id`, бейдж організації, назва, опис у 2 рядки, «Детальніше»), смуга «Кому ми допомагаємо» з фото нижче сітки (кадр без зброї, `loading="lazy"`), спільна пагінація, що ховається при одній сторінці, і порожній стан. Без цифр у hero (D16); термометр і кількість підписників на картці — заглушки до API. Запити й навігація з карток (`navigate` зі `state`) — ті самі.

## Boundaries & Constraints

**Always:** розмітка/класи з макета і `pm.css` (`.pm-hero`, `.pm-hero-logo`, `.pm-eyebrow`, `.pm-steps`, `.pm-card`, `.pm-cover`, `.pm-badge-org`, `.pm-desc`, `.pm-foot`, `.pm-more`, `.pm-photo`); прийоми з `VISUAL-POLISH.md` (світіння логотипа, `clamp` до 56 px, ambient-градієнт, радіус 20 px, пружне натискання, м'який reveal перших 6 карток — початковий стан видимий, вимикається reduced-motion); обидві теми й мобільний (≥ 44 px); тексти — канон Mary; смоук-тест Fundraisings зелений.

**Never:** цифри в hero; вигадані числа на картках; нові запити до API; зміни сервісів, store, маршрутів; сторінки організацій (окрема специфікація); зміна логотипа.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Збори є | 7 зборів | сітка 1/2/3 колонки (< 576 / < 992 / ≥ 992), 6 на сторінку, пагінація «1 2» | — |
| ≤ 6 зборів | 4 збори | пагінації немає | — |
| Зборів немає | `[]` | порожній стан «Зборів поки немає. Зазирніть пізніше.» | — |
| Запит не вдався | сервіс повернув `undefined` | порожній стан помилки «Не вдалося завантажити дані. Спробуйте ще раз.» + «Повторити» (повторює той самий `getFundraisings`) | глобальний тост лишається |
| Клік картки | будь-де по картці | `/fundraisings/:id` зі `state` (як зараз) | — |
| CTA | «Переглянути збори» | плавний скрол до сітки (`#zbory`) | reduced-motion — без анімації |

</frozen-after-approval>

## Code Map

- `src/components/hero/hero.tsx` + новий `src/styles/_home.scss` (підключити в `index.scss`) — розмітка hero з макета без блоку `pm-stat`; логотип — `src/assets/logo.png` у колі (на мобільному 120 px над заголовком); світіння й ambient-градієнт із `VISUAL-POLISH.md`; блок «Як це працює» (`pm-steps`) у тому ж файлі або окремим компонентом.
- Новий `src/utils/cover.ts` — `coverClass(id)` → `pm-g1..pm-g6` (детерміновано, `Math.abs(id) % 6 + 1`, `NaN` → `pm-g1`); юніт-тест; `src/components/fundraising/fundraising.tsx` перевести на цю функцію (зараз обчислює сам).
- Нові `src/components/ui/fundraisingCard.tsx`, `pagination.tsx`, `emptyState.tsx` — презентаційні (props, без стану), розмітка з макета; у картці `{/* TODO(Е4/API): термометр, кількість підписників */}`; уся картка клікабельна (`stretched-link` або кнопка на всю картку з тим самим обробником), фокус видно.
- `src/components/fundraisings/fundraisings.tsx` + `fundraisings.scss` — заголовок секції «Актуальні збори» + «Усі організації», сітка на `FundraisingCard`, `Pagination`, `EmptyState`; стан помилки (окремий від «порожньо»); прибрати `active-card-page`/старі стилі. Ті самі `getFundraisings`/`getFundraisingsByOrganization` і `navigate` зі `state` (компонент використовує й сторінка організації — не зламати її).
- Смуга фото: новий `src/components/home/photoStrip.tsx` (або в `homePage.tsx`) з `src/assets/hero-background.webp`, `object-position` на прапор/постать без зброї, градієнт ink, підпис «Ілюстрація», CTA «Переглянути збори» (скрол).
- `src/views/homePage/homePage.tsx` — порядок: Hero → Як це працює → Збори → Смуга фото.
- Тести: `src/tests/ui/fundraisings.test.tsx` (оновити: картки, пагінація прихована при ≤ 6, порожній стан, стан помилки з «Повторити»), новий `src/tests/cover.test.ts`, `home.test.tsx` (hero: заголовок і дві CTA, без цифр).

## Tasks & Acceptance

**Execution:**
- [x] `src/utils/cover.ts` + тест; `fundraising.tsx` на неї -- обкладинки
- [x] `src/components/ui/*` -- картка, пагінація, порожній стан
- [x] `hero.tsx`, кроки, смуга фото, `homePage.tsx`, `_home.scss` -- головна
- [x] `fundraisings.tsx`/`.scss` -- сітка на нових компонентах
- [x] тести -- матриця

**Acceptance Criteria:**
- Given 1366×768 і 390 px, then обидві CTA видно без прокрутки; у hero немає цифр і фото зі зброєю.
- Given світла й темна теми, then головна виглядає як `mockups/v2/shots/01-home-*.png` і `dark-01-home-*.png` (без термометра/лічильників на картках і без цифр у hero).

## Verification

**Commands:**
- `cd patronage-client && npx jest && npx tsc --noEmit` -- expected: зелено
- headless-скріншоти головної 1366 і 500 px, світла й темна -- expected: як макет

## Implementation Notes

- Оточення: dev-сервер працює у фоні; темний скретч-профіль Firefox: `user.js` з `user_pref("ui.systemUsesDarkTheme", 1);`.

## Spec Change Log

## Review Triage Log

- Рев'ю не завершено: сесію перервано, а розробку призупинено за рішенням Андрія (2026-10-08). Перед поверненням до Е6 прогнати рев'ю цієї зміни.
