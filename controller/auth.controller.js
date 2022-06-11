import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatus from "http-status";
import dbModels from '../models';
import AppError from '../utils/appError';
import createToken from '../utils/token';
import sendEmail from '../utils/email';
import {config} from 'dotenv';
config();

// Extract models from db export
const { User, Token } = dbModels;

export const signUp = async (req, res, next) => {
    try {
        let { first_name, last_name, email, password } = req.body;
        const existedUser = await User.findOne({where: { email: email }});

        if(existedUser) {
            return res.status(500).json({
                status: httpStatus[500],
                message: "E-mail is already taken, please try again with another one",
            });
        }
        // HASH PASSWORD
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
        });

        // CREATE TOKEN FOR REGISTERED USER
        createToken(newUser, 201, "User created!", res);
    }
    catch(err) {
        return res.status(500).json({
            status: httpStatus[500],
            message: "Internal Server Error - Please try again...",
            err: process.env.NODE_ENV === 'development' ? err : null
        });
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    // CHECK IF EMAIL AND PASSWORD EXISTS
    if(!email || !password) {
        return next(new AppError("Please provide email and password, then try again...", 400));
    }
    try {  
        // CHECK IF USER EXISTS && PASSWORD / EMAIL IS CORRECT
        const user = await User.findOne({ 
            where: { email: email }
        });
        if(!user || (!await user.checkPwdValidation(password, user.password))) {
            return next(new AppError("Incorect email or password, please try again...", 401));
        }
        // IF EVERYTHING IS OK, SEND JWT TOKEN TO CLIENT
        createToken(user, 201, "User logged in!", res);
    }
    catch(err) {
        return res.status(500).json({
            status: httpStatus[500],
            message: "Internal Server Error - Please try again...",
            err: process.env.NODE_ENV === 'development' ? err : null
        });
    } 
}

export const checkLogin = async (req, res, next) => {
    // GET THE JWT TOKEN AND CHECK IT
    if( req.cookies.jwt ) {
        if(!req.cookies.jwt) {
            return next(new AppError("You are not logged in, please login to get access...", 401));
        }
        const tokenMatch = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_DATE
        });
        // CHECK IF USER STILL EXISTS
        const user = await User.findOne({ where: { id: tokenMatch.id } });

        if(!user) {
            return next(new AppError("Session expired, please log in again.", 401));
        }
        // CHECK IF USER CHANGED PASSWORD AFTER JWT TOKEN WAS GENERATED
        const isChanged = user.changedPwdAfterCheck(tokenMatch.iat);
        // ACCES FORBIDDEN
        if(isChanged) {
            return next(new AppError("User recently changed password, please log in again!", 401));
        }
        createToken(user, 200, "Token verified!", res);
    }
}

export const logout = async (req, res, _) => {
    res.cookie('jwt', 'User Logged Out', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
        secure: false,
    });

    res.status(200).json({
        status: 'success',
        message: 'User Logged Out'
    });
}

export const protect = async (req, res, next) => {
    let token = null;
    // GET THE JWT TOKEN AND CHECK IT
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }  else if ( req.cookies.jwt ) {
        token = req.cookies.jwt;
    }

    if(!token) {
        return next(new AppError("You are not logged in, please login to get access...", 401));
    }

    // VALIDATE JWT TOKEN
    try{
        const tokenMatch = jwt.verify(token, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_DATE
        });

        // CHECK IF USER STILL EXISTS
        const user = await User.findOne({ where: { id: tokenMatch.id } });

        if(!user) {
            return next(new AppError("The user belonging to this token does no longer exists.", 401));
        }

        // CHECK IF USER CHANGED PASSWORD AFTER JWT TOKEN WAS GENERATED
        const isChanged = user.changedPwdAfterCheck(tokenMatch.iat);

        // ACCES FORBIDDEN
        if(isChanged) {
            return next(new AppError("User recently changed password, please log in again!", 401));
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        // PASS THE USER WITH JWT TOKEN TO THE NEXT MIDDLEWEAR
        req.user = user;
        next();
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "Invalid signature: JWT TOKEN, please log in again...",
        });
    }
}

export const restrictTo = (...roles) => {
    return async (req, res, next) => {
        // CHECK ROLES AND PERMISSION OF THE USER SENT BT PREV MIDDLEWEAR
        if(!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action...", 403));
        }
        next();
    }
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        // GET USER BASED ON POSTED EMAIL
        const user = await User.findOne({ where: { email: email } });
        if(!user) {
            return next(new AppError("The email does not exists.", 401));
        }
        // GENERATE A RANDOM TOKEN
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_PWD_TOKEN
        });
        const expirationDate = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

        const resetPwdToken = await Token.create({ 
            userId: user.id,
            reset_token: resetToken,
            token_generated_at: new Date(Date.now()).toUTCString(),
            token_expiration_date: expirationDate
        });

        // SEND BACK AS EMAIL
        const resetURL = `${req.protocol}://127.0.0.1:3000/reset-password/${resetPwdToken.reset_token}`;
        const message = `Forgot your password? Submit a request with your new password and password confirm to: ${resetURL}\nIf you did not perform this request, please ignore this e-mail!`;

        try{
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token is valid for 60 minutes.',
                message: message
            });
            return res.status(200).json({
                status: "success",
                message: "Token sent to e-mail!",
                resetToken
            });
        }
        catch(err) {
            return next(new AppError("The request can not be resolved, please try again...", 500));
        }
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again...",
        });
    }
}

export const resetPassword = async (req, res, next) => {
    // GET THE USER BASED ON TOKEN
    try {
        const hashedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_PWD_TOKEN
        });
        const user = await User.findOne({where: { id: hashedToken.id }});
        if(!user) {
            return next(new AppError("Token is invalid or has expired...", 400));
        }
        // IF TOKEN HAS NOT EXPIRED, USER EXISTS THEN SET NEW PASSWORD
        // HASH PASSWORD
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        user.password_changed_at = new Date(Date.now()).toUTCString();
        await user.save();
        // LOG THE USER IN, SEND JWT TO CLIENT
        createToken(user, 200, "Password updated!", res);
    }
    catch(err) {
        return res.status(400).json({
            status: err.name,
            message: `${err.message} at ${err.expiredAt}`
        });  
    }
}