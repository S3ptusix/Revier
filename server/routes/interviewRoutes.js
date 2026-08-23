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
import { interviewBulkLimiter, interviewGeneralLimiter, interviewWriteLimiter } from '../middleware/rateLimiter/interviewRateLimiter.js';

const interviewRouter = express.Router();

// FETCH ALL INTERVIEWS
interviewRouter.get('/fetchAll', interviewGeneralLimiter, authenticateAdminJWT, fetchAllInterviewsController);

// FETCH ONE INTERVIEW
interviewRouter.get('/fetchOne/:applicantId', interviewGeneralLimiter, authenticateAdminJWT, fetchOneInterviewsController);

// FAILED INTERVIEW
interviewRouter.put('/failed/:applicantId', interviewWriteLimiter, authenticateAdminJWT, failedInterviewController);

// RESCHEDULE INTERVIEW
interviewRouter.put('/reschedule/:applicantId', interviewWriteLimiter, authenticateAdminJWT, rescheduleInterviewController);

// FOR ORIENTATION
interviewRouter.put('/forOrientation/:applicantId', interviewWriteLimiter, authenticateAdminJWT, forOrientationController);

// BULK FOR ORIENTATION
interviewRouter.put('/bulkForOrientation/:orientationId', interviewBulkLimiter, authenticateAdminJWT, bulkForOrientationController);

// BULK FAILED INTERVIEW
interviewRouter.put('/bulkFailedInterview', interviewBulkLimiter, authenticateAdminJWT, bulkFailedInterviewController);

export default interviewRouter;
