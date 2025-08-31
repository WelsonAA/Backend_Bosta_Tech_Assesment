const bookService = require("../services/book.service");

class BookController {
  async create(req, res, next) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const allowedLimits = [10, 20, 50];
      const limit = allowedLimits.includes(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;

      const { count, rows } = await bookService.getBooks(page, limit);

      res.json({
        books: rows,
        pagination: {
          total: count,
          page,
          perPage: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }

async search(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Missing search query" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await bookService.searchBooks(q, limit, offset);

    res.json({
      pagination: {
        total: count,
        page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
      },
      books: rows,
    });
  } catch (err) {
    next(err);
  }
}


  async getOne(req, res, next) {
    const book = await bookService.getBook(req.params.public_id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  }

  async update(req, res, next) {
    try {
      const [updated] = await bookService.updateBook(req.params.public_id, req.body);
      if (!updated) return res.status(404).json({ error: "Book not found" });

      const book = await bookService.getBook(req.params.public_id);
      res.json(book);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await bookService.deleteBook(req.params.public_id);
      if (!deleted) return res.status(404).json({ error: "Book not found" });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookController();
