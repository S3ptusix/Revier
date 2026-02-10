import express from 'express';
import { createJobController, jobPostingController, readOneJobController } from '../controllers/jobControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const jobRouter = express.Router();

// CREATE JOB 
jobRouter.post('/create', authenticateAdminJWT, createJobController);

// JOB POSTING
jobRouter.get('/jobposting', jobPostingController);

// READ ONE JOB
jobRouter.get('/read/:jobId', readOneJobController);

export default jobRouter;