const passport = require('passport');
const express = require('express');
const Snippet = require("../models/Snippet");
const User = require("../models/Users");
const router = express.Router();

// Returns user email
router.get('/private', (req, res, next) => {
    res.json({
      user: req.user._id
    })
  }
);


// Creates new post
router.post('/post', (req, res, next) => {
    Snippet.create({
        creator: req.user._id,
        items: req.body.text
        },(err, ok) => {
            if(err) throw err;
            return res.send({"status": "Success"});
    })
});

// Creates new comment
router.post('/comment', (req, res, next) => {
    Snippet.create({
        parent: req.body.ID,
        creator: req.user._id,
        items: req.body.text
        },
        (err, ok) => {
            if(err) throw err;
            return res.send({"status": "Success"});
    })
});

// Return user data from db
router.get('/userdata', (req, res, next) => {
    console.log(req.user.email);
    User.findOne({email: req.user.email}, (err, user) => {
        if(err){
            console.log(err);
            throw err
        };
        if(user){
            console.log(user.username);
            return res.json({"username": user.username, "registery_date": user.registery_date, "firstname": user.firstname ,"lastname": user.lastname,"bio": user.bio});
        }else{
            return res.send([]);
        }
    })
});

// Handles bio changes to db
router.post('/changebio', (req, res, next) => {
    User.findOne({email: req.user.email}, (err, user) => {
        if(err){
            console.log(err);
            throw err
        };
        if(!user){
            return res.status(403).json({message: "Error with email."});
        }else{
            user.bio = req.body.bio;
            user.save();
            return res.json({message: "ok"});
        }
    })
});

module.exports = router;