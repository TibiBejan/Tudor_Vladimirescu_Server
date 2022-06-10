import jwt from 'jsonwebtoken';
import envVars from '../constants';

// GENERATE JWT TOKEN
const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_DATE
    });
}

// CREATE TOKEN AND HTTP ONLY COOKIE.
const createToken = (user, statusCode, message, res) => {
    const token = signToken(user.id);

    // GENERATE HTTP_ONLY COOCKIE FOR CLIENT SIDE
    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
        secure: envVars.env === 'production' ? true : false,
        sameSite: envVars.env === 'production' ? 'None' : 'Lax'
    });

    return res.status(statusCode).json({
        status: 200,
        message: message,
        data: {
            user,
            token: token
        }
    });
}

export default createToken;
