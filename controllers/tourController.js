const fs = require('fs');
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json','utf-8'));

exports.getAllTours = (req,res)=>{
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
    });
}

exports.createTour = (req,res)=>{
    const newID = tours[tours.length-1].id+1;
    const newTour = Object.assign({id:newID},req.body);
    tours.push(newTour);

    fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(tours),(err)=>{
        res.status(201).json({
            status:'success',
            data:{
                tour:newTour
            }
        });
    })

}

exports.getTour = (req,res)=>{

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if(!tour){
        return res.status(404).json({
            status:"success",
            message:"Invalid ID"
        })
    }

    res.status(200).json({
        status:'success',
        createdAt:req.requestTime,
        data:{
            tour:tour
        }
    });
}

exports.updateTour = (req,res)=>{
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if(!tour){
        return res.status(404).json({
            status:"success",
            message:"Invalid ID"
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour:'updated'
        }
    })
}

exports.deleteTour = (req,res)=>{
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if(!tour){
        return res.status(404).json({
            status:"success",
            message:"Invalid ID"
        })
    }

    res.status(204).json({ // 204 delete
        status:'success',
        data:null
    })
}
