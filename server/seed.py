"""Наповнює базу демонстраційними даними для локальної розробки.

Запуск (з каталогу server):
    docker compose exec backend python seed.py

Повторний запуск нічого не дублює: якщо демо-дані вже є, скрипт завершується.
"""
from sql_app import models
from sql_app.database import SessionLocal, engine

DEMO_DOMAIN = "@demo.local"

USERS = [
    {"name": "Олена Коваль", "email": "olena" + DEMO_DOMAIN},
    {"name": "Тарас Мельник", "email": "taras" + DEMO_DOMAIN},
    {"name": "Ірина Шевчук", "email": "iryna" + DEMO_DOMAIN},
]

# Вигадані підрозділи та збори; посилання на джерела — заглушки.
ORGANIZATIONS = [
    {
        "owner": 0,
        "name": "Добровольчий батальйон «Сокіл»",
        "description": "Підрозділ, що тримає оборону на сході. Потребує регулярної підтримки транспортом, пальним і зв'язком.",
        "fundraisings": [
            {
                "title": "Пікап для евакуації поранених",
                "description": "Збираємо на надійний пікап 4x4 для евакуації з передових позицій.",
                "sources": [
                    ("Банка Monobank", "monobank", "https://send.monobank.ua/jar/DEMO_SOKIL_1"),
                    ("PayPal", "paypal", "https://paypal.me/demo-sokil"),
                ],
            },
            {
                "title": "Пальне на місяць",
                "description": "Щомісячний збір на пальне для генераторів і техніки.",
                "sources": [
                    ("Банка Monobank", "monobank", "https://send.monobank.ua/jar/DEMO_SOKIL_2"),
                ],
            },
        ],
    },
    {
        "owner": 1,
        "name": "Розвідувальний взвод «Тінь»",
        "description": "Аеророзвідка та коригування вогню. Основні потреби — дрони, акумулятори, запчастини.",
        "fundraisings": [
            {
                "title": "5 FPV-дронів",
                "description": "Дрони з комплектами акумуляторів для роботи вночі.",
                "sources": [
                    ("Банка Monobank", "monobank", "https://send.monobank.ua/jar/DEMO_TIN_1"),
                    ("Картка ПриватБанку", "card", "https://privatbank.ua/demo-tin"),
                ],
            },
            {
                "title": "Тепловізійний приціл",
                "description": "Тепловізор для нічних спостережень.",
                "sources": [
                    ("Банка Monobank", "monobank", "https://send.monobank.ua/jar/DEMO_TIN_2"),
                ],
            },
            {
                "title": "Старлінк і павербанки",
                "description": "Стабільний зв'язок на позиціях та автономне живлення.",
                "sources": [
                    ("PayPal", "paypal", "https://paypal.me/demo-tin"),
                ],
            },
        ],
    },
    {
        "owner": 2,
        "name": "Медична рота «Янголи»",
        "description": "Тактичні медики, які стабілізують поранених на передовій.",
        "fundraisings": [
            {
                "title": "Аптечки IFAK — 50 шт.",
                "description": "Індивідуальні аптечки з турнікетами та гемостатиками.",
                "sources": [
                    ("Банка Monobank", "monobank", "https://send.monobank.ua/jar/DEMO_ANGELS_1"),
                ],
            },
            {
                "title": "Ноші та евакуаційні волокуші",
                "description": "Розхідні засоби для евакуації поранених.",
                "sources": [
                    ("Банка Monobank", "monobank", "https://send.monobank.ua/jar/DEMO_ANGELS_2"),
                    ("Картка ПриватБанку", "card", "https://privatbank.ua/demo-angels"),
                ],
            },
        ],
    },
]


def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.Users).filter(models.Users.email.like("%" + DEMO_DOMAIN)).first():
            print("Демо-дані вже є, нічого не змінено.")
            return

        users = [models.Users(name=u["name"], email=u["email"], is_creator=True) for u in USERS]
        db.add_all(users)
        db.flush()

        fundraisings = []
        for org_data in ORGANIZATIONS:
            owner = users[org_data["owner"]]
            org = models.Organizations(
                name=org_data["name"], description=org_data["description"], creator_id=owner.id
            )
            db.add(org)
            db.flush()
            for f_data in org_data["fundraisings"]:
                fundraising = models.Fundraisings(
                    title=f_data["title"],
                    description=f_data["description"],
                    creator_id=owner.id,
                    organization_id=org.id,
                )
                db.add(fundraising)
                db.flush()
                for title, type_, url in f_data["sources"]:
                    db.add(models.Sources(
                        title=title, type=type_, url=url,
                        creator_id=owner.id, fundraising_id=fundraising.id,
                    ))
                fundraisings.append(fundraising)

        # Демо-користувачі підписуються на чужі збори.
        for i, user in enumerate(users):
            for fundraising in fundraisings[i::3]:
                if fundraising.creator_id != user.id:
                    db.add(models.Subscriptions(user_id=user.id, fundraising_id=fundraising.id))

        db.commit()
        print(f"Додано: {len(users)} користувачів, {len(ORGANIZATIONS)} організації, {len(fundraisings)} зборів.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
