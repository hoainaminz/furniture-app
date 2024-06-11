const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

module.exports = { authenticateJWT };
