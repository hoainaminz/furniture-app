const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        const { roleId } = req.user;

        if (!allowedRoles.includes(roleId)) {
            return res.sendStatus(403);
        }

        next();
    };
};
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.sendStatus(403);
    }
};
module.exports = {
    authenticateJWT,
    authorizeRoles,
    isAdmin,
};