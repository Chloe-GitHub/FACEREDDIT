const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');
const Sub = require('../models/sub');
const Post = require('../models/post')

router.get('/:id/sub/:sub', async (req,res) =>{
    const {id,sub} = req.params;
    const commentShow = await Comment.findById(id);
    const subObj = await Sub.findOne({subName: sub})
    res.render('facereddit/show',{commentShow, subObj});
})

//delete comment
router.delete('/:id',async (req,res) => {
    const {id} = req.params;
    const comment = await Comment.findById(id);
    Post.findOne({comments:comment})
    await Comment.findByIdAndDelete(id);
    res.redirect('/');
})

//get edit request and take you the edit page
router.get('/:id/edit', async (req,res) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    res.render('facereddit/edit', {comment});
})
router.patch('/:id/edit', async (req,res) => {
    const { id } = req.params;
    const newComment = await Comment.findByIdAndUpdate(id, req.body);
    res.redirect('/');
});


module.exports = router;