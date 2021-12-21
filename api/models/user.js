// User schema
const mongoose = require('mongoose');

/*
  The model for the user which
  includes first and last name,
  email that is unique in the database accepts
  viable emails, amka that is unique in the
  database and accepts only numbers, password
  and inluded but not required doctor,
  address and blood type
*/

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lastName: {type: String, required: true},
    firstName: {type: String, required: true},
    email: {
        type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    amka: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]+$/
    },
    password: {type: String, required: true},
    doctor: {type: String},
    address: {type: String},
    blood: {type: String}
});

module.exports = mongoose.model('User', userSchema);