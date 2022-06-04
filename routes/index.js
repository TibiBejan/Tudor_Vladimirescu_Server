// =================== Modules Imports =================== //
import { Router } from 'express';

// =================== Routes Imports =================== //
import userRouter from './user.route';
import accommodationRouter from './accommodation.route';
import adminRouter from './admin.route';
import authRouter from './auth.route';
import hallRouter from './hall.route';
import hallStaffRouter from './hallStaff.route';
import relativesRouter from './relatives.route';
import universityRouter from './university.route';
import studentRouter from './student.route';

// =================== Define Global Router =================== //
const router = Router();

// =================== Test Route for Connection Status =================== //
router.get('/status', (req, res) => {
    res.json({
        message: 'OK',
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
    });
});

// =================== Use imported routes with Global Router =================== //
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/accommodation', accommodationRouter);
router.use('/student', studentRouter);
router.use('/hall', hallRouter);
router.use('/hallStaff', hallStaffRouter)
router.use('/university', universityRouter);
router.use('/relatives', relativesRouter);

export default router;