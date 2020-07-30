const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDb();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}. ` +
                `http://localhost:${PORT}.`));
