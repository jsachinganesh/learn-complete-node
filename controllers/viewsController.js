const Tour = require("../models/tourModal");
const User = require("../models/userModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { updatePassword } = require("./authController");

exports.getOverview = catchAsync(async(req,res,next)=>{
    const tours = await Tour.find();

    res.status(200).render('overview',{
        title:'All Tours',
        tours
    });
});

exports.getTour = catchAsync( async(req,res,next)=>{
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
    });

    if(!tour){
        return next(new AppError('There is no tour with that name',404));
    }

    res.status(200).render('tour',{
        title:`${tour.name}`,
        tour
    });
});

exports.getLoginForm = (req,res) => {
    res.status(200).render('login',{
        title:'LogIn'
    });
};

exports.getAccount = (req,res) => {
    res.status(200).render('account',{
        title:'Your Account'
    });
}

// form old way submit with refresh 
exports.updateUserData = catchAsync(async(req,res,next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        email:req.body.email
    },
    {
        new:true,
        runValidators:true
    });

    res.status(200).render('account',{
        title:'Your Account',
        user:updatedUser
    });
})