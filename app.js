const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
// the express is function when your assign express to app. Now that app will get all express methods
const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname,"public")));

app.use(helmet());
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({extended:true,limit:'10kb'}));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use(hpp({
    whitelist:[
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'rating',
      'maxGroupSize',
      'price'
    ]
}));

app.use(compression());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')); 
} 

const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many req from this IP. Please try again in a hour or two'
});

app.use('/api',limiter);



app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

app.use((req,res,next)=>{
    res.set({
      'Content-Security-Policy': `default-src 'self' http: https:;block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data: blob:;object-src 'none';script-src 'self' https://api.mapbox.com https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval';script-src-elem https: http: ;script-src-attr 'self' https://api.mapbox.com https://cdn.jsdelivr.net 'unsafe-inline';style-src 'self' https://api.mapbox.com https://fonts.googleapis.com 'unsafe-inline';worker-src 'self' blob:`
      });
    next();
})

app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  

app.use(globalErrorHandler)


module.exports = app;