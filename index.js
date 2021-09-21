if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');




const dbUrl = process.env.dbUrl||'mongodb://localhost:27017/facereddit';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Comment = require('./models/comment');
const Post = require('./models/post');
const Sub = require('./models/sub');
const User = require('./models/user');

const MongoDBStore = require("connect-mongo")(session);

const userRouter = require('./router/user');
const newPostRouter = require('./router/newPost');
const newCreateCommentRouter = require('./router/newCreateComment');
const shwCmtDeltEditRouter = require('./router/shwCmtDeltEdit');
const newSubRouter = require('./router/newSub');
const subRouter = require('./router/subBrowse');
const postRouter = require('./router/postBrowse');
const {ensureLogIn} = require('./middleware');


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));

//parsing request.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.secret || 'thisshouldbeabettersecret!'

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 3600
});

store.on('error', function(e){
    console.log('SESSION STORE ERROR',e);
})

const sessionConfig = {
    
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secret: 'thisshouldbeabettersecret!',
        httpOnly: true,
        resave: false,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.sucess = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', userRouter);
app.use('/newPost', ensureLogIn, newPostRouter);
app.use('/new', ensureLogIn, newCreateCommentRouter);
app.use('/fr', ensureLogIn, shwCmtDeltEditRouter);
app.use('/newSub', ensureLogIn, newSubRouter);
app.use('/sub', subRouter);
app.use('/post', postRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`listening at port ${port}`);
}) 