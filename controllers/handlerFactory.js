
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('./../utils/apiFeatures');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
   
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.updateOne = Modal => catchAsync(async (req, res, next) => {
    // the save middleware won't run if you use findByIdAndUpdate
    const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        data:doc
      }
    });
});

exports.createOne = Modal => catchAsync(async (req, res, next) => {
    const doc = await Modal.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        data:doc
      }
    });
});

exports.getOne = (Modal,popOptions) => catchAsync(async (req, res, next) => {

  let query = Modal.findById(req.params.id);
  if(popOptions) query = query.populate(popOptions);

  const doc = await query;

  if (!doc) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data:doc
    }
  });
});

exports.getAll = Modal => catchAsync(async (req, res, next) => {

  // To allow for nested GET reviews on tour(hack)
  let filter = {};
  if(req.params.tourId){
      filter = {tour: req.params.tourId};
  }


  const features = new APIFeatures(Modal.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data:doc
    }
  });
});



