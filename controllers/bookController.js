const Book = require("../models/book");
const axios = require("axios");
const { setTimeout } = require("timers/promises");
const { response } = require("express");

class bookController {
    async getBooksHandler(req, res) {
        await Book.find({})
            .limit(parseInt(req.query.limit))
            .then((books) => {
                res.json(books);
            });
    }

    async getBookByIDHandler(req, res) {
        await Book.findById(req.params.id, (err, book) => {
            if (err) {
                res.status(404).send("Book not found");
            } else {
                res.json(book);
            }
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
}
module.exports = new bookController();
