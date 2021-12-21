// Authentication logic
const jwt = require('jsonwebtoken');

/*
  Checks the Authorization header that contains
  Bearer+space+jwt, gets the token with .split,
  verifies it and continues with the call
  403 -> verification failed 
*/
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } 
    catch (error) {
        return res.status(403).json({message: 'Authorization failed!'});
    } 
};