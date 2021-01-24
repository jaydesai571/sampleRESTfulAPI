const router = require('express').Router();
const bodyParser = require('body-parser');
const { func } = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exists } = require('../models/User');
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const { urlencoded } = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended:false});

router.post('/register', async(req,res) => {
    const {error} = registerValidation(req.body.form);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking for the Email already exisit or not.
    const emailExist = await User.findOne({ email: req.body.exampleInputEmail1 });
    if(emailExist) return res.status(400).send('Email already exisit');
    // checking for th password and confirm pasword are same or not.
    // const passcheck = await compare({ password: req.body.exampleInputPassword1, confirm_password: req.body.exampleInputPassword2 });
    // if(passcheck) return res.status(400).send('Password doesnot match');
    // Hashing the pasword using the bcrypt
    const salt = await bcrypt.genSalt(10);
    const passcheck = await bcrypt.compare(req.body.exampleInputPassword1, req.body.exampleInputPassword2);
    if(!passcheck) return res.status(400).send('password doesnt match');
    const hashedPasword = await bcrypt.hash(req.body.exampleInputPassword1, salt);
    
    const user = new User({
        name: req.body.exampleInputname,
        email: req.body.exampleInputEmail1,
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
    var name = encodeURIComponent(user.name);
    res.header('auth-token', token).render('welcome.html', {name:name});

});

module.exports = router;