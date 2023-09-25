////// THIS IS FOR THE CODE THAT IS SPECIFIC FOR THE EXPRESS.

const express = require("express");
const morgan = require("morgan");
// const bodyParser = require("body-parser");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//*** MIDDLEWARES FROM EXPRESS ***//
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// CUSTOM MIDDLEWARES : 
app.use((req, res, next) => {
    // console.log("Hello World from the middleware 👋🏻");
    next();
});
 
/* MY CODE */
/////***** ROUTES ******//////

//*** GET request to fetch ALL Data ***//
// app.get("/api/v1/tours", getAllTours);

//*** GET request to fetch SINGLE Data ***//
// app.get("/api/v1/tours/:id", getTour);

//*** POST request to put Data ***//
// app.post("/api/v1/tours", createTour);

//*** PATCH request to put Data ***//
// app.patch("/api/v1/tours/:id", updateTour);

//*** DELETE request to put Data ***//
// app.delete("/api/v1/tours/:id", deleteTour);

// BETTER WAY ..... inside tourRoutes && userRoutes files.

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;