const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoScheme = new Schema({
    user: String,
    items: Array
});

module.exports = mongoose.model("Todo", todoScheme);