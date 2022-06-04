import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware';
import { createUniversity, updateUniversity, deleteUniversity, getUniversities, getUniversityById } from '../controller/university.controller';
import { protect, restrictTo } from '../controller/auth.controller';
import { createUniversitySchema, updateUniversitySchema } from '../schema/university.schema';

// =================== Define Router =================== //
const universityRouter = Router();

// =================== Apply Middlewares =================== //
universityRouter.use(protect);
// =================== Routes =================== //
universityRouter.get('/all', getUniversities);
universityRouter.get('/:keyword', getUniversityById);

// =================== Apply Middlewares =================== //
universityRouter.use(protect, restrictTo('admin'));
// =================== Routes =================== //
universityRouter.post('/', createUniversitySchema, validateRequest, createUniversity);
universityRouter.patch('/:keyword', updateUniversitySchema, validateRequest, updateUniversity);
universityRouter.delete('/:keyword', deleteUniversity);

export default universityRouter;