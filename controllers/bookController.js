const Book = require("../models/book");

class bookController {
    async getBooksHandler(req, res) {
        await Book.find({}, (err, books) => {
            if (err) {
                res.status(404).send("Error Occured");
            } else {
                res.json(books);
            }
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
            author: req.body.author,
            description: req.body.description,
            publisher: req.body.publisher,
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
        await Book.findByIdAndRemove(req.params.id, (err, book) => {
            if (err) {
                res.status(404).send("Error Occured");
            } else {
                res.json(book);
            }
        });
    }
}

module.exports = new bookController();
