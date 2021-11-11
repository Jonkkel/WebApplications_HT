require('dotenv').config();
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./auth/passport');
const passport = require('passport');

const secureRoute = require('./routes/private.js');
var app = express();

const mongoDB = "mongodb://localhost:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/user", require("./api/register.js"));
app.use(passport.initialize());
app.use('/api',passport.authenticate('jwt', {session: false}),require("./routes/private.js"));

module.exports = app;