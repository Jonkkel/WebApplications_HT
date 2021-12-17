const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const snippetScheme = new Schema({
    parent: String,
    creator: String,
    items: String
});

module.exports = mongoose.model("Snippet", snippetScheme);