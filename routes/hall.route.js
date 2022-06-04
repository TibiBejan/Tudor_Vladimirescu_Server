import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware'
import { createHall, updateHall, deleteHall, getHalls, getHallById } from '../controller/hall.controller';
import { protect, restrictTo } from '../controller/auth.controller';
import { createHallSchema, updateHallSchema } from '../schema/hall.schema';

// =================== Define Router =================== //
const hallRouter = Router();

// =================== Routes =================== //
hallRouter.get('/all', getHalls);
hallRouter.get('/:hall_name', getHallById);

// =================== Apply Middlewares =================== //
hallRouter.use(protect, restrictTo('admin'));
// =================== Routes =================== //
hallRouter.post('/', createHallSchema, validateRequest, createHall);
hallRouter.patch('/:hall_name', updateHallSchema, validateRequest, updateHall);
hallRouter.delete('/:hall_name', deleteHall);

export default hallRouter;