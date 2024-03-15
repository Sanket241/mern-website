const ErrorHandler = require('../Utilis/Errorhandler');
const sendToken = require('../Utilis/Jwttoken');
const catchAsyncErrors = require('../middleware/CatchsyncError');
const User = require('../model/userModels');

const registerUser = catchAsyncErrors(async (req, resp) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'avatars/avater-1_jtjxwv',
            url: 'https://res.cloudinary.com/shopit/image/upload/v1606306134/avatars/avater-1_jtjxwv.jpg'
        }
    });

    sendToken(user, 201, resp);
})

const loginUser = catchAsyncErrors(async (req, resp, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if(!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }
    const user = await User.findOne({email}).select('password');
    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
   sendToken(user, 200, resp);


})
module.exports = { registerUser, loginUser }