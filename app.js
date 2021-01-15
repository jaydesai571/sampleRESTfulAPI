const express = require('express');

const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

//Middlewares
const postRoute = require('./routes/posts');
app.use('/posts', postRoute);

//ROUTES
app.get('/', (req,res) => {
    res.send('We are on home');
});

app.get('/post', (req,res) => {
    res.send('We are on the post');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log("Database connected");
});
app.listen(3000);