const mongoose = require('mongoose');
const Tour = require('./tourModal');

const reviewSchema = mongoose.Schema(
    {
        review:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            min:0,
            max:5,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        tour:{
            type:mongoose.Schema.ObjectId,
            ref:'Tour',
            required:[true,'Review must belong to a user']
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'Review must belong to a user']
        },

    },
    {
        toJON:{virtual:true},
        toObject:{virtual:true}
    }
);

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'},
            }
        }
    ]);

    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingQuantity:stats[0].nRating,
            ratingsAverage:stats[0].avgRating
        });
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingQuantity:0,
            ratingsAverage:4.5
        });
    }
};

reviewSchema.index({tour:1,user:1},{unique:true});

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next();
});

reviewSchema.post('save',function(){
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.post(/^findOneAnd/,async function(){
    // findOne wont work because query is already exec
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;