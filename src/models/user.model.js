const { DataTypes } = require("sequelize");
const { getDB } = require("../config/db");

const sequelize = getDB();

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }, // hashed
  role: { type: DataTypes.ENUM("admin", "borrower"), defaultValue: "borrower" },
  registered_date: { type: DataTypes.DATEONLY },
});

module.exports = User;
