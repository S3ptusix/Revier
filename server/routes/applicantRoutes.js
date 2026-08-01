import express from 'express';
import {
    applicantDetailsController,
    applicantTotalsController,
    fetchAllInterviewsController,
    fetchApplicantPipelineController,
    fetchApplicantStatusHistoryController,
    fetchApplicantTotalController,
    fetchInterviewTotalController,
    fetchOneInterviewsController
} from '../controllers/applicantController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const applicantRouter = express.Router();

// FETCH APPLICANTS PIPELINE
applicantRouter.get('/pipeline', authenticateAdminJWT, fetchApplicantPipelineController);

// FETCH APPLICANT STATUS HISTORY
applicantRouter.get('/statusHistory/:applicantId', authenticateAdminJWT, fetchApplicantStatusHistoryController);

// FETCH ALL INTERVIEWS
applicantRouter.get('/fetchAll/interviews', authenticateAdminJWT, fetchAllInterviewsController);

// FETCH ONE INTERVIEW
applicantRouter.get('/fetchOne/interviews/:applicantId', authenticateAdminJWT, fetchOneInterviewsController);

// // FETCH APPLICANT TOTALS
// applicantRouter.get('/totals', authenticateAdminJWT, fetchApplicantTotalController);

// FETCH INTERVIEW TOTALS
applicantRouter.get('/interview/totals', authenticateAdminJWT, fetchInterviewTotalController);

// APPLICANT DETAILS
// applicantRouter.get('/applyStatusService/:applicantId', applicantDetailsController);
applicantRouter.get('/applicantDetails/:applicantId', applicantDetailsController);

// APPLICANT TOTALS
applicantRouter.get('/totals', authenticateAdminJWT, applicantTotalsController);

export default applicantRouter;