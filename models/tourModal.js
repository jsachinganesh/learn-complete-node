const mongoose = require('mongoose');
const tourSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'A tour must have name'],
            unique:true
        },
        rating:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }

    }
);

const Tour = new mongoose.model('Tour',tourSchema);

module.exports = tour;

