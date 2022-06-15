import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware';
import { createStudentMetaSchema, updateStudentMetaSchema } from '../schema/student.schema.js';
import { 
    getStudentMeta,
    createStudentMeta,
    updateStudentMeta,
    deleteStudentMeta
} from '../controller/student.controller';
import { protect } from '../controller/auth.controller.js';

// =================== Define Router =================== //
const studentRouter = Router();

// =================== Apply Middlewares =================== //
studentRouter.use(protect);
// =================== Routes =================== //
studentRouter.get('/profile', getStudentMeta);
studentRouter.post('/profile', createStudentMetaSchema, validateRequest, createStudentMeta);
studentRouter.patch('/profile/:username', updateStudentMetaSchema, validateRequest, updateStudentMeta);
studentRouter.delete('/profile/:username', deleteStudentMeta);

export default studentRouter;