require("dotenv").config();
const express = require("express");

const { initDB } = require("./src/config/db");
const applyAssociations = require("./src/models/_associations");

// Routers
const bookRoutes = require("./src/routes/book.routes");
const userRoutes = require("./src/routes/user.routes");
const borrowingRoutes = require("./src/routes/borrowing.routes");
const User = require("./src/models/user.model");
//const basicAuth = require("./src/middlewares/basicAuth");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10
const app = express();
const errorHandler = require("./src/middlewares/errorHandler");
app.use(express.json());

// Database init
// Initialize DB first (singleton inside)
(async () => {
  try {
    await initDB({ alter: true });   // ✅ ensures DB exists + singleton connected + synced
    applyAssociations();
    console.log("✅ Associations applied");
    // 3️⃣ Insert admin if not exists
    const adminEmail = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const hashed = await bcrypt.hash(adminPass, SALT_ROUNDS);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      });
      console.log(`✅ Admin user "${adminEmail}" created`);
    }
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1); // stop server if DB not ready
  }
})();

// Routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/borrowings", borrowingRoutes);
app.use(errorHandler)
module.exports = app;
