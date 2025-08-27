const { DataTypes } = require("sequelize");
const { getDB } = require("../config/db");

const sequelize = getDB();

const Book = sequelize.define("Book", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, unique: true, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  shelf_id: { type: DataTypes.STRING, allowNull: false }, // just a code like "A3" or "12"
});

module.exports = Book;
