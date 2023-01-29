const { model, Schema } = require("mongoose");

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    publisher: { type: String },
});

module.exports = model("Book", bookSchema);
