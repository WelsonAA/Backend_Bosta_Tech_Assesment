const Book = require("../models/book.model");

class BookRepository {
  async create(data) {
    return await Book.create(data);
  }

  async findAndCountAll(limit, offset) {
    return await Book.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async search(query, Op) {
    return await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { isbn: { [Op.like]: `%${query}%` } },
        ],
      },
    });
  }

  async findById(public_id) {
    return await Book.findOne({ where: { public_id } });
  }

  async update(public_id, data) {
    return await Book.update(data, { where: { public_id } });
  }

  async delete(public_id) {
    return await Book.destroy({ where: { public_id } });
  }
}

module.exports = new BookRepository();
