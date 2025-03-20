const jwt = require('jsonwebtoken');

module.exports.createToken = (id, maxAge) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: maxAge,
    });
};

module.exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { id: decoded.id, expired: false };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { id: null, expired: true };
        }
        return { id: null, expired: false, error: 'Invalid token' };
    }
};