const jwt = require('jsonwebtoken');

module.exports.createToken = (adminId, universityId, maxAge) => {
    return jwt.sign({ adminId, universityId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

module.exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { adminId: decoded.adminId, universityId: decoded.universityId, expired: false };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { adminId: null, universityId: null, expired: true };
        }
        return { adminId: null, universityId: null, expired: false, error: 'Invalid token' };
    }
};
