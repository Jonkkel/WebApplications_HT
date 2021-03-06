const passport = require('passport');
const express = require('express');
const Snippet = require("../models/Snippet");
const User = require("../models/Users");
const router = express.Router();

// Gets all posts
router.get('/posts', (req, res, next) => {
    Snippet.find({"parent": {$exists: false} }, (err, snip) => {
        if(err){
            console.log(err);
            throw err
        };
        if(snip){
            var snips = [];
            var ids = [];
            var creators = [];
            for (let i = 0; i < snip.length; i++){
                snips.push(snip[i].items);
                ids.push(snip[i]._id);
                creators.push(snip[i].creator);
            }
            return res.send({"snippets": snips, "ids": ids, "creators": creators});
        }else{
            console.log("hups");
            return res.send("WHoops");
            
        }
    })
});

// Gets all comments to a single post with ID
router.get('/comments/:ID', (req, res, next) => {
    Snippet.find({"parent": req.params.ID}, (err, snip) => {
        if(err){
            console.log(err);
            throw err
        };
        if(snip){
            var snips = [];
            var ids = [];
            var creators = []
            for (let i = 0; i < snip.length; i++){
                snips.push(snip[i].items);
                ids.push(snip[i]._id);
                creators.push(snip[i].creator);
            }
            return res.send({"snippets": snips, "ids": ids, "creators": creators});
        }else{
            console.log("hups");
            return res.send("WHoops");
            
        }
    })
});

// Handles post/comment editing
router.post('/edit', (req, res, next) => {
    Snippet.findOne({_id: req.body.postID}, (err, snip) => {
        if(err){
            console.log(err);
            throw err
        };
        if(!snip){
            return res.status(403).json({message: "Error with finding post."});
        }else{
            snip.items = req.body.text;
            snip.save();
            return res.json({message: "ok"});
        }
    })
});

module.exports = router;