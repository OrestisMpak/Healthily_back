// Users logic controllers
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
  User creating functionality
  checks first if there is email conflict
  409 -> existing email
  checks then if there is amka conflict
  409 -> existing amka
  encrypts password with bcrypt and salting
  and creates new user with the body fields given
  201 -> successful creation
  500 -> internal error
*/
exports.users_create_user = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({message: 'Email already exists'});
            }
            else {            
                User.find({amka: req.body.amka})
                    .exec()
                    .then(user => {
                        if (user.length > 0) {
                            return res.status(409).json({message: 'AMKA already exists'});
                        }
                        else {
                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({error: err});
                                }
                                else {
                                    const user = new User({
                                        _id: new mongoose.Types.ObjectId(),
                                        lastName: req.body.lastName,
                                        firstName: req.body.firstName,                            
                                        amka: req.body.amka,                          
                                        email: req.body.email,
                                        password: hash,
                                        doctor: req.body.doctor,
                                        address: req.body.address,
                                        blood: req.body.blood
                                    });
                                    user.save()
                                        .then(result => {
                                            res.status(201).json({
                                                message: 'User created'
                                            });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                error: err
                                            });
                                        });   
                                }
                            })
                        }
                    })
                }
            })    
}

/*
  User login functionality
  checks if amka exists
  401 -> amka does not exist
  compares the passwords
  401 -> error on compare
  creates and returns jsonwebtoken that contains
  firstName, lastName and email and also userId 
  firstName, lastName, email, amka, doctor, address 
  and blood type information to the front-end
  expires in 3 hours
  200 -> successful login
  401 -> wrong password
*/
exports.users_login_user = (req, res, next) => {
    User.find({amka: req.body.amka})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({message: 'Authentication failed'});
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({message: 'Authentication failed'});
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            firstName: user[0].firstName,
                            lastName: user[0].lastName,
                            email: user[0].email                           
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: '3h'
                        }
                    )
                    console.log(token);
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token,
                        userId: user[0]._id,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        email: user[0].email,
                        amka: user[0].amka,
                        doctor: user[0].doctor,
                        address: user[0].address,
                        blood: user[0].blood 
                    });
                }
                return res.status(401).json({message: 'Authentication failed'});
            })
        }) 
}

/*
  User delete functionality
  searches by userId provided on the link
  404 -> user not found
  200 -> successful delete
  500 -> internal error
*/
exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(user => {
            if(!user) {
                return res.status(404).json({message: 'User not found'});   
            }
            else {
                User.remove({_id: id})
                    .exec()
                    .then(result => {
                        res.status(200).json({message: 'User deleted'})
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