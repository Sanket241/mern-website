
 module.exports = (err,req,resp)=>{
    err.message = err.message || "Internal Server Error"; 
    err.statusCode = err.statusCode || 500;

// Wrong mongodb error id
if(err.name === "CastError"){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorResponse(message,404);
}

// Duplicate key error
if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorResponse(message,400);
}

// Validation error
if(err.name === "ValidationError"){
    const message = Object.values(err.errors).map(val => val.message);
    err = new ErrorResponse(message,400);
}

if(err.name === "JsonWebTokenError"){
    const message = `Json web token is invalid. Try again!`;
    err = new ErrorResponse(message,404);
}

if(err.name === "TokenExpiredError"){
    const message = `Json web token is expired. Try again!`;
    err = new ErrorResponse(message,404);
}




    resp.status(err.statusCode).json({
        success:false,
        message:err.message
    });
 };