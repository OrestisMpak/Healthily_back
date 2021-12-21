// Prescription schema
const mongoose = require('mongoose');

/*
  The model for the prescription
  includes userId which shows to what user it belongs,
  medicine, doctor which is not required and date
*/
const prescriptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    medicine: {type: String, required: true},
    doctor: {type: String},
    date: {type: String, required: true}
});

module.exports = mongoose.model('Prescription', prescriptionSchema);