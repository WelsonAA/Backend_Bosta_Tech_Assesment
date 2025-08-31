# 📌 API Documentation

This document provides details of the available REST API endpoints for the **Library Borrowing System** project.

---

## 🌍 Base URL
```http://localhost:3000```

---

## 🔑 Authentication

Some routes require authentication.  
- Authentication is done via **Basic Auth** (username = email, password = user password).  
- Borrowers can register and log in.  
- Admin functionality can be extended.

---
## 👤 User Endpoints

### Register a User
**POST** `/users/register`

**Request**
```json
{
  "email": "test@example.com",
  "password": "secret123",
  "name": "George Welson"
}
```
**Response**
```json
{
  "public_id": "uuid",
  "email": "test@example.com",
  "role": "borrower"
}
```

### Get All Users (Admin)
**GET** `/users?page=1&limit=10`
**Headers** `Authorization: Basic <base64(email:password)>`

**Response**
```json
{
  "pagination": { "total": 100, "page": 1, "perPage": 10, "totalPages": 10 },
  "users": [
    { "public_id": "uuid", "name": "George Welson", "email": "test@example.com" }
  ]
}
```

### Get One User
**GET** `/users/:public_id`

**Response**
```json
{
  "public_id": "uuid",
  "name": "George Welson",
  "email": "test@example.com",
  "role": "borrower"
}
```

### Update a User
**PUT** `/users/:public_id`
**Request**
```json
{
  "name": "George W.",
  "email": "george@example.com"
}
```
**Response**
```json
{
  "message": "User updated successfully"
}
```

### Promote a User (Admin)
**PUT** `/users/:public_id/promote`
**Headers** `Authorization: Basic <base64(email:password)>`
**Response**
```json
{
  "message": "User promoted to admin successfully"
}
```

### Delete a User (Admin)
**PUT** `/users/:public_id`
**Headers** `Authorization: Basic <base64(email:password)>`
**Response**
```json
{
  "message": "User deleted successfully"
}
```

## 📚 Book Endpoints

---

### Create a Book (Admin)
**POST** `/books`
**Headers:** `Authorization: Basic <base64(email:password)>`

**Request**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "available_quantity": 10
}
```

**Response**
```json
{
  "public_id": "uuid",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "available_quantity": 10
}
```

### Get All Books
**GET** `books?page=1&limit=10`

**Response**
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 10,
    "totalPages": 10
  },
  "books": [
    {
      "public_id": "uuid",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565",
      "available_quantity": 10
    }
  ]
}
```

### Search Books
**GET** `books/search?query=Gatsby`

**Response**
```json
{
  "count": 2,
  "page": 1,
  "limit": 10,
  "rows": [
    {
      "public_id": "uuid1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565",
      "available_quantity": 10
    },
    {
      "public_id": "uuid2",
      "title": "Gatsby Returns",
      "author": "Some Author",
      "isbn": "1234567890",
      "available_quantity": 5
    }
  ]
}
```

### Get One Book
**GET** `/books/:public_id`

**Response**
```json
{
  "public_id": "uuid",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "available_quantity": 10
}
```

### Update a Book (Admin)
**PUT** `/books/:public_id`
**Headers:** `Authorization: Basic <base64(email:password)>`

**Request**
```json
{
  "title": "The Great Gatsby (Updated Edition)",
  "available_quantity": 15
}
```

**Response**
```json
{
  "message": "Book updated successfully"
}
```

### Delete a Book (Admin)
**DELETE** `/books/:public_id`
**Headers:** `Authorization: Basic <base64(email:password)>`
**Response**
```json
{
  "message": "Book deleted successfully"
}
```

## 📚 Borrowings Endpoints

---

### 🔒 Authentication & Roles

* **Borrower**: Can borrow, return, and view their borrowings.
* **Admin**: Can list all borrowings, view overdue borrowings, and generate reports.

---

### Borrow a Book
**POST** `/borrowings/borrow`
**Headers:** `Authorization: Basic <base64(email:password)>`

**Request**
```json
{
  "borrower_public_id": "uuid-of-borrower",
  "book_public_id": "uuid-of-book"
}
```
**Response**
```json
{
  "public_id": "uuid-of-borrowing",
  "borrower": {
    "public_id": "uuid-of-borrower",
    "username": "John Doe"
  },
  "book": {
    "public_id": "uuid-of-book",
    "title": "The Great Gatsby"
  },
  "borrow_date": "2025-08-01T12:00:00.000Z",
  "due_date": "2025-08-15T12:00:00.000Z",
  "status": "borrowed"
}
```

