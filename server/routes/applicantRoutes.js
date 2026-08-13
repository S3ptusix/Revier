import express from 'express';
import {
    applicantDetailsController,
    applicantTotalsController,
    fetchApplicantStatusHistoryController,
} from '../controllers/applicantController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const applicantRouter = express.Router();

// FETCH APPLICANT STATUS HISTORY
applicantRouter.get('/statusHistory/:applicantId', authenticateAdminJWT, fetchApplicantStatusHistoryController);

// APPLICANT DETAILS
applicantRouter.get('/applicantDetails/:applicantId', applicantDetailsController);

// APPLICANT TOTALS
applicantRouter.get('/totals', authenticateAdminJWT, applicantTotalsController);

export default applicantRouter;