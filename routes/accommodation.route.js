import { Router } from 'express';
import { getAccommodatedUser } from '../controller/accommodate.controller';
import { protect } from '../controller/auth.controller';

// =================== Define Router =================== //
const accommodationRouter = Router();

// =================== Apply Middlewares =================== //
accommodationRouter.use(protect);
// =================== Routes =================== //
accommodationRouter.get('/:id', getAccommodatedUser); // not working

export default accommodationRouter;