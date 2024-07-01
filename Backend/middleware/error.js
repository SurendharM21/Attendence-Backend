const errorhandler =require("../utils/errorhandler")

module.exports =(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message = err.message || "Internal  Error";

    //Mongo db id cast error    
    if (err.name === 'CastError') {
            err= new errorhandler("Invalid Mongodb id", 404);
        } 
    
    res.status(err.statusCode).json({
        success: false,
        message:err.message,
    })
};

