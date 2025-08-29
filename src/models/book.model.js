const { DataTypes } = require("sequelize");
const { getDB } = require("../config/db");

const sequelize = getDB();

const Book = sequelize.define("books", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, unique: true, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  shelf_id: { type: DataTypes.STRING, allowNull: false }, // just a code like "A3" or "12"
});

module.exports = Book;
