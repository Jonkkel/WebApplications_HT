const passport = require('passport');
const express = require('express');
const Todo = require("../models/Todo");
const User = require("../models/Users");
const router = express.Router();

router.get('/private', (req, res, next) => {
    res.json({
      user: req.user,
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
        }else{
            return res.status(403).send({message: "Something went wrong"});
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
            for (let i = 0; i < req.body.items.length;i++){
                array.push(req.body.items[i]);
            }
            todo.items = array; 
            return res.send("ok");
        }else{
            Todo.create({
                user: user._id,
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