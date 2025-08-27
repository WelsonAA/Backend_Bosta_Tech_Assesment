require("dotenv").config();
const express = require("express");
const { initDB } = require("./src/config/db");
const applyAssociations = require("./src/models/_associations");

// Routers
const bookRoutes = require("./src/routes/book.routes");
const userRoutes = require("./src/routes/user.routes");
const borrowingRoutes = require("./src/routes/borrowing.routes");

const app = express();
app.use(express.json());

// Database init
// Initialize DB first (singleton inside)
(async () => {
  try {
    await initDB({ alter: true });   // ✅ ensures DB exists + singleton connected + synced
    applyAssociations();
    console.log("✅ Associations applied");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1); // stop server if DB not ready
  }
})();

// Routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/borrowings", borrowingRoutes);

module.exports = app;
