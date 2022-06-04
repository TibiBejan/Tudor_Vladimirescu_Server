import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware'
import { updateMe, updatePwdSchema } from '../schema/user.schema';
import { createEnrollmentSchema, updateEnrollmentSchema } from '../schema/enrollment.schema';
import { 
    getEnrollment,
    createEnrollment,
    updateEnrollemnt,
    deleteEnrollment,
    allocateStudent,
    updatePassword,
    updateProfile,
    deleteProfile
} from '../controller/user.controller'
import { protect, restrictTo } from '../controller/auth.controller';

// =================== Define Router =================== //
const userRouter = Router();

// =================== Apply Middlewares =================== //
userRouter.use(protect);
// =================== Routes =================== //
userRouter.get('/enrollment', getEnrollment); 
userRouter.post('/enrollment', createEnrollmentSchema, validateRequest, createEnrollment);
userRouter.patch('/enrollment/:id', updateEnrollmentSchema, validateRequest, updateEnrollemnt);
userRouter.delete('/enrollment/:id', deleteEnrollment);
userRouter.get('/allocation', allocateStudent); // not implemented

// =================== Apply Middlewares =================== //
userRouter.use(protect, restrictTo('admin', 'student'));
userRouter.patch('/update-password', updatePwdSchema, validateRequest, updatePassword);
userRouter.patch('/update-profile', updateMe, validateRequest, updateProfile);
userRouter.delete('/delete-profile', deleteProfile);

export default userRouter;