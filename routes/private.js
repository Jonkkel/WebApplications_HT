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
    // User.findOne({ email: req.user.email}, (err, USER) => {
    //     if(err){
    //         console.log(err);
    //         throw err
    //     };
    //     if(!USER){
    //         return res.status(403).send({message: "Something went wrong"});
    //     }
    // }),
    console.log("jee");
    Todo.findOne({ user: req.user._id}, (err, todo) => {

        console.log(req.user._id);
        if(err){
            console.log(err);
            throw err
        };
        if(todo){
            var array = [];
            array = todo.items;
            console.log("array ennen:", array);
            console.log(req.body.items);
            for (let i = 0; i < req.body.items.length;i++){
                array.push(req.body.items[i]);
                console.log(req.body.items[i])
            }
            console.log("array JÄLKEEN:", array);
            todo.items = array; 
            console.log(array);
            todo.save();
            return res.send(array);
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