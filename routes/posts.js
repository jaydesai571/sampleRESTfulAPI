const express = require('express');
const { update } = require('../models/Post');

const router = express.Router();
const Post = require('../models/Post');

const verify = require('./verifyToken');

router.get('/', verify, async(req,res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch(err){
        res.json({ message:err });
    }
});

router.post('/', async(req,res) => {
    console.log(req.body.title);
    console.log(req.body.description);
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    // post.save()
    //     .then(data => {
    //         res.json(data);
    //     })
    //     .catch(err => {
    //         res.json({ message: err });
    //     });
    try {
        const savedPosted = await post.save();
        res.json(savedPosted);
    }catch(err) {
        res.json({ message: err });
    }

});

router.get('/:postId', async(req,res) => {
    console.log(req.params.postId);
    try{
    const post = await Post.findById(req.params.postId);
    res.json(post);
    }catch(err){
        res.json({ message: err });
    }
});

router.delete('/:postId', async(req,res) => {
    try{
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost);
    }catch(err){
        res.json({ message:err });
    }
});

router.patch('/:postId', async(req,res) => {
    try{
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId},
            {$set: {title: req.body.title }}
            );
        res.json(updatedPost);
    }catch(err) {
        res.json({message:err});
    }
});
module.exports = router;