// Prescriptions logic controllers
const mongoose = require('mongoose');
const Prescription = require('../models/prescription');
const User = require('../models/user');

/*
  Prescription getting functionality
  searches by userId on the headers to show all the
  prescriptions that belong to the user that
  did the call and returns medicine,
  doctor and date information
  200 -> success return information
  404 -> no prescriptions for that user
  500 -> internal server error
*/
exports.prescriptions_get_all = (req, res, next) => {
    Prescription.find({userId: req.header('userId')})
        .select('medicine doctor date')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        medicine: doc.medicine,
                        doctor: doc.doctor,
                        date: doc.date                        
                    }
                })
            if (docs.length>0){
                res.status(200).json(response);
            }
            else {
                res.status(404).json({message: 'No prescriptions added'}); 
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

/*
  Prescription creating functionality
  creates new prescription with id, userId,
  medicine, doctor and date fields
  checks if given userId exists
  404 -> user does not exist
  201 -> successful creation returns the newly created prescription
  500 -> internal server error 
*/
exports.prescriptions_create_prescription = (req, res, next) => {
    User.findById(req.body.userId)
        .exec()
        .then(user => {
            if (!user) {
                res.status(404).json({message: 'User does not exist'});
            }
            else {
                const prescription = new Prescription({
                    _id: new mongoose.Types.ObjectId(),
                    userId: req.body.userId,
                    medicine: req.body.medicine,
                    doctor: req.body.doctor,
                    date: req.body.date
                });
                prescription.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Prescription created successfully!',
                            createdPrescription: result
                        });
                    })     
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        }); 
}

/*
  Prescription getting single functionality
  searches by prescriptionId provided on the link
  200 -> success return single prescription
  404 -> prescription does not exist
  500 -> internal server error
  Extra functionality for single prescription should be added
*/
exports.prescriptions_get_one = (req, res, next) => {
    Prescription.findById(req.params.prescriptionId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({prescription: doc});
            }
            else {
                res.status(404).json({message: 'Prescription does not exist'});
            }            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

/*
  Prescription updating functionality
  searches by prescriptionId provided on the link
  404 -> prescription does not exist
  401 -> action denied trying to change userId
  200 -> update successful
  500 -> internal server error
*/
exports.prescriptions_update_prescription = (req, res, next) => {
    const id = req.params.prescriptionId;
    Prescription.findById(id)
        .exec()
        .then(prescription => {
            if(!prescription) {
                return res.status(404).json({message: 'Prescription does not exist'});   
            }
            else {
                const updateOps = {};
                for (const ops of req.body) {
                    updateOps[ops.propName] = ops.value;
                    if (ops.propName === 'userId') {
                       return res.status(401).json({message: 'Action denied'});
                    }
                }
                Prescription.updateOne({_id: id}, {$set: updateOps})
                    .exec()
                    .then(result => {
                        res.status(200).json({message: 'Prescription updated'});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

/*
  Prescription delete functionality
  searches by prescriptionId provided on the link
  404 -> prescription not found
  200 -> successful delete
  500 -> internal error
*/
exports.prescriptions_delete_prescription = (req, res, next) => {
    const id = req.params.prescriptionId;
    Prescription.findById(id)
        .exec()
        .then(prescription => {
            if(!prescription) {
                return res.status(404).json({message: 'Prescription does not exist'});   
            }
            else {
                Prescription.deleteOne({_id: id})
                    .exec()
                    .then(result => {
                        res.status(200).json({message: 'Prescription deleted'});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}