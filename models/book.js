const { model, Schema } = require("mongoose");

const bookSchema = new Schema({
    title: { type: String, required: true },
    ISBN: String,
    subtitle: { type: String },
    image: String,
    url: String,
});

module.exports = model("Book", bookSchema);
