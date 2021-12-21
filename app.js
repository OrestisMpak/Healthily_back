// General app logic
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// The main routes of the server
const prescriptionRoutes = require('./api/routes/prescriptions');
const diagnosisRoutes = require('./api/routes/diagnoses');
const userRoutes = require('./api/routes/users');

// Connect to the database with mongoose
mongoose.connect(
    'mongodb+srv://admin:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop.3csjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'    
);
mongoose.Promise = global.Promise;

// Library settings
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization' 
        );
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
});

// Routes and connection error handling
app.use('/prescriptions', prescriptionRoutes);
app.use('/diagnoses', diagnosisRoutes);
app.use('/users', userRoutes);
app.use((req, rep, next) => {
    const error = new Error('Action not supported');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;