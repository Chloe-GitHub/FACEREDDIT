const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const Sub = require('../models/sub');



router.get('/:subName', (req, res) => {
    const {subName} = req.params;
    res.render('facereddit/newPost', {subName});
})
router.post('/:subName', async (req,res) => {
    const {subName} = req.params;
    const newPost = new Post(req.body) ;
    await newPost.save();
    const sub = await Sub.findOne({subName:subName})
    await sub.posts.push(newPost);
    await sub.save();
    const pop = await sub.populate('posts');
    await pop.save();
    res.redirect(`/sub/${subName}`);
})

module.exports = router;