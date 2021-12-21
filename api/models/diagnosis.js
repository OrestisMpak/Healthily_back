// Diagnosis schema
const mongoose = require('mongoose');

/*
  The model for the diagnosis
  includes userId which shows to what user it belongs,
  disease, doctor which is not required and date
*/
const diagnosisSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    disease: {type: String, required: true},
    doctor: {type: String},
    date: {type: String, required: true}
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);