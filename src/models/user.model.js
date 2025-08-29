const { DataTypes } = require("sequelize");
const { getDB } = require("../config/db");

const sequelize = getDB();

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }, // hashed
  role: { type: DataTypes.ENUM("admin", "borrower"), defaultValue: "borrower" },
}, {
  timestamps: true, // enables createdAt + updatedAt
  updatedAt: true,  // keep updatedAt
  createdAt: true,  // registration date stored here
});

module.exports = User;
