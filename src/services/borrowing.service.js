const borrowingRepo = require("../repositories/borrowing.repository");
const Book = require("../models/book.model");
const User = require("../models/user.model");

class BorrowingService {
  async borrowBook(borrower_public_id, book_public_id) {
    const user = await User.findOne({ where: { public_id: borrower_public_id } });
    if (!user) throw new Error("Borrower not found");

    const book = await Book.findOne({ where: { public_id: book_public_id } });
    if (!book || book.available_quantity <= 0) {
      throw new Error("Book not available");
    }

    const borrowing = await borrowingRepo.createBorrowing({
      book_public_id: book.public_id,
      borrower_public_id: user.public_id,
      status: "borrowed",
    });

    await book.update({ available_quantity: book.available_quantity - 1 });

    return { borrowing, user, book };
  }

  async returnBook(borrowing_public_id) {
    const borrowing = await borrowingRepo.findBorrowingById(borrowing_public_id);
    if (!borrowing) throw new Error("Borrowing record not found");

    if (borrowing.status === "returned") throw new Error("Book already returned");

    borrowing.return_date = new Date();
    borrowing.status = "returned";
    await borrowingRepo.updateBorrowing(borrowing);

    const book = await Book.findOne({ where: { public_id: borrowing.book_public_id } });
    if (book) {
      await book.update({ available_quantity: book.available_quantity + 1 });
    }

    return { borrowing, book };
  }

  async listBorrowings(page, limit) {
    const offset = (page - 1) * limit;
    return await borrowingRepo.getBorrowings(limit, offset);
  }

  async listOverdue(page, limit) {
    const offset = (page - 1) * limit;
    return await borrowingRepo.getOverdueBorrowings(limit, offset);
  }

  async listUserBorrowings(borrower_public_id, page, limit) {
    const offset = (page - 1) * limit;
    return await borrowingRepo.getBorrowingsByUser(borrower_public_id, limit, offset);
  }

  async getReport(from, to) {
    return await borrowingRepo.getReportByPeriod(from, to);
  }

  async getLastMonth(overdue = false) {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return await borrowingRepo.getLastMonthBorrowings(firstDayLastMonth, lastDayLastMonth, overdue);
  }
}

module.exports = new BorrowingService();
