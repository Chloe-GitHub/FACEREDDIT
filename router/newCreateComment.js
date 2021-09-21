const express = require('express');
const router = express.Router();


const Comment = require('../models/comment');
const Post = require('../models/post');
const Sub = require('../models/sub');

router.get('/:subName/:id', async (req,res)=>{
    const {subName,id} = req.params;
    const post = await Post.findById(id); 
    const sub = await Sub.findOne({subName: subName});
    res.render('facereddit/new', {post,sub});
})
router.post('/:subName/:id', async (req,res) =>{
    const {subName,id} = req.params;
    const sub = await Sub.findOne({subName: subName});
    const newComment = new Comment(req.body); 
    newComment.author = req.user._id;
    await newComment.save();
    const user = await newComment.populate('author');
    await user.save();
    //console.log(newComment.author.username);
    const post = await Post.findById(id);
    await post.comments.push(newComment);
    await post.save();
    const com = await post.populate('comments');
    await com.save();
    res.render('facereddit/show',{sub, id, newComment})
})

module.exports = router;