---
name: Громадське патронування
description: Візуальна система платформи регулярної підтримки військових підрозділів. Bootstrap 5, темізований SCSS-змінними; документ описує бренд-шар поверх Bootstrap.
status: draft
updated: 2026-10-07
sources:
  - patronage-client/src/assets/logo.png
  - 00-party-roundtable.md
colors:
  # Узято з логотипу (щит + жовта й синя руки, темно-синій контур).
  ink: '#0B1E3A'            # контур логотипу; основний текст, футер
  ink-muted: '#4A5B70'      # вторинний текст
  primary: '#0A6E9C'        # лазурова рука; основні дії, посилання
  primary-hover: '#085A80'
  sky: '#1FA6D4'            # світла частина щита; тільки декор, не фон для білого тексту
  sky-soft: '#E3F2F9'       # тло бейджів, hero-кола
  teal: '#2EC4B6'           # бірюзовий відблиск на руці; підсвітка, успіх
  gold: '#F5D04C'           # жовта рука; дія «Задонатити», акценти на navy
  gold-hover: '#EBC12F'
  gold-soft: '#FFF6D6'
  surface: '#FFFFFF'
  background: '#F3F7FA'     # тло сторінки (блідий щит)
  border: '#D9E4EC'
  danger: '#B42335'
  success: '#1E8E6E'
typography:
  display:
    fontFamily: 'Unbounded'
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: 'Unbounded'
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.15'
  h2:
    fontFamily: 'Unbounded'
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  h3:
    fontFamily: 'Manrope'
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
  body:
    fontFamily: 'Manrope'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-lg:
    fontFamily: 'Manrope'
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label:
    fontFamily: 'Manrope'
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
  caption:
    fontFamily: 'Manrope'
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  xl: 28px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 64px
  '9': 96px
  gutter: 24px
  margin-mobile: 16px
  container-max: 1200px
components:
  button-donate:
    background: '{colors.gold}'
    foreground: '{colors.ink}'
    hover: '{colors.gold-hover}'
    radius: '{rounded.full}'
    weight: '700'
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.surface}'
    hover: '{colors.primary-hover}'
    radius: '{rounded.full}'
  button-outline:
    background: 'transparent'
    foreground: '{colors.ink}'
    border: '2px solid {colors.ink}'
    radius: '{rounded.full}'
  button-danger-ghost:
    background: 'transparent'
    foreground: '{colors.danger}'
    radius: '{rounded.full}'
  card:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.lg}'
    shadow: '0 1px 2px rgba(11,30,58,.06), 0 4px 16px rgba(11,30,58,.06)'
    shadow-hover: '0 8px 28px rgba(11,30,58,.14)'
  card-cover:
    height: 168px
    radius: '{rounded.lg} {rounded.lg} 0 0'
  badge-org:
    background: '{colors.sky-soft}'
    foreground: '{colors.primary}'
    radius: '{rounded.full}'
  header:
    background: 'rgba(255,255,255,.9)'
    border-bottom: '1px solid {colors.border}'
    height: 72px
  footer:
    background: '{colors.ink}'
    foreground: '#C9D6E3'
  input:
    border: '1.5px solid {colors.border}'
    radius: '{rounded.md}'
    focus-ring: '0 0 0 4px rgba(10,110,156,.18)'
  toast-error:
    background: '{colors.surface}'
    accent: '{colors.danger}'
    radius: '{rounded.md}'
---

## Brand & Style

Логотип — це два вчинки: **руки тримають щит**. Жовта й синя долоні, товстий темно-синій контур, пласкі заливки, пагінці над щитом. Він говорить про турботу й захист, а не про бойові дії. Візуальна система повторює цю позицію: тепла, впевнена, чесна; без мілітарі-кітчу, без камуфляжу, без зброї в декорі.

Три властивості логотипу стають правилами системи:
1. **Контур** — темно-синій `{colors.ink}` замість чорного для всього тексту, рамок і футера.
2. **Пласкість** — заливки без градієнтів усередині компонентів; градієнт дозволено лише на обкладинках карток і в hero, і тільки між кольорами палітри.
3. **Округлість** — щит має м'які кути, коло обіймає композицію → великі радіуси `{rounded.lg}`, кнопки-«таблетки» `{rounded.full}`.

Логотип **не змінюється**: ні кольорів, ні пропорцій, ні обведень. Він завжди на білому, `{colors.background}` або на `{colors.sky-soft}` колі; на navy-тлі — тільки в білому крузі.

## Colors

- **`ink` #0B1E3A** — контур логотипу. Основний текст, заголовки, футер, контурні кнопки. Контраст на білому 16.6:1.
- **`primary` #0A6E9C** — затемнена «синя рука». Основні дії (Підписатись, Зберегти, Увійти), посилання, фокус. Білий текст на ньому 5.6:1 (AA).
- **`gold` #F5D04C** — «жовта рука». **Лише** для дії «Задонатити» і для акцентів на navy-тлі. Текст на жовтому — тільки `{colors.ink}` (11.1:1). Жовтий текст на білому заборонено.
- **`sky` #1FA6D4** — світла частина щита. Декоративні елементи, градієнти обкладинок. Білий текст на ньому заборонено (2.8:1).
- **`teal` #2EC4B6** — бірюзовий відблиск на синій руці. Активний пункт навігації (підкреслення), індикатори, стан «Ви підписані».
- **`sky-soft` / `gold-soft`** — тла бейджів, кола під логотипом у hero, підсвітка рядків.
- **`background` #F3F7FA** — тло сторінки; картки `{colors.surface}` на ньому «піднімаються» без важких тіней.
- **`danger` / `success`** — тільки для статусів і руйнівних дій.

