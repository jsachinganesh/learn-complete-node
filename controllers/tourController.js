const Tour = require('./../models/tourModal');

exports.getAllTours = async (req,res)=>{
    try {

        const queryObj = {...req.query}
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        const query =  Tour.find();

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace with callback

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy)
        }else{
            query.sort('-createdAt')
        }

        const tours = await query.find(JSON.parse(queryStr)).select("name price duration")

        res.status(200).json({
            status:'success',
            results:tours.length,
            data:{
                tours
            }
        });
    } catch (error) {
        res.status(501).json({
            status:'fail',
            message: error
        })
    }
}

exports.createTour = async (req,res)=>{

    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:'success',
            data:newTour
        })
    } catch (error) {
        res.status(501).json({
            status:'fail',
            message: error
        })
    }


}

exports.getTour = async (req,res)=>{

    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        });
    } catch (error) {
        res.status(404).json({
            status:'fail',
            message: error
        });
    }
}

exports.updateTour = async (req,res)=>{
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status:'fail',
            message: error 
        });
    }
}

exports.deleteTour = async(req,res)=>{

    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({ // 204 delete
            status:'success',
            data:null
        });
    } catch (error) {
        res.status(404).json({
            status:'fail',
            message: error.name
        });
    }
}
