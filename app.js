const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDb = require('./config/db');

// Load configs
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDb();

// Create express app
const app = express();

// Setup middleware

// Add logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Parse body data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handlebars helpers
const hbsHelpers = require('./helpers/hbs');

// Set handlebars as the view engine
app.engine('.hbs', exphbs({ 
    defaultLayout: 'main', 
    extname: '.hbs', 
    helpers: hbsHelpers
}));
app.set('view engine', '.hbs');

// Set express session middleware
app.use(session({
    secret: 'static parsley',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Add passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// Not found
app.use((req, res, next) => {
    res.render('error/404');
});

// Set hosting port
const PORT = process.env.PORT || 3000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}. ` +
                `http://localhost:${PORT}.`));
