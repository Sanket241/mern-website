
 module.exports = (err,req,resp)=>{
    err.message = err.message || "Internal Server Error"; 
    err.statusCode = err.statusCode || 500;

    resp.status(err.statusCode).json({
        success:false,
        message:err.message
    });
 };