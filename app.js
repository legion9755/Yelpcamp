if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const Errorhandler = require('express-async-errors');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const { title } = require('process');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const expressError = require('./utils/expressError');
const mongoSanitize = require('express-mongo-sanitize');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/yelp-camp'




mongoose.connect( dbUrl, {
})
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

const app = express();


//MIDDLEWARE
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(helmet({contentSecurityPolicy: false}));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret: 'badsecret!'
    }
});

store.on("error", function(e){
    console.log("Session Store Error", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'My secret',
    resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now()+ 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




app.use('/', userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})






// Error Handling Middleware
app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = 'Oh No, Something Went Wrong' }
    res.status(statusCode).render('error', { err });

})
app.listen(3000, () => {
    console.log('Serving on port 3000');
})