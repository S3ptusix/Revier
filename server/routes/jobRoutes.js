import express from 'express';
import { createJobController, deleteJobController, editJobController, editJobStatusController, fetchJobTotalController, jobPostingController, readAllJobArchiveController, readAllJobController, readOneJobController, restoreJobController } from '../controllers/jobControllers.js';
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

// EDIT JOB
jobRouter.put('/edit/:jobId', authenticateAdminJWT, editJobController);

// EDIT JOB STATUS
jobRouter.put('/status/edit/:jobId', authenticateAdminJWT, editJobStatusController);

// FETCH JOB TOTALS
jobRouter.get('/totals', authenticateAdminJWT, fetchJobTotalController);

// READ ALL JOB ARCHIVE
jobRouter.get('/archive/readAll', authenticateAdminJWT, readAllJobArchiveController);

// RESTORE JOB
jobRouter.put('/restore/:jobId', authenticateAdminJWT, restoreJobController);

export default jobRouter;