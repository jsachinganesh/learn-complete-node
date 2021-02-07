const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { default: validator } = require('validator');
const tourSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'A tour must have name'],
            unique:true,
            trim:true,
            maxlength:[70,'A tour must have less than or equal to 70'],
            minlength:[4,'A tour must have min 4 length'],
            // validator:[validator.isAlpha,'A tour name must contain only']
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
            required:[true,'A tour must have a group difficulty'],
            enum:{
                values:['easy','medium','difficulty'],
                message:'Options are this easy, medium, difficulty'
            }
        },
        ratingsAverage:{
            type:Number,
            default:4.5,
            min:[1,'A rating must have min 1'],
            max:[5,'A rating must have less or equal to 5']
        },
        ratingQuantity:{
            type:Number,
            default:0
        },
        price:{
            type:Number,
            required:true
        },
        priceDiscount:{
            type:Number,
            validate: {
                validator:function(val){
                    return val<this.price;
                },
                message:'priceDiscount ({VALUE}) should be less than price'
            }
        },
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
            default:Date.now(),
            select:false
        },
        startDates:[Date],
        slug:String,
        secretTour:{
            type:Boolean,
            default:false
        },
        

    },{
        toJSON:{virtuals: true},
        toObject:{virtuals: true}
        
    }
);


tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
});

tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    next();
});
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
    next();
});

const Tour = new mongoose.model('Tour',tourSchema);

module.exports = Tour;

