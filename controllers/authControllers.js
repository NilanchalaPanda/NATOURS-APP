const User = require('./../models/userModels');

exports.singup = async ( res, req, next ) => {
    try{
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data:{
                user: newUser
            }
        })
    }
    catch(err) {
        res.status(400).json({
            status: 'Fail',
            message: err
        })
    }
}

