const mongoose = require('mongoose');

const userSchema = new mongoos.Schema({
    name: {
        type: String,
        required: true,
        min:6
    },
    email:{
        type: String,
        required: true,
        max:255,
        min:6
    },
    password: {
        type: 
    }

});
