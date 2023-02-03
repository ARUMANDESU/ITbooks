const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.get("/", bookController.getBooksHandler);

router.get("/:id", bookController.getBookByIDHandler);
router.get("/parse/:isbn", bookController.parseBook);

router.patch("/:id", bookController.updateBookHandler);
router.delete("/:id", bookController.deleteBookHandler);
router.post("/", bookController.insertBookHandler);
router.post("/api", bookController.insertFromITBOOKSAPI);

module.exports = router;
