const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

//Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

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
    {useUnifiedTopology: true, useNewUrlParser: true},
    () => {console.log("Database connected");
});
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;
app.listen(3000);