import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const signToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET_TOKEN, { expiresIn: process.env.JWT_EXPIRES_DATE });
}

const createToken = (user, statusCode, message, res) => {
    const token = signToken(user.id);
    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV !== 'development' || 'NODE_ENV' !== 'development',
        secure: true,
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