### Return a Book
**POST** `/borrowings/return`
**Headers:** `Authorization: Basic <base64(email:password)>`

**Request**
```json
{
  "borrowing_public_id": "uuid-of-borrowing"
}
```
**Response**
```json
{
  "message": "Book returned successfully",
  "borrowing": {
    "public_id": "uuid-of-borrowing",
    "status": "returned",
    "return_date": "2025-08-10T12:00:00.000Z"
  },
  "book": {
    "public_id": "uuid-of-book",
    "title": "The Great Gatsby",
    "available_quantity": 10
  }
}
```

### Return a Book
**GET** `/borrowings`
**Headers:** `Authorization: Basic <base64(email:password)>`

**Response**
```json
{
  "borrowings": [
    {
      "public_id": "uuid-of-borrowing",
      "borrow_date": "2025-08-01T12:00:00.000Z",
      "due_date": "2025-08-15T12:00:00.000Z",
      "status": "borrowed",
      "borrower": {
        "public_id": "uuid-of-borrower",
        "name": "Alice"
      },
      "book": {
        "public_id": "uuid-of-book",
        "title": "1984"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "perPage": 10,
    "totalPages": 1
  }
}
```

### List Overdue Borrowings
**GET** `/borrowings/overdue`
**Headers:** `Authorization: Basic <base64(email:password)>`

**Response**
```json
{
  "borrowings": [
    {
      "public_id": "uuid-of-borrowing",
      "due_date": "2025-07-01T12:00:00.000Z",
      "status": "borrowed",
      "borrower": {
        "public_id": "uuid-of-borrower",
        "name": "Bob"
      },
      "book": {
        "public_id": "uuid-of-book",
        "title": "Moby Dick"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "perPage": 10,
    "totalPages": 1
  }
}
```

### My Borrowings
**GET** `/borrowings/my`
**Headers** `Authorization: Basic <base64(email:password)>`
**Role** Borrower

**Response**
```json
{
  "borrowings": [
    {
      "public_id": "uuid-of-borrowing",
      "borrow_date": "2025-08-01T12:00:00.000Z",
      "due_date": "2025-08-15T12:00:00.000Z",
      "status": "returned",
      "book": {
        "public_id": "uuid-of-book",
        "title": "The Hobbit"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "perPage": 10,
    "totalPages": 1
  }
}
```

### Reports (Custom Period)
**GET** `/borrowings/reports?from=2025-08-01&to=2025-08-31&format=json|csv|xlsx`
**Headers** `Authorization: Basic <base64(email:password)>`
**Role** Admin
- format=json → JSON (default)

- format=csv → CSV download

- format=xlsx → Excel download
**Response**
```json
[
  {
    "borrowing_id": "uuid-of-borrowing",
    "borrower": "Alice",
    "book": "The Hobbit",
    "borrow_date": "2025-08-01T12:00:00.000Z",
    "due_date": "2025-08-15T12:00:00.000Z",
    "return_date": null,
    "status": "borrowed"
  }
]
```

### Last Month Overdue Report
**GET** `/borrowings/reports/overdue-last-month`
**Headers** `Authorization: Basic <base64(email:password)>`
**Role** Admin

**Response**
```json
{
  "count": 2,
  "results": [
    {
      "public_id": "uuid-of-borrowing",
      "borrower": {
        "public_id": "uuid-of-borrower",
        "name": "Alice"
      },
      "book": {
        "public_id": "uuid-of-book",
        "title": "1984"
      },
      "due_date": "2025-07-15T12:00:00.000Z",
      "status": "borrowed"
    }
  ]
}
```

### Last Month Report (All Borrowings)
**GET** `/borrowings/reports/last-month`
**Headers** `Authorization: Basic <base64(email:password)>`
**Role** Admin

**Response**
```json
{
  "count": 3,
  "results": [
    {
      "public_id": "uuid-of-borrowing",
      "borrower": {
        "public_id": "uuid-of-borrower",
        "name": "Bob"
      },
      "book": {
        "public_id": "uuid-of-book",
        "title": "Moby Dick"
      },
      "borrow_date": "2025-07-05T12:00:00.000Z",
      "status": "returned"
    }
  ]
}
```