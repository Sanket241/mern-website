const ErrorHandler = require('../Utilis/Errorhandler');
const sendToken = require('../Utilis/Jwttoken');
const catchAsyncErrors = require('../middleware/CatchsyncError');
const User = require('../model/userModels');
const sendEmail = require('../Utilis/sendEmail');
const crypto = require('crypto');
const { send } = require('process');

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

const logoutUser = catchAsyncErrors(async (req, resp) => {
    resp.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    resp.status(200).json({
        success: true,
        message: 'Logged out'
    })
});

const forgotPassword = catchAsyncErrors(async (req, resp, next) => {
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler('User not found with this email',404));
    }
    // Get reset token
    const resetToken = user.getPasswordResetToken();
    await user.save({validateBeforeSave:false});
    const resetUrl = `${req.protocol}://${req.get('host')}/api/data/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    try {
        await sendEmail({
            email:user.email,
            subject:'Shopit Password Recovery',
            message
        });
        resp.status(200).json({
            success:true,
            message:`Email sent to:${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));

    }
});


const resetPassword = catchAsyncErrors(async (req, resp, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400));
    }
    // Setup the new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, resp);
    
});

//Get user details

const getUserDetails = catchAsyncErrors(async (req, resp) => {
    const user = await User.findById(req.user.id);
    resp.status(200).json({
        success:true,
        user
    });
});

const updatePassword = catchAsyncErrors(async (req, resp, next) => {
    const user = await User.findById(req.user.id).select('+password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect',400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, resp);
});

//update user Profile
const updateProfile = catchAsyncErrors(async (req, resp, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // Update avatar: TODO
    // const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    //     new:true,
    //     runValidators:true,
    //     useFindAndModify:false
    // });
    const user = await User.findByIdAndUpdate (req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    sendToken(user, 200, resp);
    resp.status(200).json({
        success:true
    });
});

//get all users (admin)
const getAllUsers = catchAsyncErrors(async (req, resp) => {
    const users = await User.find();
    resp.status(200).json({
        success:true,
        users
    });
});

// getsingle user details (admin)
const getSingleUsers = catchAsyncErrors(async (req, resp) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not found with id:${req.params.id}`));
    }
    resp.status(200).json({
        success:true,
        user
    });
});

//update user role (admin)
const updateUserRole = catchAsyncErrors(async (req, resp, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    }
 
    const user = await User.findByIdAndUpdate (req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    sendToken(user, 200, resp);
    resp.status(200).json({
        success:true
    });
});

// delete a user (admin)
const deleteUser = catchAsyncErrors(async (req, resp) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not found with id:${req.params.id}`));
    }
    // Remove avatar from cloudinary - TODO
    // await user.remove();
    resp.status(200).json({
        success:true,
        message:'User deleted successfully'
    });
});



module.exports = { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUsers, deleteUser, updateUserRole}