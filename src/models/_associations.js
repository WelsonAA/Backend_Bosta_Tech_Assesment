const User = require("./user.model");
const Book = require("./book.model");
const Borrowing = require("./borrowing.model");

function applyAssociations() {
  // Borrower ↔ Borrowing
  User.hasMany(Borrowing, { foreignKey: "borrower_id", as: "borrows" });
  Borrowing.belongsTo(User, { foreignKey: "borrower_id", as: "borrower" });

  // Book ↔ Borrowing
  Book.hasMany(Borrowing, { foreignKey: "book_id", as: "borrows" });
  Borrowing.belongsTo(Book, { foreignKey: "book_id", as: "book" });
}

module.exports = applyAssociations;
