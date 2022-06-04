import { Router } from 'express';
import validateRequest from '../middleware/validateReq.middleware'
import { createHallStaff, updateHallStaff, deleteHallStaff, getHallStaff } from '../controller/hallStaff.controller';
import { protect, restrictTo } from '../controller/auth.controller';
import { createHallStaffSchema, updateHallStaffSchema } from '../schema/hallStaff.schema';

// =================== Define Router =================== //
const hallStaffRouter = Router();

// =================== Routes =================== //
hallStaffRouter.get('/:hallId', getHallStaff); // not working

// =================== Apply Middlewares =================== //
hallStaffRouter.use(protect, restrictTo('admin')); 
// =================== Routes =================== //
hallStaffRouter.post('/', createHallStaffSchema, validateRequest, createHallStaff);
hallStaffRouter.patch('/:hallId', updateHallStaffSchema, validateRequest, updateHallStaff);  // not working
hallStaffRouter.delete('/:hallId', deleteHallStaff);  // not working
 
export default hallStaffRouter; 