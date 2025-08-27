const express = require("express");
const Book = require("../models/book.model");

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

// Search by title, author, or ISBN
router.get("/search", async (req, res) => {
  const { q } = req.query;
  const books = await Book.findAll({
    where: {
      [Book.sequelize.Op.or]: [
        { title: { [Book.sequelize.Op.like]: `%${q}%` } },
        { author: { [Book.sequelize.Op.like]: `%${q}%` } },
        { isbn: { [Book.sequelize.Op.like]: `%${q}%` } }
      ]
    }
  });
  res.json(books);
});

// Read one
router.get("/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Book.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Book not found" });
    res.json(await Book.findByPk(req.params.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const deleted = await Book.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: "Book not found" });
  res.status(204).send();
});

module.exports = router;
