const mongoose = require('mongoose');
const tourSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'A tour must have name'],
            unique:true,
            trim:true
        },
        duration:{
            type:Number,
            required:[true,'A tour must have duration' ]
        },
        maxGroupSize:{
            type:Number,
            required:[true,'A tour must have a group size']
        },
        difficulty:{
            type:String,
            required:[true,'A tour must have a group difficulty']
        },
        ratingsAverage:{
            type:Number,
            default:4.5
        },
        ratingQuantity:{
            type:Number,
            default:0
        },
        price:{
            type:Number,
            required:true
        },
        priceDiscount:Number,
        summery:{
            type:String,
            trim:true
        },
        description:{
            type:String,
            trim:true,
            required:[true,'A tour must have a group description']
        },
        imageCover:{
            type:String,
            required:[true,'A tour must have a cover image']
        },
        images:[String],
        createdAt: {
            type:Date,
            default:Date.now()
        },
        startDates:[Date]

    }
);

const Tour = new mongoose.model('Tour',tourSchema);

module.exports = Tour;

