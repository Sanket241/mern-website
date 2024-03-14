
 module.exports = (err,req,resp)=>{
    err.message = err.message || "Internal Server Error"; 
    err.statusCode = err.statusCode || 500;

// Wrong mongodb error id
if(err.name === "CastError"){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorResponse(message,404);
}

    resp.status(err.statusCode).json({
        success:false,
        message:err.message
    });
 };