const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.get("/", bookController.getBooksHandler);
router.get("/:id", bookController.getBookByIDHandler);
router.patch("/:id", bookController.updateBookHandler);
router.delete("/:id", bookController.deleteBookHandler);
router.put("/", bookController.insertBookHandler);

module.exports = router;
