import express from 'express';
import { fetchAllInterviewsController, fetchApplicantPipelineControllter, fetchApplicantStatusHistoryController, interviewResultController, moveApplicantController, scheduleInterviewController } from '../controllers/applicantsController.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const applicantsRouter = express.Router();

// FETCH APPLICANTS PIPELINE
applicantsRouter.get('/pipeline', authenticateAdminJWT, fetchApplicantPipelineControllter);

// MOVE APPLICANT
applicantsRouter.put('/move/:applicantId', authenticateAdminJWT, moveApplicantController);

// FETCH APPLICANT STATUS HISTORY
applicantsRouter.get('/statusHistory/:applicantId', authenticateAdminJWT, fetchApplicantStatusHistoryController);

// FETCH ALL INTERVIEWS
applicantsRouter.get('/fetchAll/interviews', authenticateAdminJWT, fetchAllInterviewsController);

// SCHEDULE INTERVIEW
applicantsRouter.put('/interview/schedule/:applicantId', authenticateAdminJWT, scheduleInterviewController);

// INTERVIEW RESULT
applicantsRouter.put('/interview/result/:applicantId', authenticateAdminJWT, interviewResultController);

export default applicantsRouter;