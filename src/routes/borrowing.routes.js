const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowing.controller");
const basicAuth = require("../middlewares/basicAuth");

router.post("/borrow", basicAuth(["borrower"]), borrowingController.borrow.bind(borrowingController));
router.post("/return", basicAuth(["borrower"]), borrowingController.return.bind(borrowingController));
router.get("/", basicAuth(["admin"]), borrowingController.list.bind(borrowingController));
router.get("/overdue", basicAuth(["admin"]), borrowingController.overdue.bind(borrowingController));
router.get("/my", basicAuth(["borrower"]), borrowingController.myBorrowings.bind(borrowingController));
router.get("/reports", basicAuth(["admin"]), borrowingController.reports.bind(borrowingController));
router.get("/reports/overdue-last-month", basicAuth(["admin"]), borrowingController.overdueLastMonth.bind(borrowingController));
router.get("/reports/last-month", basicAuth(["admin"]), borrowingController.lastMonth.bind(borrowingController));

module.exports = router;
