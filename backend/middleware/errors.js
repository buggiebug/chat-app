const ErrorHandler = require("../utils/errorHandler");
const errors = (err,req,res,next)=>
{
    err.message     =    err.message    || 'Internal server error bsdka';
    err.statusCode  =    err.statusCode || 500; 

    //  JWT Error
    if(err.name === 'JsonWebTokenError')
    {
        err = new ErrorHandler('Invalid JWT token, Try again',400);
    }
        
    return res.status(err.statusCode).json({success:false,message:err.message});
}

module.exports = errors;