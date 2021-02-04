const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');


// the express is function when your assign express to app. Now that app will get all express methods
const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req,res,next)=>{
    console.log("HELLO FROM MIDDLEWARE");
    next();
})
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


module.exports = app;