import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware.js'
import { 
    getUsersByQuerry,
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updatePwd,
    getAccommodatedUser,
    getStudentNeighbors,
} from '../controller/admin.controller';
import { protect, restrictTo } from '../controller/auth.controller';
import { createUserSchema, updateUserSchema } from '../schema/admin.schema';

// =================== Define Router =================== //
const adminRouter = Router();
// =================== Apply Middlewares =================== //
adminRouter.use(protect, restrictTo('admin'));
// =================== Routes =================== //
adminRouter.get('/users-query', getUsersByQuerry);
adminRouter.get('/users', getAllUsers);
adminRouter.get('/users/:id', getUser);
adminRouter.post('/users', createUserSchema, validateRequest, createUser);
adminRouter.patch('/users/:email', updateUserSchema, validateRequest, updateUser);
adminRouter.delete('/users/:email', deleteUser);
adminRouter.patch('/users/:email/password', validateRequest, updatePwd);
adminRouter.get('/users/accommodated/:id', getAccommodatedUser); // not working
adminRouter.get('/users/neighbors/:id', getStudentNeighbors); // not working

export default adminRouter;