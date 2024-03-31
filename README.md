## A web platform for public patronage of military units.
Веб-платформа для громадського патронування військових підрозділів. 
Власники збору зможуть сформувати запити - списки зборів.
Cписок зборів, де користувач (патронат) зможе обрати той, який йому важливий для того, щоб "підписатись", після чого користувачу (патронату) приходитиме регулярне сповіщення про необхідність задонанити.

В чому користь такої платформи: 
  1. В одному місці можна побачити підрозділи, де є першочергова необхідність в підтримці;
  2. Завдяки платформі можна буде вести безперебійну підтримку, оскільки окрім масштабних покупок, військові потребують також і розхідні матеріали, такі як пальне, запчастини для транспорту, медикаменти, тощо. Для таких витрат важливо отримувати регулярну фінансову підтримку.

Виконав:
ФІОТ 123 КІ
студент групи ІО-23
Боднар Андрій

### Структура проєкту (Back-end):
```
fastapi-project
├── alembic/
├── src
│   ├── posts
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── dependencies.py
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   ├── service.py
│   │   └── utils.py
│   ├── config.py  
│   ├── models.py  
│   ├── exceptions.py  
│   ├── pagination.py  
│   ├── database.py  
│   └── main.py
├── tests/
│   └── posts
├── templates/
│   └── index.html
├── requirements
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── .env
├── .gitignore
├── logging.ini
└── alembic.ini
```
### Структура проєкту (Front-end):
```
src
|
├── assets
|
├── components
|
├── config
|
├── views   
|
├── services
|
├── hooks
|
├── providers
|
├── routes
|
├── stores
|
├── test
|
├── types
|
└── utils
```
### Залежності:
1. Залежності вищого рівня:
  1. React.
  2. Bootstrap.
  3. FastAPI.
  4. PostgreSQL.
2. Залежності нижнього рівня (tbd):

### Розгортання (tbd):
1. Google Cloud
2. Oracle
