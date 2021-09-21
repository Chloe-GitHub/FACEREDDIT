const express = require('express');
const router = express.Router();

const Sub = require('../models/sub');

router.get('/:subFR', async(req,res)=>{
    const {subFR} = req.params;
    const sub = await Sub.findOne({subName:subFR});
    await sub.populate('posts');
    res.render('subFR',{subFR,sub});
})


module.exports = router;