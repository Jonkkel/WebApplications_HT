const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    username: String,
    registery_date: String,
    bio: String,
});

module.exports = mongoose.model("Users", userScheme);