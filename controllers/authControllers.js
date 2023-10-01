const User = require('./../models/userModels');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    // 1- Create user object from request body
    const newUser = await User.create(req.body);

    // console.log(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

