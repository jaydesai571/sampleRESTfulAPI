const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path =require('path');

//Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
const authRoute = require('./routes/auth');
app.use('/', authRoute);
const postRoute = require('./routes/posts');
app.use('/posts', postRoute);
dotenv.config();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname,'views')));
//ROUTES
app.get('/', (req,res) => {
    res.render('index.html');
});
app.get('/login', (req,res) => {
    res.render('login.html');
});
app.get('/register', (req,res) => {
    res.render('register.html');
});

// app.get('/post', (req,res) => {
//     res.send('We are on the post');
// });

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