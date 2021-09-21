const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const Sub = require('../models/sub');
const Comment = require('../models/comment');
//browse posts
router.get('/:subName/:postId', async(req,res) => {
    const {subName,postId} = req.params;
    const post = await Post.findById(postId);
    const sub = await Sub.findOne({subName:subName});
    const cmt = await post.populate('comments');
    await cmt.save();
    
    //Comment.find({$all:`${cmt}`.comments})
 
    res.render('facereddit/postContent', {post, sub, cmt})
})

module.exports = router;