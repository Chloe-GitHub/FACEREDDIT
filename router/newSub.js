const express = require('express');
const router = express.Router();

const Sub = require('../models/sub');

router.get('/', (req,res) => {
    res.render('facereddit/newSub');
})
router.post('/', async (req,res) => {
    const subName = await Sub.findOne(req.body);
    if(!subName){
        const newSub = new Sub(req.body);
        await newSub.save();
        res.redirect(`/sub/${newSub.subName}`);
    }
    else{
        res.render('facereddit/exist',{subName});
    }    
})


module.exports = router;