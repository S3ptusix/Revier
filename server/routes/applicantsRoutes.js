import express from 'express';
import { fetchApplicantPipelineControllter, fetchApplicantStatusHistoryController, moveApplicantController } from '../controllers/applicantsController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const applicantsRouter = express.Router();

// FETCH APPLICANTS PIPELINE
applicantsRouter.get('/pipeline', authenticateAdminJWT, fetchApplicantPipelineControllter);

// MOVE APPLICANT
applicantsRouter.put('/move/:applicantId', authenticateAdminJWT, moveApplicantController);

// FETCH APPLICANT STATUS HISTORY
applicantsRouter.get('/statusHistory/:applicantId', authenticateAdminJWT, fetchApplicantStatusHistoryController);

export default applicantsRouter;