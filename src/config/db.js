// src/config/db.js
const { Sequelize } = require("sequelize");

let sequelizeInstance = null;

/**
 * Ensures the database exists.
 * Connects to the default 'postgres' DB, creates target DB if missing.
 */
async function ensureDatabaseExists() {
  const tempSequelize = new Sequelize("postgres", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  });

  try {
    await tempSequelize.authenticate();
    console.log("✅ Connected to default 'postgres' database");

    // Check & create target DB
    const dbName = process.env.DB_NAME;
    await tempSequelize.query(`CREATE DATABASE "${dbName}" WITH ENCODING 'UTF8' TEMPLATE template1;`)
      .catch((err) => {
        if (err.original && err.original.code === "42P04") {
          // 42P04 = database already exists
          console.log(`ℹ️ Database "${dbName}" already exists`);
        } else {
          throw err;
        }
      });
    console.log(`✅ Database "${dbName}" is ready`);
  } finally {
    await tempSequelize.close();
  }
}

/**
 * Returns the database instance (Singleton).
 */
function getDB() {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
      }
    );
    console.log("✅ DB connection (Sequelize) created");
  }
  return sequelizeInstance;
}

/**
 * Initializes the database:
 * - ensures DB exists
 * - tests the connection
 * - syncs all models
 */
async function initDB({ force = false, alter = false } = {}) {
  await ensureDatabaseExists();

  const sequelize = getDB();
  try {
    await sequelize.authenticate();
    console.log("✅ DB authenticated successfully");

    await sequelize.sync({ force, alter });
    console.log("✅ DB synced successfully");

    
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

module.exports = { getDB, initDB };
