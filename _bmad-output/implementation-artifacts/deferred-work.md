- source_spec: none
  summary: Скріншоти «до» всіх сторінок на 1366 і 390 px (FINAL-PLAN Е0, історія 0.3)
  evidence: Відокремлено від baseline тестів (0.1+0.2) рішенням Андрія «Розділити» на кроці Clarify bmad-build; незалежний результат, не залежить від тестів.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-0-1-test-baseline.md`
  summary: Оновити jest.config.js — прибрати застарілий globals['ts-jest'] і охопити .tsx у transform.
  evidence: Наявний конфіг (не з цієї зміни) дає deprecation у ts-jest 29.x і не трансформує .tsx; знадобиться для смоук-тестів компонентів (FINAL-PLAN 1.8).
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-0-1-test-baseline.md`
  summary: Прибрати з git server/sql_app.db і server/virtualenv (дев-БД з даними та дамп Windows PATH).
  evidence: Обидва файли відстежуються з HEAD і не потрібні для збірки; стара проблема, не спричинена цією зміною.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-0-1-test-baseline.md`
  summary: Додати CI (GitHub Actions), що запускає npm ci + jest + tsc і server/run_tests.sh.
  evidence: Зараз регресії ловляться лише вручну; .github/workflows відсутній.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-1-access-security.md`
  summary: Збір можна прив'язати до чужої організації (create/update_fundraising не перевіряє власника organization_id).
  evidence: Поведінка існувала до зміни; форма збору показує всі організації, тож обмеження — продуктове рішення (хто може збирати від імені організації) разом із модерацією Е10. Severity medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-1-access-security.md`
  summary: Без JWT_SECRET сервер стартує з публічним dev-ключем (лише WARNING) — перед будь-яким деплоєм вимагати змінну або явний dev-прапорець.
  evidence: Поведінку свідомо зафіксовано в intent (рядок матриці «Немає JWT_SECRET»); для публікації (D11/Е10) це має стати fail-closed. Severity medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-1-access-security.md`
  summary: Клієнт не обробляє прострочену сесію: 401 на мутаціях показує сиру плашку «Request failed with status code 401», стан auth не скидається, повторний вхід не пропонується.
  evidence: Стара UX-прогалина (раніше так само з 403); з exp 24 год стане помітнішою. Severity medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-1-access-security.md`
  summary: POST /users/ дозволяє будь-якому автентифікованому створювати акаунти для інших (маршрут не використовується клієнтом; користувачі створюються через OAuth).
  evidence: Раніше маршрут був відкритий навіть гостям; зараз звужено, але рольової перевірки немає. Severity low — прибрати маршрут разом із тестом.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-2-my-fundraisings-owner.md`
  summary: «Видалити» в «Мої збори» прибирає картку навіть при невдалому запиті (сервіс ковтає помилку і повертає undefined) — перевіряти результат перед оновленням стану.
  evidence: Стара поведінка (myFundraisings.tsx, onClick видалення); з перевіркою власності 403 можливий для чужих даних, а мережевий збій — завжди. Брати разом з 7.3 (підтвердження видалення). Severity medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-4-fundraising-by-id.md`
  summary: Сторінка збору не розрізняє 404 і мережеву/серверну помилку — будь-який збій показує «Збір не знайдено» (плюс сира глобальна плашка).
  evidence: Сервіси ковтають помилки й повертають undefined (handleError); розрізнення потребує, щоб сервіс повертав статус. Брати разом із тостами Е2.5. Severity low–medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-5-idempotent-subscriptions.md`
  summary: «Мої підписки» показують збори, видалені після підписки (get_subscriptions_by_user не фільтрує Fundraisings.deleted_at), а повторно підписатися на них уже не можна.
  evidence: Стара поведінка crud.get_subscriptions_by_user; тепер помітніше, бо POST на видалений збір дає 404. Severity low–medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-5-idempotent-subscriptions.md`
  summary: Тест шляху для БД з кількома рядками на пару (порядок у _find_subscription, відписка всіх активних) і прогін скрипта дедуплікації на Postgres.
  evidence: Усі crud-тести працюють на БД з унікальним індексом, де дублі неможливі; скрипт тестується лише на SQLite. Бойова БД вже очищена (--apply двічі, 0 рядків). Severity medium (unverified).
