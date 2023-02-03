const Book = require("../models/book");
const axios = require("axios");
const { response } = require("express");
const { parseBookHtml } = require("../utils/bookParser");

class bookController {
    async getBooksHandler(req, res) {
        req.query.limit = 100;
        await Book.find({})
            .limit(parseInt(req.query.limit))
            .then((books) => {
                res.json(books);
            });
    }

    async getBookByIDHandler(req, res) {
        await Book.findOne({ _id: req.params.id })
            .then((book) => {
                res.json(book);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    async insertBookHandler(req, res) {
        const book = new Book({
            title: req.body.title,
            subtitle: req.body.description,
            ISBN: req.body.ISBN,
            image: req.body.image,
            url: req.body.url,
        });
        book.save((err, book) => {
            if (err) {
                res.status(404).send("Error Occured");
            } else {
                res.json(book);
            }
        });
    }

    async updateBookHandler(req, res) {
        await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
            (err, book) => {
                if (err) {
                    res.status(404).send("Error Occured");
                } else {
                    res.json(book);
                }
            }
        );
    }

    async deleteBookHandler(req, res) {
        Book.findByIdAndRemove(req.params.id, (err, book) => {
            if (err) {
                res.status(404).send("Error Occured");
            } else {
                res.json(book);
            }
        });
    }

    async insertFromITBOOKSAPI(req, res) {
        try {
            const page = req.query.page.split("-");
            const start = parseInt(page[0]),
                end = parseInt(page[1]);
            for (let i = start; i <= end; i++) {
                console.log(i);
                const url = `https://api.itbook.store/1.0/search/it/${i}`;
                axios.get(url).then((response) => {
                    response.data.books.map((book) => {
                        const book1 = new Book({
                            title: book.title,
                            subtitle: book.subtitle,
                            ISBN: book.isbn13,
                            image: book.image,
                            url: book.url,
                        });
                        book1.save((err, book) => {
                            if (err) {
                                res.status(404).send("Error Occured");
                            }
                        });
                    });
                });
                await setTimeout(200);
            }
            res.json({ message: "done", successful: true });
        } catch (e) {
            console.log(e);
        }
    }
    async parseBook(req, res) {
        try {
            const books = await Book.find({
                description: { $exists: false },
            });

            const promises = books.map(async (book) => {
                const url = `https://itbook.store/books/${book.ISBN}`;

                const result = await parseBookHtml(url);
                result.ISBN = book.ISBN;
                console.log(result);
                await Book.findOneAndUpdate(
                    { ISBN: book.ISBN },
                    { $set: result }
                );
            });
            await Promise.all(promises);
            res.json(books);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteDuplicatedDocs() {
        await Book.aggregate(
            [
                {
                    $group: {
                        _id: "$ISBN",
                        uniqueIds: { $addToSet: "$_id" },
                        count: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        count: { $gt: 1 },
                    },
                },
            ],
            function (err, results) {
                results.forEach(function (result) {
                    result.uniqueIds.shift();
                    Book.deleteMany(
                        { _id: { $in: result.uniqueIds } },
                        function (err) {
                            console.log(
                                "Deleted duplicated ISBN: ",
                                result._id
                            );
                        }
                    );
                });
            }
        );
    }
    async search(req, res) {
        try {
            const payload = req.body.payload.trim();
            const books = await Book.find({
                title: { $regex: new RegExp("^" + payload + ".*", "i") },
            }).limit(15);

            res.json(books);
        } catch (e) {
            console.log(e);
        }
    }
}
module.exports = new bookController();
