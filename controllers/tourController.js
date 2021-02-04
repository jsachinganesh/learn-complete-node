const fs = require('fs');
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json','utf-8'));


exports.checkID = (req,res,next,val)=>{

    if(val*1>tours.length){
        return res.status(404).json({
            status:'success',
            message:"Invalid ID 🐨"
        })
    }

    next();
}


exports.checkBody = (req,res,next) => {
    const {name,price} = req.body;
    console.log(name,price);
    if(!name || !price){ // 400 bad req
        return res.status(400).json({
            status:'success',
            message:'A tour must have price and name'
        });
    }
    next();
}

exports.getAllTours = (req,res)=>{
    res.status(200).json({
        status:'fail',
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

    res.status(204).json({ // 204 delete
        status:'success',
        data:null
    })
}
