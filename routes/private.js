const passport = require('passport');
const express = require('express');
const Snippet = require("../models/Snippet");
const User = require("../models/Users");
const router = express.Router();

router.get('/private', (req, res, next) => {
    res.json({
      user: req.user._id
    })
  }
);


router.post('/post', (req, res, next) => {
    Snippet.create({
        creator: req.user._id,
        items: req.body.text
        },(err, ok) => {
            if(err) throw err;
            return res.send({"status": "Success"});
    })
});

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



// Identity seems to be useless atm 14.12.2021 21:25
// router.post('/post', (req, res, next) => {
//     Snippet.count({}, function(error, d) {
//         if(error){
//             console.log(err);
//             throw error
//         };
//         Snippet.create({
//             identity: d,
//             creator: req.user._id,
//             items: req.body.text
//             },(err, ok) => {
//                 if(err) throw err;
//                 return res.send({"id": d});
//         })
//     });
// });

// router.post('/comment', (req, res, next) => {
//     Snippet.count({}, function(error, d) {
//         if(error){
//             console.log(err);
//             throw error
//         };
//         Snippet.create({
//             identity: d,
//             parent: req.body.ID,
//             creator: req.user._id,
//             items: req.body.text
//             },
//             (err, ok) => {
//                 if(err) throw err;
//                 return res.send({"id": d});
//         })
//     });
// });


module.exports = router;