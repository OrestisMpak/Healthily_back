// Users routing
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
//const checkAuth = require('../middleware/check-auth');

/* 
  Supported routes are post @ /signup that
  creates new user, post @ /login that authenticates
  an existing user, and delete @ /:userId that deletes a user
*/
router.post('/signup', UsersController.users_create_user);

router.post('/login', UsersController.users_login_user);

//Uncomment next line when superusers are implemented. To delete a user do it directly on the database
//router.delete('/:userId', checkAuth, UsersController.users_delete_user);

module.exports = router;