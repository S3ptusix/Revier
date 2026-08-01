import express from 'express';
import { fetchAllNewController, forInterviewController, rejectController } from '../controllers/newControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const newRouter = express.Router();

// REJECT
newRouter.put('/reject/:applicantId', authenticateAdminJWT, rejectController);

// FETCH ALL NEW
newRouter.get('/fetchAll/', authenticateAdminJWT, fetchAllNewController);

// FOR INTERVIEW
newRouter.put('/forInterview/:applicantId', authenticateAdminJWT, forInterviewController);


export default newRouter;