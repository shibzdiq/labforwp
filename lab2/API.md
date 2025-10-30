# Lab1 API Documentation

This document describes the REST API for the Lab1 project. The API provides endpoints for managing users, cards, collections, and transactions in a trading card system.

## Main Entities

1. **Users** - System users who can own cards and participate in transactions
2. **Cards** - Trading cards that can be owned and traded
3. **Collections** - Groups of cards organized by users
4. **Transactions** - Records of card trades between users

Base URL

- Local development: `http://localhost:3000`

Authentication

- No authentication implemented in this lab. All endpoints are public.

Headers

- All JSON requests must include `Content-Type: application/json`.

-----------------------------

## Endpoints

### 1) Create User

- Method: POST
- URL: `/users`
- Required fields (JSON body):
  - `email` (string)
  - `username` (string)
  - `password` (string)

Example request body:

```json
{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "supersecret"
}
```

Success response (201):

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-10-22T12:00:00.000Z"
}
```

Possible errors:
- 400 Bad Request: missing required fields
  - `{ "error": "Missing required fields" }`
- 409 Conflict: duplicate username or email
  - `{ "error": "Unique constraint failed on: username" }`
- 500 Internal Server Error: database or other server error

-----------------------------

### 2) Get All Users

- Method: GET
- URL: `/users`

Success response (200):

```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-10-22T12:00:00.000Z"
  }
]
```

-----------------------------

### 3) Get User by ID

- Method: GET
- URL: `/users/:id`

Success response (200): single user object (same shape as above)

Errors:
- 404 Not Found: `{ "error": "User not found" }`

-----------------------------

### 4) Update User

- Method: PUT
- URL: `/users/:id`
- Body: any subset of user-updatable fields. If `password` is provided it will be hashed.

Example body:
```json
{
  "username": "newname"
}
```

Success: returns updated user object

Errors:
- 400 Bad Request: invalid input
- 409 Conflict: duplicate username/email

-----------------------------

### 5) Delete User

- Method: DELETE
- URL: `/users/:id`

Success: `{ "message": "User deleted successfully" }`

-----------------------------

### 6) Create Card

- Method: POST
- URL: `/cards`
- Required fields (controller-level): `name` (string), `rarity` (string)
- Prisma model requires `ownerId` (int) — provide ownerId when creating.

Request example:
```json
{
  "name": "Blue Dragon",
  "rarity": "legendary",
  "ownerId": 1,
  "description": "Rare dragon card",
  "imageUrl": "https://example.com/blue-dragon.png"
}
```

Success (201): created card object

Errors:
- 400 Invalid data (controller validation)
- 500 Prisma errors (ownerId missing or invalid)

-----------------------------

### 7) Get All Cards

- Method: GET
- URL: `/cards`

### 8) Get Card by ID

- Method: GET
- URL: `/cards/:id`

### 9) Update Card

- Method: PUT
- URL: `/cards/:id`

### 10) Delete Card

- Method: DELETE
- URL: `/cards/:id`

-----------------------------

### 11) Collections

#### Create Collection

- Method: POST
- URL: `/collections`
- Required fields (JSON body):
  - `name` (string)
  - `userId` (number)
  - Optional fields:
    - `description` (string)
    - `isPublic` (boolean, default: true)

Example request:
```json
{
  "name": "Rare Dragons",
  "description": "My collection of rare dragon cards",
  "userId": 1,
  "isPublic": true
}
```

Success response (201):
```json
{
  "id": 1,
  "name": "Rare Dragons",
  "description": "My collection of rare dragon cards",
  "isPublic": true,
  "userId": 1,
  "createdAt": "2025-10-22T12:00:00.000Z",
  "user": {
    "id": 1,
    "username": "johndoe"
  },
  "cards": []
}
```

#### Get All Collections

- Method: GET
- URL: `/collections`

Returns array of collections with their cards and owners.

#### Get Collection by ID

- Method: GET
- URL: `/collections/:id`

Returns single collection with its cards and owner.

#### Update Collection

- Method: PUT
- URL: `/collections/:id`
- Updatable fields: `name`, `description`, `isPublic`

Example request:
```json
{
  "name": "Updated Collection Name",
  "isPublic": false
}
```

#### Delete Collection

- Method: DELETE
- URL: `/collections/:id`

#### Add Card to Collection

- Method: POST
- URL: `/collections/:id/cards`
- Required fields:
  - `cardId` (number)

Example request:
```json
{
  "cardId": 1
}
```

#### Remove Card from Collection

- Method: DELETE
- URL: `/collections/:id/cards`
- Required fields:
  - `cardId` (number)

Example request:
```json
{
  "cardId": 1
}
```

Errors for all collection endpoints:
- 400 Bad Request: missing required fields or invalid data
- 404 Not Found: collection or card not found
- 403 Forbidden: attempting to modify private collection
- 500 Internal Server Error

-----------------------------

### 12) Create Transaction

- Method: POST
- URL: `/transactions`
- Required fields (JSON body):
  - `buyerId` (number)
  - `sellerId` (number)
  - `cardId` (number)
  - `price` (number)

Example request:
```json
{
  "buyerId": 2,
  "sellerId": 1,
  "cardId": 10,
  "price": 99.99
}
```

Validation notes:
- Controller validates existence and numeric types for these fields.
- Model checks that buyer/seller/card actually exist and returns 400 if not.

Errors:
- 400 Bad Request: missing or invalid fields, or missing related entities (e.g. `{ "error": "Buyer not found" }`)
- 500 Internal Server Error

-----------------------------

## Run & Test

1. Install dependencies:

```powershell
cd "C:\лабки з коледжу\Web-programming\lab1"
npm install
```

2. Start server:

```powershell
npm run dev
```

3. Test using Postman or PowerShell Invoke-RestMethod (see earlier examples in this doc).