## Typography

- **Unbounded** (700/600) — display, H1, H2. Широкий, округлий, жирний — рима до товстого контуру логотипу. Тільки заголовки й великі числа; ніколи для абзаців.
- **Manrope** (400/500/600/700) — увесь інший текст, кнопки, форми.
- Обидва з повною кирилицею, підключаються з Google Fonts одним `@import`.
- **Cormorant Garamond прибирається** разом із `!important` у `index.scss`.
- Мобільна шкала: display 32px, h1 28px, h2 22px; body лишається 16px.

## Layout & Spacing

- Контейнер `{spacing.container-max}`, поля `{spacing.gutter}` (мобільний — `{spacing.margin-mobile}`).
- Сітка карток: 1 колонка < 576px, 2 колонки 576–991px, 3 колонки ≥ 992px; проміжок `{spacing.5}`.
- Вертикальний ритм секцій: `{spacing.8}` на десктопі, `{spacing.7}` на мобільному.
- Сторінки деталей: дві колонки 7/5 на ≥ 992px; панель дій праворуч липка (`top: 96px`).

## Elevation & Depth

Два рівні:
- **Рівень 1 (спокій):** `{components.card.shadow}` — ледь помітна navy-тінь.
- **Рівень 2 (наведення, модалки, тост, липка панель):** `{components.card.shadow-hover}`.
Тіні завжди з відтінком `ink`, не чорні. Наведення на картку: тінь рівня 2 + підйом `translateY(-2px)`; без `scale`.

## Shapes

- Картки, модалки, hero-блок: `{rounded.lg}`.
- Поля форм, тост, dropdown: `{rounded.md}`.
- Кнопки, бейджі, пагінація: `{rounded.full}`.
- Обкладинки карток: верхні кути `{rounded.lg}`, нижні — прямі.

## Components

- **Header** — білий напівпрозорий, `backdrop-filter: blur`, липкий. Логотип 40px + «Громадське патронування» (Manrope 700). Пункти меню — Manrope 600, активний підкреслено 3px `{colors.teal}`. Праворуч: «Увійти» (`button-primary`) або аватар-ініціали з меню «Профіль».
- **Footer** — `{colors.ink}`, логотип у білому крузі, навігація, рядок авторства.
- **Hero** — `{colors.background}`, ліворуч заголовок `display`, підзаголовок `body-lg`, кнопки `button-donate` + `button-outline`; праворуч логотип 320px у колі `{colors.sky-soft}` з декоративними кільцями `{colors.sky}`/`{colors.gold}` під 20% непрозорості.
- **FundraisingCard** — обкладинка 168px (градієнт із палітри, детермінований від `id`, + біла іконка-гліф збору), бейдж організації `badge-org`, заголовок `h3`, опис у 2 рядки, нижній рядок: кількість джерел оплати + стрілка.
- **OrgCard** — обкладинка з ініціалами організації (Unbounded, 48px, білий) на градієнті; назва, опис у 3 рядки.
- **Кабінетна картка** — та сама FundraisingCard/OrgCard + рядок дій під тілом: `button-outline` (Редагувати / Переглянути), `button-donate` (Задонатити), `button-danger-ghost` (Видалити / Відписатись).
- **Панель дій збору** — картка рівня 2: велика `button-donate` на всю ширину, `button-primary` «Підписатись», нижче пояснення підписки й список джерел (іконка типу + назва).
- **Pagination** — кружки 40px, активний `{colors.primary}`; ховається, якщо сторінка одна.
- **EmptyState** — логотип 96px у сірому (opacity .35), заголовок, одне речення, кнопка.
- **Toast (ErrorAlert)** — правий нижній кут, біла картка з лівою смугою `{colors.danger}`, хрестик.
- **Модалка-нагадування** — шапка `{colors.ink}` з логотипом, кнопки «Закрити» (outline) і «Перейти до підписок» (donate).
- **Форми** — label над полем (`label`), поле `input`; джерела оплати — окремі картки-фієлдсети з номером.

## Do's and Don'ts

- ✅ Логотип — без змін, лише масштаб.
- ✅ `gold` — тільки для донату та акцентів на navy.
- ✅ Кожна інтерактивна дія має видимий фокус `{components.input.focus-ring}`.
- ❌ Жодних зображень зброї в декоративних елементах інтерфейсу.
- ❌ Жовтий або `sky` текст на білому.
- ❌ Чорний `#000` — замість нього `{colors.ink}`.
- ❌ Третій шрифт.
- ❌ `!important` у темі (окрім уже наявних утиліт Bootstrap).
