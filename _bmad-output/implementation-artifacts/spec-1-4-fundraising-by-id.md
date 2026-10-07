---
title: 'Е1 / B4: сторінка збору за прямим посиланням і після оновлення'
type: 'bugfix'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Сторінка `/fundraisings/:id` бере дані лише з `location.state` (`fundraising.tsx:15-19`), тож пряме посилання, F5 чи перехід із закладок показують вічне «Loading...».

**Approach:** Якщо `state` немає — завантажити збір за `id` з URL через наявний `getFundraisingById`; неіснуючий чи некоректний `id` — зрозуміле повідомлення «Збір не знайдено» з переходом до всіх зборів. Дані з `state` лишаються пріоритетними (без зайвого запиту з карток); маршрут не змінюється.

</frozen-after-approval>

## Implementation Notes

- Зроблено: `fundraising.tsx` — `useParams` (`routeId`, бо нижче вже деструктурується `id` зі збору), без `state` — `getFundraisingById`, некоректний/неіснуючий id → `notFound` з кнопкою «До всіх зборів»; прапорець `cancelled` проти запізнілої відповіді при зміні id; `img` для завантаженого збору — той самий `fundraising-default.png`, що й у картках.
- Перевірка: `tsc` 0 помилок, jest 17/17; headless-скріншоти: `/fundraisings/3` відкривається напряму, `/fundraisings/9999` і `/fundraisings/abc` — «Збір не знайдено». Для гостя плашки «Network Error» немає (підтверджує B1).
- Відомо: для 404 сервіс через `handleError` ще показує глобальну сиру плашку «Request failed with status code 404» — замінюється тостами в Е2.5.

## Review Triage Log

- `low` defer — будь-який збій запиту показується як «не знайдено»: при мережевій помилці глобальна плашка однаково показує причину; розрізнення потребує зміни сервісів — разом із Е2.5.
- `low` patch — коментар хибний: `location.state` переживає перезавантаження через `history.state`, тож F5 після переходу з картки показує знімок без запиту (як і до зміни; intent явно лишає state пріоритетним). Коментар виправлено.
- `low` reject — state не звіряється з id з URL: у коді немає переходу на `/fundraisings/:id` з чужим state; стан недосяжний.
- `low` patch — при зміні id без state на екрані лишався попередній збір (і кнопки діяли на нього): тепер `setFundraisingData(null)` перед запитом.
- `low` patch — `Number()` приймав `1e2`, `0x10`, ` 5 `: тепер лише `^\d+$`.
- `low` reject — англійське «Loading...» без стилю: замінюється скелетонами в Е6.4.
- `low` reject — заголовок сторінки і фокус на «Збір не знайдено»: a11y-прохід Е8.1.
- `low` reject — немає компонентних тестів: інфраструктура в 1.8.
- `low` reject — третя копія мапінгу `img: fundraisingDefault`: спільна картка й `cover.ts` в Е6.3 замінюють усі три.
