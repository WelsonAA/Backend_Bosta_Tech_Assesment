const { DataTypes } = require("sequelize");
const { getDB } = require("../config/db");

const sequelize = getDB();
const BORROW_ALLOWANCE = 14;
const Borrowing = sequelize.define("Borrowing", {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  borrow_date: {type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW }, // defaults to today if not given
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  return_date: {type: DataTypes.DATEONLY,
    validate: {
      isAfterBorrow(value) {
        if (value && this.borrow_date && new Date(value) < new Date(this.borrow_date)) {
          throw new Error("return_date cannot be before borrow_date");
        }
      }
    }
  },
  status: {type: DataTypes.ENUM("borrowed", "returned"), defaultValue: "borrowed"},
}, {
  tableName: "borrowings",
  underscored: true,
  timestamps: true,
  hooks: {
    beforeValidate(borrowing) {
      if (!borrowing.due_date && borrowing.borrow_date) {
        const dueDate = addDays(borrowing.borrow_date, BORROW_ALLOWANCE);
        borrowing.due_date = formatDate(dueDate);
      }
    }
  }
});

module.exports = Borrowing;
