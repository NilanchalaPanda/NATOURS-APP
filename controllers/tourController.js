const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');

exports.alisaTopTour = (req, res, next) => {
    // PRE FILLIG THE QUERY FOR THE USER
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


exports.getAllTours = async (req, res) => {

    try {
        // FINAL STEP ------> Execute query <------
        console.log(req.query);

        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitfields()
            .paginate();
        const tours = await features.query;


        // SENDING RESPONE :
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    try {

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
    } catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err
        })
    }

}

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()

        const newTour = await Tour.create(req.body);
        // console.log(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Invalid dataset"
        })
    }
}

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null
        })
    }
    catch (err) {
        res.status(404).json({
            status: "Fail",
            message: "Invalid dataset"
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.3 } }
            },
            {
                $group: {
                    _id: "$difficulty",
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice : 1 }
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

exports.getMonthPlan = async (req, res) => {
    try{
        const year = req.params.year * 1;
        
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: { 
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStats: { $sum: 1 },
                    tours: { $push: '$name' }
                },
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project:{
                    _id: 0
                }
            },
            {
                $sort: { numTourStats: 1 }
            }, 
            {
                //Sets a limit to the data
                $limit: 12      
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err
        })
    }
}
