const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDb = require('./config/db');

// Load configs
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDb();

// Create express app
const app = express();

// Setup middleware

// Add logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set handlebars as the view engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

// Set hosting port
const PORT = process.env.PORT || 3000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}. ` +
                `http://localhost:${PORT}.`));
