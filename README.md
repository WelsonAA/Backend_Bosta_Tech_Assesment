# 📚 Library Management System

A Node.js + Express + Sequelize application for managing a digital library.

Supports user management, books, borrowings, reports, authentication, and error handling.

***

### 📂 Project Structure

The project is organized into modular layers inside `src/`:
```
src/
├── config/         # Database and environment configuration
├── controllers/    # Handle HTTP requests and responses
├── middlewares/    # Shared middlewares (auth, error handling, etc.)
├── models/         # Sequelize models
├── repositories/   # Database queries
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Helpers and utilities
```

***

### 🔑 Authentication

Authentication is implemented using **Basic Authentication** (`middlewares/basicAuth.js`).

Each protected route checks the user’s role (**admin** or **borrower**) to allow/deny access.
Example: Borrowers can borrow/return books, while Admins can generate reports.

***

### ⚠️ Error Handling

Centralized error handling is done in `middlewares/errorHandler.js`.

All errors are caught, logged, and returned in a structured JSON format:

```json
{
  "error": "ResourceNotFound",
  "message": "Book not found"
}
```
his ensures consistent responses for API consumers.

## 📖 Documentation

- [API Documentation](./assets/API.md)  
  Detailed list of all available endpoints, request/response formats, and example payloads.  

- [Class Diagram](./assets/class_diagram.md)  
  Visual representation of the main classes, their attributes, and relationships.  

- [Sequence Diagram](./assets/sequence_diagram.md)  
  Step-by-step flow of interactions between users, controllers, services, and repositories.
🚀 Running the Project
### Option 1: Using Docker
Make sure you have Docker and Docker Compose installed.

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. The API will be available at:  
   ```
   http://localhost:3000
   ```

3. Stop containers:
   ```bash
   docker-compose down
   ```

---

### Option 2: Without Docker (Local Setup)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/library-management.git
   cd library-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:  
   Create a `.env` file like [.env.example](./.env.example)


4. Start the server:
   ```bash
   npm run dev
   ```

API will be available at:
```
http://localhost:3000
```

---

## ✅ Features

- 👤 User Management (Admin, Borrower)  
- 📚 Book Management (CRUD, search, pagination)  
- 🔄 Borrowing & Returning books  
- 📊 Reports (custom period, overdue, last month)  
- 🔐 Authentication with roles  
- ⚡ Centralized error handling  
