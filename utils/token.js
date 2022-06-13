import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

// GENERATE JWT TOKEN
const signToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_DATE
    });
}

// CREATE TOKEN AND HTTP ONLY COOKIE.
const createToken = (user, statusCode, message, res) => {
    const token = signToken(user);
    // GENERATE HTTP_ONLY COOCKIE FOR CLIENT SIDE
    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production' ? true : false,
        // sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "None",
        path: "/"
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
