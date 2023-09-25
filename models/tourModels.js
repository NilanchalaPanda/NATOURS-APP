const mongoose = require("mongoose");

//Creating a SCHEMA & MODEL : 
const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
    },
    duration:{
        type: Number,
        required:[true,"Please enter the Duration of your Tour"]
    },
    maxGroupSize:{
        type: Number,
        required: [true, 'A tour must have maximum group size']
    },
    difficulty:{
        type: String
    },
    ratingsAverage:{
        type: Number,
        default: 4.5
    },
    // Basically Reviews
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: true
    },
    priceDiscount:{
        type: Number
    }, 
    summary:{
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String, 
        trim: true
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    createAt: {
        type: Date,
        default : Date.now()
    },
    startDates: [Date]
})
// MODEL
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;