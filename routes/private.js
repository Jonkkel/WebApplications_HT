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
    console.log(req.body.items);
    // User.findOne({ email: req.user.email}, (err, USER) => {
    //     if(err){
    //         console.log(err);
    //         throw err
    //     };
    //     if(!USER){
    //         return res.status(403).send({message: "Something went wrong"});
    //     }
    // }),
    Todo.findOne({ user: req.user._id}, (err, todo) => {

        console.log(req.user._id);
        if(err){
            console.log(err);
            throw err
        };
        if(todo){
            for (let i = 0; i < req.body.items.length;i++){
                todo.items.push(req.body.items[i]);
            }
            todo.save();
            return res.send(todo.items);
        }else{
            Todo.create({
                user: req.user._id,
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