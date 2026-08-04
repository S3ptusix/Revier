import express from 'express';
import {
    applicantDetailsController,
    applicantTotalsController,
    fetchApplicantPipelineController,
    fetchApplicantStatusHistoryController,
} from '../controllers/applicantController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const applicantRouter = express.Router();

// FETCH APPLICANTS PIPELINE
applicantRouter.get('/pipeline', authenticateAdminJWT, fetchApplicantPipelineController);

// FETCH APPLICANT STATUS HISTORY
applicantRouter.get('/statusHistory/:applicantId', authenticateAdminJWT, fetchApplicantStatusHistoryController);

// APPLICANT DETAILS
applicantRouter.get('/applicantDetails/:applicantId', applicantDetailsController);

// APPLICANT TOTALS
applicantRouter.get('/totals', authenticateAdminJWT, applicantTotalsController);

export default applicantRouter;