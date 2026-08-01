import express from 'express';
import {
    failedInterviewController,
    forOrientationController,
    rescheduleInterviewController
} from '../controllers/interviewController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const interviewRouter = express.Router();

// FAILED INTERVIEW
interviewRouter.put('/failed/:applicantId', authenticateAdminJWT, failedInterviewController);

// RESCHEDULE INTERVIEW
interviewRouter.put('/reschedule/:applicantId', authenticateAdminJWT, rescheduleInterviewController);

// FOR ORIENTATION
interviewRouter.put('/forOrientation/:applicantId', authenticateAdminJWT, forOrientationController);

export default interviewRouter;