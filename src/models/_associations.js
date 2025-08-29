const User = require("./user.model");
const Book = require("./book.model");
const Borrowing = require("./borrowing.model");

function applyAssociations() {
  // Borrower ↔ Borrowing
  User.hasMany(Borrowing, { foreignKey: "borrower_public_id", sourceKey: "public_id", as: "borrows" });
  Borrowing.belongsTo(User, { foreignKey: "borrower_public_id", targetKey: "public_id", as: "borrower" });

  Book.hasMany(Borrowing, { foreignKey: "book_public_id", sourceKey: "public_id", as: "borrows" });
  Borrowing.belongsTo(Book, { foreignKey: "book_public_id", targetKey: "public_id", as: "book" });
}

module.exports = applyAssociations;
