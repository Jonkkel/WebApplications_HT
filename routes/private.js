const passport = require('passport');
const express = require('express');
const Todo = require("../models/Todo");
const User = require("../models/Users");
const router = express.Router();

router.get('/private', (req, res, next) => {
    res.json({
      email: req.user.email
    })
  }
);

router.post('/todos', (req, res, next) => {
    User.findOne({ email: req.user.email}, (err, user) => {
        if(err){
            console.log(err);
            throw err
        };
        if(user){
            console.log(user);
        }
    }),
    Todo.findOne({ user: req.user.email}, (err, todo) => {
        if(err){
            console.log(err);
            throw err
        };
        if(todo){
            var array = [];
            array = todo.items;
            console.log(todo);
            console.log(array);
        }else{
            Todo.create({
                user: req.user.email,
                items: req.body.items
                },
                (err, ok) => {
                    if(err) throw err;
                    return res.send("ok");
            })
        }
  })
});

module.exports = router;