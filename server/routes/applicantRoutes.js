import express from 'express';
import {
    applicantDetailsController,
    applicantTotalsController,
    fetchApplicantStatusHistoryController,
} from '../controllers/applicantController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { applicantDetailsLimiter, applicantGeneralLimiter } from '../middleware/rateLimiter/applicantRateLimiter.js';

const applicantRouter = express.Router();

// FETCH APPLICANT STATUS HISTORY
applicantRouter.get('/statusHistory/:applicantId', applicantGeneralLimiter, authenticateAdminJWT, fetchApplicantStatusHistoryController);

// APPLICANT DETAILS
applicantRouter.get('/applicantDetails/:applicantId', applicantDetailsLimiter, applicantDetailsController);

// APPLICANT TOTALS
applicantRouter.get('/totals', applicantGeneralLimiter, authenticateAdminJWT, applicantTotalsController);

export default applicantRouter;
