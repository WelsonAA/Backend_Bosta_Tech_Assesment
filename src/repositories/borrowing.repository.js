const Borrowing = require("../models/borrowing.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");

class BorrowingRepository {
  async createBorrowing(data) {
    return await Borrowing.create(data);
  }

  async findBorrowingById(public_id) {
    return await Borrowing.findOne({ where: { public_id } });
  }

  async updateBorrowing(borrowing) {
    return await borrowing.save();
  }

  async getBorrowings(limit, offset) {
    return await Borrowing.findAndCountAll({
      limit,
      offset,
      include: [
        { model: User, attributes: ["public_id", "name"] },
        { model: Book, attributes: ["public_id", "title"] },
      ],
      order: [["borrow_date", "DESC"]],
    });
  }

  async getOverdueBorrowings(limit, offset) {
    const today = new Date().toISOString().split("T")[0];
    return await Borrowing.findAndCountAll({
      where: { status: "borrowed", due_date: { [Op.lt]: today } },
      limit,
      offset,
      include: [
        { model: User, as: "borrower", attributes: ["public_id", "name"] },
        { model: Book, as: "book", attributes: ["public_id", "title"] },
      ],
      order: [["due_date", "ASC"]],
    });
  }

  async getBorrowingsByUser(borrower_public_id, limit, offset) {
    return await Borrowing.findAndCountAll({
      where: { borrower_public_id },
      limit,
      offset,
      include: [{ model: Book, as: "book", attributes: ["public_id", "title"] }],
      order: [["borrow_date", "DESC"]],
    });
  }

  async getReportByPeriod(from, to) {
    return await Borrowing.findAll({
      where: { borrow_date: { [Op.between]: [from, to] } },
      include: [
        { model: User, as: "borrower", attributes: ["public_id", "name"] },
        { model: Book, as: "book", attributes: ["public_id", "title"] },
      ],
    });
  }

  async getLastMonthBorrowings(firstDay, lastDay, overdue = false) {
    const where = {
      borrow_date: { [Op.between]: [firstDay, lastDay] },
    };
    if (overdue) where.due_date = { [Op.lt]: new Date() };

    return await Borrowing.findAll({
      where,
      include: [
        { model: User, as: "borrower", attributes: ["public_id", "name"] },
        { model: Book, as: "book", attributes: ["public_id", "title"] },
      ],
    });
  }
}

module.exports = new BorrowingRepository();
