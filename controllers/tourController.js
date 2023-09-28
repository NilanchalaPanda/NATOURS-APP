// const fs = require("fs");
const Tour = require('./../models/tourModels');  

exports.alisaTopTour = (req, res, next) => {
    // PRE FILLIG THE QUERY FOR THE USER
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

class APIFeatures {}

exports.getAllTours = async (req, res) => {

    try{
        // BUILDING QUERY :

        // 1) FILTERING :
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach(el => delete queryObj[el]);

        // console.log(req.query);
        
        // SAME AS FIRST WAY :
        // const tours = await Tour.find(queryObj);

        //  ONE WAY OF FILTERING DATA :
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });

        // ANOTHER way of filtering Data : 
        // const tours = await Tour.find()
        //     .where("duration")
        //     .equals(5)
        //     .where("difficulty")
        //     .equals("easy")

        /* ***************************** */
        // TO IMPLEMENT DIFFERENT FUNCTIONALITIES LIKE SORTING, PAGINATION ETC.

        // 2) Advanced Filtering :
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` )
        // console.log('Query String :')
        // console.log(JSON.parse(queryStr));
        // console.log(queryStr) 
        // console.log(req.query)

        let query = Tour.find(JSON.parse(queryStr));
 
        /* ****** */

        // 3) SORTING 
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(' ');
            // console.log(sortBy);
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createAt');
        }


        // 4) FIELD LIMITING DATA
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }

        // console.log(req.query);
        // console.log(req.query.fields);
        

        // 5) PAGINATION 

        const page = (req.query.page * 1)  || 1
        const limit = (req.query.limit * 1) || 8;
        const skip = (page - 1)*limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) {
                // This will immediately skip it to then next block and will go into the catch block.
                throw new Error("This page doesnot exist");
            }
        }

        // FINAL STEP ------> Execute query <------
        console.log(req.query);

        const tours = await query;

        // SENDING RESPONE :
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

exports.getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.3 } }
            },
            {
                $group: {
                    _id: "medium",
                    numTours : { $sum: 1 },
                    numRatings : { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: { 
                stats
            },
        });
    }

    catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err
        })
    }
}
