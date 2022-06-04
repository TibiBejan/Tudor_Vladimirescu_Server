import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware.js';
import { createRelativesSchema, updateRelativesSchema } from '../schema/relatives.schema.js';
import { getAllRelatives, getRelativesById, createRelatives, updateRelatives, deleteRelatives } from '../controller/relatives.controller.js';
import { protect } from '../controller/auth.controller.js';

// =================== Define Router =================== //
const relativesRouter = Router();

// =================== Apply Middlewares =================== //
relativesRouter.use(protect);
// =================== Routes =================== //
relativesRouter.get('/all', getAllRelatives);
relativesRouter.get('/:id', getRelativesById);
relativesRouter.post('', createRelativesSchema, validateRequest, createRelatives);
relativesRouter.patch('/:id', updateRelativesSchema, validateRequest, updateRelatives);
relativesRouter.delete('/:id', deleteRelatives);


export default  relativesRouter;