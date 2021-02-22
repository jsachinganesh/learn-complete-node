const AppError = require("../utils/appError");

const sendErrorDev = (err,req,res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
          status: err.status,
          error: err,
          message: err.message,
          stack: err.stack
        });
    }

    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
}

const sendErrorProd = (err,req,res) => {
    if (req.originalUrl.startsWith('/api')) {

        if(err.isOperational){ //error we create to handle problems
            return res.status(err.statusCode).json({
                status:err.status,
                message:err.message
            });
        }else{
            // console.error('ERROR BOMMMMMM!!!',err);
            return res.status(500).json({
                status:'error',
                message:'Something went very wrong'
            });
        }
    }

     // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
    
    
}


const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB = (err) => {
    const message = `Duplicate field value ${err.keyValue.name}. Please use another value `;
    return new AppError(message,400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input datas. ${errors.join('. ')}`;
    
    return new AppError(message,400);
}

const handleJWTError = () => {
    return new AppError('Invalid token, Please login again',401); 
}

const handleJWTExpiredError = () => {
    return new AppError('Your token as expired!, Please login again',401); 
}


module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,req,res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err,name:err.name,message:err.message}
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error,req,res);
    }
}