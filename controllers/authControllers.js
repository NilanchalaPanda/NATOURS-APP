const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
    // 1- Create user object from request body
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    // console.log(req.body);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });


    res.status(201).json({
        status: 'success',
        TOKEN: token,
        data: {
            user: newUser
        }
    });
});

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    //1) Check if email/password exists.
    console.log(!email || !password);
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    //2) Check if user exits && password is correct.
    const user = User.findOne({ email }).select("+password")



    //3) If okay, send token.
    const token = '';
    res.status(200).json({
        status: 'success',
        token
    })
}

