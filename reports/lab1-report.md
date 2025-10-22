# Звіт з лабораторної роботи 1

## Тема роботи: Розроблення backend архітектури та основного функціоналу

Здобувач освіти: shibzdiq
Група: [Номер групи]
GitHub репозиторій: https://github.com/shibzdiq/labforwp

## Виконання роботи

### Налаштування проєкту
- Створено Git репозиторій з назвою labforwp
- Ініціалізовано Node.js проєкт з використанням ES modules
- Встановлено необхідні залежності:
  - express для створення REST API
  - prisma як ORM для роботи з базою даних
  - dotenv для управління змінними середовища
  - bcryptjs для хешування паролів
- Налаштовано структуру файлів за MVC патерном

### База даних
- Налаштовано PostgreSQL та підключено через змінну DATABASE_URL
- Створено Prisma схему з трьома основними моделями:
  - User (користувачі системи)
  - Card (картки для торгівлі)
  - Transaction (транзакції між користувачами)
- Виконано початкову міграцію (20251022135613_init)
- Реалізовано зв'язки між таблицями:
  - User -> Card (one-to-many)
  - User -> Transaction (one-to-many, як buyer та seller)
  - Card -> Transaction (one-to-many)

### Backend архітектура
- Створено Express.js сервер з обробкою помилок
- Реалізовано MVC архітектуру:
  - Models: userModel.js, cardModel.js, transactionModel.js
  - Controllers: userController.js, cardController.js, transactionController.js
  - Routes: userRoutes.js, cardRoutes.js, transactionRoutes.js
- Впроваджено middleware для:
  - Парсингу JSON
  - Очистки URL від небажаних символів
  - Обробки помилок Prisma (унікальні обмеження, зовнішні ключі)

### API endpoints
1. Користувачі (/users):
   - POST / - реєстрація нового користувача
   - POST /login - автентифікація користувача
   - GET / - отримання списку користувачів
   - GET /:id - отримання даних конкретного користувача
   - PUT /:id - оновлення даних користувача
   - DELETE /:id - видалення користувача

2. Картки (/cards):
   - POST / - створення нової картки
   - GET / - отримання списку карток
   - GET /:id - отримання даних конкретної картки
   - PUT /:id - оновлення даних картки
   - DELETE /:id - видалення картки

3. Транзакції (/transactions):
   - POST / - створення нової транзакції
   - GET / - отримання списку транзакцій
   - GET /:id - отримання деталей конкретної транзакції

## Структура проєкту

```
lab1/
├── src/
│   ├── controllers/
│   │   ├── cardController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── cardModel.js
│   │   ├── transactionModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── cardRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20251022135613_init/
│           └── migration.sql
├── API.md
├── package.json
└── README.md
```

## Скріншоти тестування
Для тестування API рекомендується використовувати Postman або інший REST клієнт з такими endpoint'ами:

1. Створення користувача:
```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

2. Створення картки:
```http
POST http://localhost:3000/cards
Content-Type: application/json

{
  "name": "femboy",
  "description": "Rare femboy card",
  "rarity": "legendary",
  "ownerId": 1
}
```

3. Створення транзакції:
```http
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "buyerId": 2,
  "sellerId": 1,
  "cardId": 1,
  "price": 100.00
}
```

## Висновки

Самооцінка: 5 

незважаючи на те що я там запізнився, і можу отримати максимум 4, робота була зроблена неперевершено і прекрасно, все зроблено з дотриманням всіх вимог + від себе додав хешування паролів і перевірку в деяких місяцї на унікальність поля, + структура проекту чітка за мвс патерном, ну і апі документація тоже круто, хоча я не впевнений чи я як тиреба зробив. 

