const { model, Schema } = require("mongoose");

const bookSchema = new Schema({
    title: { type: String, required: true },
    ISBN: { type: String, unique: true },
    subtitle: { type: String },
    image: String,
    url: String,
    description: String,
    author: String,
    publisher: String,
    published: Number,
    pages: Number,
    language: String,
});

module.exports = model("Book", bookSchema);
