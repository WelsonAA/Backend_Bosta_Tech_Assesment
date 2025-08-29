const express = require("express");
const bookController = require("../controllers/book.controller");
const basicAuth = require("../middlewares/basicAuth");

const router = express.Router();

router.post("/", basicAuth(["admin"]), bookController.create.bind(bookController));
router.get("/", bookController.getAll.bind(bookController));
router.get("/search", bookController.search.bind(bookController));
router.get("/:public_id", bookController.getOne.bind(bookController));
router.put("/:public_id", basicAuth(["admin"]), bookController.update.bind(bookController));
router.delete("/:public_id", basicAuth(["admin"]), bookController.delete.bind(bookController));

module.exports = router;

