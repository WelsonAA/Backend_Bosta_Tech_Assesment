classDiagram
    class User {
      +UUID public_id
      +String name
      +String email
      +String password_hash
      +Date createdAt
      +Date updatedAt
    }

    class Book {
      +UUID public_id
      +String title
      +String author
      +String isbn
      +String shelf_id
      +Boolean available
      +Date createdAt
      +Date updatedAt
    }

    class Borrowing {
      +UUID public_id
      +UUID user_id
      +UUID book_id
      +Date borrowedAt
      +Date returnedAt
      +Date createdAt
      +Date updatedAt
    }

    User "1" --> "*" Borrowing : makes
    Book "1" --> "*" Borrowing : is borrowed in
