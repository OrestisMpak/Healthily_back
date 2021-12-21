// Diagnoses logic controllers
const mongoose = require('mongoose');
const Diagnosis = require('../models/diagnosis');
const User = require('../models/user');

/*
  Diagnosis getting functionality
  searches by userId on the headers to show all the
  diagnoses that belong to the user that
  did the call and returns disease,
  doctor and date information
  200 -> success return information
  404 -> no diagnoses for that user
  500 -> internal server error
*/
exports.diagnoses_get_all = (req, res, next) => {
    Diagnosis.find({userId: req.header('userId')})
        .select('disease doctor date')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        disease: doc.disease,
                        doctor: doc.doctor,
                        date: doc.date                        
                    }
                })
            if (docs.length>0){
                res.status(200).json(response);
            }
            else {
                res.status(404).json({message: 'No diagnoses added'}); 
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

/*
  Diagnosis creating functionality
  creates new diagnosis with id, userId,
  disease, doctor and date fields
  checks if given userId exists
  404 -> user does not exist
  201 -> successful creation returns the newly created diagnosis
  500 -> internal server error 
*/
exports.diagnoses_create_diagnosis = (req, res, next) => {
    User.findById(req.body.userId)
        .exec()
        .then(user => {
            if (!user) {
                res.status(404).json({message: 'User does not exist'});
            }
            else {
                const diagnosis = new Diagnosis({
                    _id: new mongoose.Types.ObjectId(),
                    userId: req.body.userId,
                    disease: req.body.disease,
                    doctor: req.body.doctor,
                    date: req.body.date
                });
                diagnosis.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Diagnosis created successfully!',
                            createdDiagnosis: result
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
  Diagnosis getting single functionality
  searches by diagnosisId provided on the link
  200 -> success return single diagnosis
  404 -> diagnosis does not exist
  500 -> internal server error
  Extra functionality for single diagnosis should be added
*/
exports.diagnoses_get_one = (req, res, next) => {
    Diagnosis.findById(req.params.diagnosisId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({diagnosis: doc});
            }
            else {
                res.status(404).json({message: 'Diagnosis does not exist'});
            }            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

/*
  Diagnosis updating functionality
  searches by diagnosisId provided on the link
  404 -> diagnosis does not exist
  401 -> action denied trying to change userId
  200 -> update successful
  500 -> internal server error
*/
exports.diagnoses_update_diagnosis = (req, res, next) => {
    const id = req.params.diagnosisId;
    Diagnosis.findById(id)
        .exec()
        .then(diagnosis => {
            if(!diagnosis) {
                return res.status(404).json({message: 'Diagnosis does not exist'});   
            }
            else {
                const updateOps = {};
                for (const ops of req.body) {
                    updateOps[ops.propName] = ops.value;
                    if (ops.propName === 'userId') {
                       return res.status(401).json({message: 'Action denied'});
                    }
                }
                Diagnosis.updateOne({_id: id}, {$set: updateOps})
                    .exec()
                    .then(result => {
                        res.status(200).json({message: 'Diagnosis updated'});
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
  Diagnosis delete functionality
  searches by diagnosisId provided on the link
  404 -> diagnosis not found
  200 -> successful delete
  500 -> internal error
*/
exports.diagnoses_delete_diagnosis = (req, res, next) => {
    const id = req.params.diagnosisId;
    Diagnosis.findById(id)
        .exec()
        .then(diagnosis => {
            if(!diagnosis) {
                return res.status(404).json({message: 'Diagnosis does not exist'});   
            }
            else {
                Diagnosis.deleteOne({_id: id})
                    .exec()
                    .then(result => {
                        res.status(200).json({message: 'Diagnosis deleted'});
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