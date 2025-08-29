const borrowingService = require("../services/borrowing.service");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");

class BorrowingController {
  async borrow(req, res, next) {
    try {
      const { borrower_public_id, book_public_id } = req.body;
      const { borrowing, user, book } = await borrowingService.borrowBook(borrower_public_id, book_public_id);

      res.status(201).json({
        public_id: borrowing.public_id,
        borrower: { public_id: user.public_id, username: user.name },
        book: { public_id: book.public_id, title: book.title },
        borrow_date: borrowing.borrow_date,
        due_date: borrowing.due_date,
        status: borrowing.status,
      });
    } catch (err) {
      next(err);
    }
  }

  async return(req, res, next) {
    try {
      const { borrowing_public_id } = req.body;
      const { borrowing, book } = await borrowingService.returnBook(borrowing_public_id);
      res.json({ message: "Book returned successfully", borrowing, book });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = [10, 20, 50].includes(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;

    const { count, rows } = await borrowingService.listBorrowings(page, limit);

    res.json({
      borrowings: rows,
      pagination: { total: count, page, perPage: limit, totalPages: Math.ceil(count / limit) },
    });
  }

  async overdue(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = [10, 20, 50].includes(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;

    const { count, rows } = await borrowingService.listOverdue(page, limit);
    res.json({ borrowings: rows, pagination: { total: count, page, perPage: limit, totalPages: Math.ceil(count / limit) } });
  }

  async myBorrowings(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = [10, 20, 50].includes(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;
    const borrowerPublicId = req.body.borrower_public_id || req.user?.public_id;

    const { count, rows } = await borrowingService.listUserBorrowings(borrowerPublicId, page, limit);
    res.json({ borrowings: rows, pagination: { total: count, page, perPage: limit, totalPages: Math.ceil(count / limit) } });
  }

  async reports(req, res, next) {
    const { from, to, format = "json" } = req.query;
    const borrowings = await borrowingService.getReport(from, to);

    const data = borrowings.map(b => ({
      borrowing_id: b.public_id,
      borrower: b.borrower?.name || null,
      book: b.book?.title || null,
      borrow_date: b.borrow_date,
      due_date: b.due_date,
      return_date: b.return_date,
      status: b.status,
    }));

    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header("Content-Type", "text/csv");
      res.attachment(`borrowings_${from}_${to}.csv`);
      return res.send(csv);
    }

    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Borrowings");
      sheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
      sheet.addRows(data);

      res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.attachment(`borrowings_${from}_${to}.xlsx`);
      await workbook.xlsx.write(res);
      return res.end();
    }

    res.json(data);
  }

  async overdueLastMonth(req, res, next) {
    const borrowings = await borrowingService.getLastMonth(true);
    res.json({ count: borrowings.length, results: borrowings });
  }

  async lastMonth(req, res, next) {
    const borrowings = await borrowingService.getLastMonth(false);
    res.json({ count: borrowings.length, results: borrowings });
  }
}

module.exports = new BorrowingController();
