const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");


exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
    // const {userawthtoken} = req.headers;
    const {userawthtoken} = req.cookies;

    if(!userawthtoken)
        return next(new ErrorHandler("Login is required.",401));
    const isValidToken = await jwt.verify(userawthtoken,process.env.JWT_SECRET);
    const user = await UserModel.findById(isValidToken.id)
    if(!user)
        return next(new ErrorHandler("Invalid token, user not found.",401));
    else if(!user.isVerifiedUser)
        return next(new ErrorHandler("Invalid token, user not found.",401));
    else if(user.accountStatus)  
        return next(new ErrorHandler("Your account has been blocked.", 401));
    req.user = user;
    next();
})