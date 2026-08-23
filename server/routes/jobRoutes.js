import express from 'express';
import { createJobController, deleteJobController, editJobController, editJobStatusController, fetchJobTotalController, jobPostingController, readAllJobArchiveController, readAllJobController, readOneJobController, restoreJobController } from '../controllers/jobControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { jobGeneralLimiter, jobPublicLimiter, jobWriteLimiter } from '../middleware/rateLimiter/jobRateLimiter.js';

const jobRouter = express.Router();

// CREATE JOB 
jobRouter.post('/create', jobWriteLimiter, authenticateAdminJWT, createJobController);

// JOB POSTING
jobRouter.get('/jobposting', jobPublicLimiter, jobPostingController);

// READ ONE JOB
jobRouter.get('/read/:jobId', jobPublicLimiter, readOneJobController);

// READ ALL JOB
jobRouter.get('/readAll', jobGeneralLimiter, authenticateAdminJWT, readAllJobController);

// DELETE JOB
jobRouter.delete('/delete/:jobId', jobWriteLimiter, authenticateAdminJWT, deleteJobController);

// EDIT JOB
jobRouter.put('/edit/:jobId', jobWriteLimiter, authenticateAdminJWT, editJobController);

// EDIT JOB STATUS
jobRouter.put('/status/edit/:jobId', jobWriteLimiter, authenticateAdminJWT, editJobStatusController);

// FETCH JOB TOTALS
jobRouter.get('/totals', jobGeneralLimiter, authenticateAdminJWT, fetchJobTotalController);

// READ ALL JOB ARCHIVE
jobRouter.get('/archive/readAll', jobGeneralLimiter, authenticateAdminJWT, readAllJobArchiveController);

// RESTORE JOB
jobRouter.put('/restore/:jobId', jobWriteLimiter, authenticateAdminJWT, restoreJobController);

export default jobRouter;
