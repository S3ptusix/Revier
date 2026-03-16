import express from 'express';
import { fetchAllInterviewsController, fetchApplicantPipelineControllter, fetchApplicantStatusHistoryController, fetchApplicantTotalController, fetchInterviewTotalController, fetchOneInterviewsController, interviewResultController, isRejectedController, moveApplicantController, RescheduleInterviewController, scheduleInterviewController } from '../controllers/applicantsController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const applicantsRouter = express.Router();

// FETCH APPLICANTS PIPELINE
applicantsRouter.get('/pipeline', authenticateAdminJWT, fetchApplicantPipelineControllter);

// MOVE APPLICANT
applicantsRouter.put('/move/:applicantId', authenticateAdminJWT, moveApplicantController);

// IS REJECTED
applicantsRouter.put('/isRejected/:applicantId', authenticateAdminJWT, isRejectedController);

// FETCH APPLICANT STATUS HISTORY
applicantsRouter.get('/statusHistory/:applicantId', authenticateAdminJWT, fetchApplicantStatusHistoryController);

// FETCH ALL INTERVIEWS
applicantsRouter.get('/fetchAll/interviews', authenticateAdminJWT, fetchAllInterviewsController);

// FETCH ONE INTERVIEW
applicantsRouter.get('/fetchOne/interviews/:applicantId', authenticateAdminJWT, fetchOneInterviewsController);

// RESCHEDULE INTERVIEW
applicantsRouter.put('/reschedule/:applicantId', authenticateAdminJWT, RescheduleInterviewController);

// SCHEDULE INTERVIEW
applicantsRouter.put('/interview/schedule/:applicantId', authenticateAdminJWT, scheduleInterviewController);

// INTERVIEW RESULT
applicantsRouter.put('/interview/result/:applicantId', authenticateAdminJWT, interviewResultController);

// FETCH APPLICANT TOTALS
applicantsRouter.get('/totals', authenticateAdminJWT, fetchApplicantTotalController);

// FETCH INTERVIEW TOTALS
applicantsRouter.get('/interview/totals', authenticateAdminJWT, fetchInterviewTotalController);

export default applicantsRouter;