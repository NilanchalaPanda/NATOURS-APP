const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please tell your name!']
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlenght: 8
    },
    passwordConfirm:{
        type: String, 
        required: [true, 'Please confirm your password'],
    },
    photo:{
        type: String,
        // default:'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/_
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;