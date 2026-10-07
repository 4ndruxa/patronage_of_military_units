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
