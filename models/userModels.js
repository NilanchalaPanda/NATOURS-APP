const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const catchAysnc = require('./../utils/catchAsync');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell your name!']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid EMail ID']
    },
    photo: {
        type: String,
        // default:'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/_
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlenght: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on SAVE not on UPDATE !!
            validator: function (el) {
                // console.log(el); ====> passwordConfirm
                return el === this.password;
            },
            message: 'Passwords are NOTt the same'
        }
    }
})

// PRE SAVE MIDDLEWARE works between the moment we recieve the data and between the moment when it gets saved into the database.
userSchema.pre('save', (async function (next) {
    // Only runs this func is password was actually modified.
    if (typeof this.isModified === 'function' && !this.isModified('password')) {
        return next();
    }

    // Hash the password with cost of 12.
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field from DB.
    this.passwordConfirm = undefined;
    next();
}))





const User = mongoose.model('User', userSchema);

module.exports = User;