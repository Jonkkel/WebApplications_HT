const express = require("express")
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const User = require("../models/Users");
const {body, validationResult} = require("express-validator");
const jwt = require('jsonwebtoken');
const { connect } = require("http2");


router.post("/register",
    body("email").isEmail().isLength({min: 3}).trim().escape(),
    body("password").isLength({min: 8}),
    //.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]$/, "i")
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        User.findOne({ email: req.body.email}, (err, user) => {
            if(err){
                console.log(err);
                throw err
            };
            if(user){
                return res.status(403).send("Email already in use.");
            }else{
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    User.create({
                        email: req.body.email,
                        password: hash,
                        },
                        (err, ok) => {
                            if(err) throw err;
                            return res.send("ok");
                    }
                    );
                    });
                })
            }
        });
});

router.post("/login",
    body("email").trim().escape(),
    body("password"),
    (req, res, next) => {
        User.findOne({ email: req.body.email}, (err, user) => {
            if(err) throw err;
            if(!user){
                res.status(403).send({message: "Login failed."});
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
                            {
                                expiresIn: 120
                            },
                            (err,token) => {
                                res.json({success: true, token});
                            }
                        );
                    }
                })
            }
    });

});


module.exports = router;