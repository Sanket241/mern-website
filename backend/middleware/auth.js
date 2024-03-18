const catchAsyncErrors = require('./CatchsyncError')
const ErrorHander = require('../Utilis/Errorhandler')
const jwt = require('jsonwebtoken')
const User = require('../model/userModels')

exports. isAuthenticatedUser = catchAsyncErrors(async (req, resp, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id);
  
    next();
  });
  
  exports.authorizeRoles = (...roles) => {
    return (req, resp, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };