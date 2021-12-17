const express = require("express")
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const User = require("../models/Users");
const {body, validationResult} = require("express-validator");
const jwt = require('jsonwebtoken');
const { connect } = require("http2");
// var format = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])');

router.post("/register",
    
    body("email").isEmail().isLength({min: 3}).trim().escape().withMessage('Email is not valid.'),
    body("first_name").isLength({min: 2}).withMessage('Firstname too short'),
    body("last_name").isLength({min: 2}).withMessage('Lastname too short'),
    body("username").isLength({min: 2}).withMessage('Username too short'),
    body("password").isStrongPassword().withMessage('Too weak password when registering'),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()){
            console.log(errors.array()[0].msg);
            return res.status(400).json({message: errors.array()[0].msg});
        }
        const d = new Date();
        const date = d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear();
        User.findOne({ email: req.body.email }, (err, user) => {
            if(err){
                console.log(err);
                throw err
            };
            if(user){
                return res.status(403).json({message: "Duplicate email in registration"});
            }else{
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    User.create({
                        email: req.body.email,
                        password: hash,
                        firstname: req.body.first_name,
                        lastname: req.body.last_name,
                        username: req.body.username,
                        registery_date: date,
                        bio: " ",
                        },
                        (err, ok) => {
                            if(err) throw err;
                            return res.send({"success": true});
                        })
                    });
                })
            }
        });
    });

// router.post("/register",
//     body("email").isEmail().isLength({min: 3}).trim().escape(),
//     body("password").isStrongPassword().withMessage('Too weak password when registering'),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()){
//             console.log(errors.array()[0].msg);
//             return res.status(400).json({message: errors.array()[0].msg});
//         }
//         User.findOne({ email: req.body.email}, (err, user) => {
//             if(err){
//                 console.log(err);
//                 throw err
//             };
//             if(user){
//                 return res.status(403).json({message: "Duplicate email in registration"});
//             }else{
//                 bcrypt.genSalt(10, (err, salt) => {
//                     bcrypt.hash(req.body.password, salt, (err, hash) => {
//                     if (err) throw err;
//                     User.create({
//                         email: req.body.email,
//                         password: hash,
//                         },
//                         (err, ok) => {
//                             if(err) throw err;
//                             return res.send({"success": true});
//                         });
//                     });
//                 })
//             }
//         });
// });




router.post("/login",
    body("email").trim().escape(),
    body("password"),
    (req, res, next) => {
        User.findOne({ email: req.body.email}, (err, user) => {
            if(err) throw err;
            if(!user){
                return res.status(403).json({message: "Invalid credentials"});
            }else{
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        const payLoad = {
                            email: user.email
                        }
                        jwt.sign(
                            payLoad,
                            process.env.SECRET,
                            // {
                            //     expiresIn: 120
                            // },
                            (err,token) => {
                                res.json({success: true, token});
                            }
                        );
                    }else{
                        return res.status(403).json({message: "Invalid credentials"});
                    }
                })
            }
    });

});


module.exports = router;