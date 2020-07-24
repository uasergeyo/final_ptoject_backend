const jwt = require('jsonwebtoken');
const secret = require('../constants/salt')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    //   const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, secret);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    } else {
        req.isAuth = true;
        req.userId = decodedToken.id;
        next();
    }
};
