import express from 'express';
import { fetchAllNewController, forInterviewController, rejectController } from '../controllers/newControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { newGeneralLimiter, newWriteLimiter } from '../middleware/rateLimiter/newRateLimiter.js';

const newRouter = express.Router();

// REJECT
newRouter.put('/reject/:applicantId', newWriteLimiter, authenticateAdminJWT, rejectController);

// FETCH ALL NEW
newRouter.get('/fetchAll/', newGeneralLimiter, authenticateAdminJWT, fetchAllNewController);

// FOR INTERVIEW
newRouter.put('/forInterview/:applicantId', newWriteLimiter, authenticateAdminJWT, forInterviewController);


export default newRouter;
