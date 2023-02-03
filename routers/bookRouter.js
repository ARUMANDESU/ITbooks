const express = require("express");
const bookController = require("../controllers/bookController");
const { roleMiddleware } = require("../services/middlewares");
const router = express.Router();

router.get("/", bookController.getBooksHandler);
router.get("/parse", roleMiddleware(["admin"]), bookController.parseBook);

router.get("/:id", bookController.getBookByIDHandler);

router.patch("/:id", bookController.updateBookHandler);
router.delete("/:id", bookController.deleteBookHandler);
router.post("/", bookController.insertBookHandler);
router.post("/api", bookController.insertFromITBOOKSAPI);
router.post("/search", bookController.search);

module.exports = router;
