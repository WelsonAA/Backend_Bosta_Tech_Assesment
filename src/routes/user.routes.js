const express = require("express");
const basicAuth = require("../middlewares/basicAuth");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", userController.register.bind(userController));
router.get("/", basicAuth(["admin"]), userController.getAll.bind(userController));
router.get("/:public_id", userController.getOne.bind(userController));
router.put("/:public_id", userController.update.bind(userController));
router.put("/:public_id/promote", basicAuth(["admin"]), userController.promote.bind(userController));
router.delete("/:public_id", basicAuth(["admin"]), userController.delete.bind(userController));

module.exports = router;
