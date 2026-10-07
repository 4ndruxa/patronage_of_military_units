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
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-8-ui-smoke-tests.md`
  summary: Смоук-тести режиму редагування форм збору й організації (префіл + update) і валідації порожньої форми.
  evidence: 1.8 покриває лише створення; форми переробляються в Е7 — додати ці тести перед Е7.2. Severity medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-1-8-ui-smoke-tests.md`
  summary: Помилки в UI-тестах не видно: handleError диспатчить у глобальний store, а не в тестовий; тест «невдалий запит показує повідомлення» неможливий.
  evidence: services/errorHandler.tsx імпортує store/index; брати разом із тостами Е2.5 (інжекція store або мок errorHandler). Severity low–medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-2-1-theme.md`
  summary: ProtectedRoutes перекидає залогіненого на /login при прямому заході або F5 на захищеній сторінці (navigate перевіряє застарілий isAuth із замикання).
  evidence: Знайшов агент скріншотів «до»: /my-subscriptions тощо з чинною кукою відкриваються лише навігацією всередині застосунку (components/routes/protectedRoutes.ts). Старий баг. Severity high — виправити першим після теми.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-2-1-theme.md`
  summary: Сторінка /edit-fundraising/:id відкриває форму для чужого збору (сервер уже відмовить 403, але UI не перевіряє власника).
  evidence: Скріншот edit-fundraising: збір id 1 належить creator 2, форма відкрилась користувачу 1. Брати з Е7.2. Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-2-1-theme.md`
  summary: notificationAlert.scss глобально перебиває .modal-content/.modal-body/.modal-header новою темою, а шапка модалки й кнопка тепер сірі ( змінився на ink-muted); header.css .highlight — чорний.
  evidence: Старі стилі компонентів вантажаться після index.scss. Переробляються в наступній специфікації оболонки (Е2.3–2.5). Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-2-2-shell.md`
  summary: PageLayout обгорнуто вручну в 10 views — хедер перемонтовується при кожній навігації; перейти на layout-маршрут (<Route element={<PageLayout><Outlet/></PageLayout>}>) і прибрати per-view React.StrictMode.
  evidence: Змінює appRoutes.tsx (заборонено в spec-2-2); зручно разом із виправленням ProtectedRoutes (D18). Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-2-2-shell.md`
  summary: Доступність оболонки: живий регіон тосту має бути змонтований завжди; повторна та сама помилка не перезапускає таймер; модалка без блокування прокрутки й пастки фокусу; тести стану завантаження хедера, ініціалів з e-mail і наявності PageLayout на кожній сторінці.
  evidence: Рев'ю spec-2-2 (blind, verification-gap); брати в Е8.1 (a11y-прохід). Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-2-2-shell.md`
  summary: FontAwesome (@fortawesome/*) більше ніде не використовується — прибрати з package.json.
  evidence: Єдині імпорти (faBars) прибрано разом зі старим хедером. Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-3-1-fundraising-page.md`
  summary: «Задонатити» для гостя веде на /login (маршрут /redirect-bank-link під ProtectedRoutes), а для користувача — відкриває банку й перекидає поточну вкладку на головну (bankLinkRedirect). Треба відкривати джерело напряму window.open(url,'_blank','noopener,noreferrer') без переходу.
  evidence: Старий шлях донату, знайдено рев'ю spec-3-1 (edge, blind); intent spec-3-1 вимагав «той самий navigateToBankLink». Severity HIGH — гість не може задонатити. Перший у списку виправлень після дизайну (D18).
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-3-1-fundraising-page.md`
  summary: Повернення на збір після входу («Увійти, щоб підписатись» → /login → назад), підпис про це прибрано до реалізації.
  evidence: login.tsx перезавантажує сторінку, PublicRoutes кидає на головну. Разом із D18. Severity medium.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-3-1-fundraising-page.md`
  summary: Мобільна нижня панель: показувати лише коли основна «Задонатити» за екраном (IntersectionObserver, рішення Sally з MOBILE.md), індикатор «Ви підписані» в панелі, хардкод кольорів сторінки збору → токени.
  evidence: Подвійні кнопки на мобільному — як у старому макеті; Sally змінила це в раунді 6. Брати разом із темною темою й мобільними правками. Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-3-1-fundraising-page.md`
  summary: Живий регіон тосту успіху змонтований разом із текстом, кнопка підписки без aria-busy; скидання стану підписки при зміні routeId без тесту.
  evidence: Рев'ю spec-3-1; a11y-прохід Е8.1. Severity low.
- source_spec: `/home/andrii/patronage_of_military_units/_bmad-output/implementation-artifacts/spec-3-2-direct-donate.md`
  summary: Прибрати мертвий маршрут /redirect-bank-link і компонент BankLinkRedirect (після переходу на пряме посилання викликів немає).
  evidence: Зміна маршрутів поза межами spec-3-2; разом із layout-маршрутом і ProtectedRoutes (D18). Severity low.
