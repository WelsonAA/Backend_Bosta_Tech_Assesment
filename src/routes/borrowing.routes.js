const express = require("express");
const Borrowing = require("../models/borrowing.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");

const router = express.Router();

// Borrow a book
router.post("/", async (req, res) => {
  try {
    const { borrower_id, book_id, borrow_date } = req.body;

    // Check book availability
    const book = await Book.findByPk(book_id);
    if (!book || book.available_quantity <= 0) {
      return res.status(400).json({ error: "Book not available" });
    }

    // Create borrow record
    const borrowing = await Borrowing.create({
      borrower_id,
      book_id,
      borrow_date
    });

    // Decrease available quantity
    await book.update({ available_quantity: book.available_quantity - 1 });

    res.status(201).json(borrowing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Return a book
router.post("/:id/return", async (req, res) => {
  try {
    const borrowing = await Borrowing.findByPk(req.params.id, { include: Book });
    if (!borrowing) return res.status(404).json({ error: "Borrow record not found" });

    if (borrowing.status === "returned") {
      return res.status(400).json({ error: "Book already returned" });
    }

    // Update status
    borrowing.status = "returned";
    borrowing.return_date = new Date().toISOString().split("T")[0];
    await borrowing.save();

    // Increase available quantity
    await borrowing.book.update({ available_quantity: borrowing.book.available_quantity + 1 });

    res.json(borrowing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all borrowings
router.get("/", async (req, res) => {
  const borrowings = await Borrowing.findAll({ include: [User, Book] });
  res.json(borrowings);
});

// List overdue
router.get("/overdue", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const overdue = await Borrowing.findAll({
    where: { status: "borrowed", due_date: { [Borrowing.sequelize.Op.lt]: today } },
    include: [User, Book]
  });
  res.json(overdue);
});

module.exports = router;
