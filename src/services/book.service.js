const { Op } = require("sequelize");
const bookRepo = require("../repositories/book.repository");

class BookService {
  async createBook(data) {
    return await bookRepo.create(data);
  }

  async getBooks(page, limit) {
    const offset = (page - 1) * limit;
    return await bookRepo.findAndCountAll(limit, offset);
  }

  async searchBooks(query, limit, offset) {
    return await bookRepo.search(query, Op, limit, offset);
  }

  async getBook(public_id) {
    return await bookRepo.findById(public_id);
  }

  async updateBook(public_id, data) {
    return await bookRepo.update(public_id, data);
  }

  async deleteBook(public_id) {
    return await bookRepo.delete(public_id);
  }
}

module.exports = new BookService();
