// const fs = require("fs");
const Tour = require('./../models/tourModels');  

exports.getAllTours = async (req, res) => {

    try{

        console.log(`Parameters : ${req.query}`);

        //  ONE WAY OF FILTERING DATA :
        const tours = await Tour.find({
            "duration": 5,
            "difficulty": 'easy'
        });

        // ANOTHER way of filtering Data : 
        // const tours = await Tour.find()
        //     .where("duration")
        //     .equals(5)
        //     .where("difficulty")
        //     .equals("easy")
    
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: { 
                tours 
            }
        });
    } catch(err) {
        res.status(404).json({
            status: "Fail",
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    try{

        //ALTERNATE : 
        // const tour = await Tour.findOne({ _id: req.params.id })

        // Shorthand that mongoose provided us :)
        const tour = await Tour.findById(req.params.id);
        // console.log(req.params);

        res.status(200).json({
            status: 'success',
            data: {
                tour 
            },
        });
    }catch(err){
        res.status(404).json({
            status: "Fail",
            message: err
        })
    }

}

exports.createTour = async (req, res) => {
    try{
        // const newTour = new Tour({})
        // newTour.save()
    
        const newTour = await Tour.create( req.body );
        // console.log(req.body);
    
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch(err){
        res.status(400).json({
            status: "Fail",
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true    
        })

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch(err){
        res.status(400).json({
            status: "Fail",
            message: "Invalid dataset"
        })
    }
}

exports.deleteTour = async (req, res) => {

    try{

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
                data: null
        })
    }
    catch(err) {
        res.status(404).json({
            status: "Fail",
            message: "Invalid dataset"
        })
    }

    
}
