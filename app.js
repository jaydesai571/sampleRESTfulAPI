const express = require('express');

const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
//Middlewares


//ROUTES
app.get('/', (req,res) => {
    res.send('We are on home');
});

app.get('/posts', (req,res) => {
    res.send('We are on post');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log("Database connected");
});
app.listen(3000);