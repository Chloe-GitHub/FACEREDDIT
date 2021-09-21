const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const Sub = require('../models/sub');
const Post = require('../models/post')

//homepage
router.get('/', async(req,res)=>{
    const subs = await Sub.find({});
    res.render('home', {subs});
})

//register
router.get('/register', (req,res) =>{
    res.render('../users/register');
})
router.post('/register', async (req,res,next) =>{
    try{
        const {email, username, password} = req.body;
        const user = new User({ email,username });
        const registeredUser = await User.register(user, password) ;
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to FaceReddit!');
            res.redirect('/');
        })
    } catch(e) {
        console.log(e)
        req.flash('error', e.message);
        res.redirect('register');
    }
})

//login
router.get('/login', (req, res) => {
    res.render('../users/login');
})
router.post('/login', passport.authenticate('local'), (req,res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/');
})

//logout
router.get('/logout', (req,res) => {
    req.logOut();
    req.flash('success', 'Sucessfully logout!');
    res.redirect('/');
})


module.exports = router;