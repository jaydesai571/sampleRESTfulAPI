const router = require('express').Router();
const bodyParser = require('body-parser');
const { func } = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exists } = require('../models/User');
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');

var urlencodedParser = bodyParser.urlencoded({extended:false});

router.post('/register', async(req,res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking for the Email already exisit or not.
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exisit');
    // Hashing the pasword using the bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', urlencodedParser, async(req,res) => {
    const {error} = loginValidation(req.body.form);
    console.log(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking for the Email already exisit or not.
    const user = await User.findOne({ email: req.body.exampleInputEmail1 });
    console.log(user);
    if(!user) return res.status(400).send('Email or password is invalid!!!');
    //Password checking with bcrypt
    const validPass = await bcrypt.compare(req.body.exampleInputPassword1, user.password);
    if (!validPass) return res.status(400).send('Email or password is invalid!!');
    console.log(validPass);
    //create and sign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    res.send('Logged IN');
});

module.exports = router;