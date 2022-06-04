import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware.js'
import { 
    signUp,
    login,
    checkLogin,
    logout,
    forgotPassword,
    resetPassword
} from '../controller/auth.controller.js';
import { 
    registerSchema, 
    loginSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema
} from '../schema/auth.schema.js';


// =================== Define Router =================== //
const authRouter = Router();

// =================== Routes =================== //
authRouter.post('/register', registerSchema, validateRequest, signUp);
authRouter.post('/login', loginSchema, validateRequest, login);
authRouter.get('/login', checkLogin);
authRouter.post('/forgot-password', forgotPasswordSchema, validateRequest, forgotPassword); //not working
authRouter.patch('/reset-password/:token', resetPasswordSchema, validateRequest, resetPassword); //not working
authRouter.get('/logout', logout);

export default authRouter;