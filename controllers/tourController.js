const Tour = require('./../models/tourModal');

exports.getAllTours = async (req,res)=>{
    try {
        const tours = await Tour.find();
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
        })
    }
}

exports.updateTour = (req,res)=>{


    res.status(200).json({
        status:'success',
        data:{
            tour:'updated'
        }
    })
}

exports.deleteTour = (req,res)=>{

    res.status(204).json({ // 204 delete
        status:'success',
        data:null
    })
}
