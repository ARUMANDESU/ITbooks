const express = require("express");
const userRouter = require("./userRouter");
const bookRouter = require("./bookRouter");

const router = express.Router();

router.use("/user/", userRouter);
router.use("/book/", bookRouter);

router.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = router;
