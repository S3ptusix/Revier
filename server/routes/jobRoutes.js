import express from 'express';
import { createJobController, deleteJobController, jobPostingController, readAllJobController, readOneJobController } from '../controllers/jobControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const jobRouter = express.Router();

// CREATE JOB 
jobRouter.post('/create', authenticateAdminJWT, createJobController);

// JOB POSTING
jobRouter.get('/jobposting', jobPostingController);

// READ ONE JOB
jobRouter.get('/read/:jobId', readOneJobController);

// READ ALL JOB
jobRouter.get('/readAll', authenticateAdminJWT, readAllJobController);

// DELETE JOB
jobRouter.delete('/delete/:jobId', authenticateAdminJWT, deleteJobController);

export default jobRouter;