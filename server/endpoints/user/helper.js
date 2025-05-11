const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.createToken = (userId, universityId) => {
    return jwt.sign({ userId, universityId }, process.env.JWT_SECRET);
};

module.exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { userId: decoded.userId, universityId: decoded.universityId, expired: false };
    } catch (error) {
        return { userId: null, universityId: null, expired: false, error: 'Invalid token' };
    }
};

module.exports.getEmailDomain = (email)=> {
    return "@"+email.split('@')[1];
}

module.exports.hashText = async (text) => {
    const saltRounds = 5;
    return await bcrypt.hash(text, saltRounds);
}

module.exports.compareHashedText = async (plainText, hashedText) => {
    return await bcrypt.compare(plainText, hashedText);
};

module.exports.generateRandomString = () =>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

module.exports.handleErrors = (err) => {
    let errors = { email: '', password: '', username: '' };

    if (err.code === '23505') {
        if (err.detail.includes('email')) {
            errors.email = 'That email is already used';
        }
        if (err.detail.includes('username')) {
            errors.username = 'That username is already in use';
        }
        return errors;
    }

    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    return errors;
};

