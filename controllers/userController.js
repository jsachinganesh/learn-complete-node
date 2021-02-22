const User = require('../models/userModal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory'); 

const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//     destination:(req,file,cb) => {
//         cb(null,'public/img/users');
//     },
//     filename:(req,file,cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new AppError('This is not an image! Please upload Image',400),false);
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

exports.uploadUsersPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req,res,next) => {
    if(!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users//${req.file.filename}`);

    next();
})


function filterObj(obj,...restArgs){
    const newObj = {};
    Object.keys(obj).forEach((el)=>{
      if(restArgs.includes(el)) newObj[el] = obj[el];
    });
  
    return newObj;
}


exports.getAllUsers = handlerFactory.getAll(User);

exports.updateMe = catchAsync(async (req,res,next) => {
    // console.log(req.file);
    // console.log(req.body);

    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for passwordUpdate, Please use /updateMyPassword',400));
    }

    const filteredBody = filterObj(req.body,'name','email');
    if(req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user._id,filteredBody,{new:true,runValidators:true});

    res.status(200).json({
        status:'success',
        data:{user:updatedUser}
    });
});

exports.deleteMe = catchAsync(async (req,res,next) => {
    await User.findByIdAndUpdate(req.user.id,{active:false});
  
    res.status(204).json({ //204 means deleted. But here we are not deleting the user doc but updating active to false
      status:'success',
      data:null
    });
});

// exports.createUser = handlerFactory.createOne(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
};


