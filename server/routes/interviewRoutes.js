import express from 'express';
import {
    bulkFailedInterviewController,
    bulkForOrientationController,
    failedInterviewController,
    fetchAllInterviewsController,
    fetchOneInterviewsController,
    forOrientationController,
    rescheduleInterviewController
} from '../controllers/interviewController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const interviewRouter = express.Router();

// FETCH ALL INTERVIEWS
interviewRouter.get('/fetchAll', authenticateAdminJWT, fetchAllInterviewsController);

// FETCH ONE INTERVIEW
interviewRouter.get('/fetchOne/:applicantId', authenticateAdminJWT, fetchOneInterviewsController);

// FAILED INTERVIEW
interviewRouter.put('/failed/:applicantId', authenticateAdminJWT, failedInterviewController);

// RESCHEDULE INTERVIEW
interviewRouter.put('/reschedule/:applicantId', authenticateAdminJWT, rescheduleInterviewController);

// FOR ORIENTATION
interviewRouter.put('/forOrientation/:applicantId', authenticateAdminJWT, forOrientationController);

// BULK FOR ORIENTATION
interviewRouter.put('/bulkForOrientation/:orientationId', authenticateAdminJWT, bulkForOrientationController);

// BULK FAILED INTERVIEW
interviewRouter.put('/bulkFailedInterview', authenticateAdminJWT, bulkFailedInterviewController);

export default interviewRouter;