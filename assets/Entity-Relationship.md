erDiagram
    USERS {
        UUID public_id PK
        string name
        string email UK
        string password_hash
        datetime createdAt
        datetime updatedAt
    }

    BOOKS {
        UUID public_id PK
        string title
        string author
        string isbn UK
        string shelf_id
        boolean available
        datetime createdAt
        datetime updatedAt
    }

    BORROWINGS {
        UUID public_id PK
        UUID user_id FK
        UUID book_id FK
        datetime borrowedAt
        datetime returnedAt
        datetime createdAt
        datetime updatedAt
    }

    USERS ||--o{ BORROWINGS : borrows
    BOOKS ||--o{ BORROWINGS : borrowed_in
