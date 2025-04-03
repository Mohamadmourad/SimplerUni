const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports.getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id || null; 
    } catch (err) {
        console.error("JWT verification error:", err);
        return null; 
    }
};

module.exports.getEmailDomain = (email)=> {
    return email.split('@')[1];
}

module.exports.hashText = async (text) => {
    const saltRounds = 5;
    return await bcrypt.hash(text, saltRounds);
}

module.exports.compareHashedText = async (plainText, hashedText) => {
    return await bcrypt.compare(plainText, hashedText);
};

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

