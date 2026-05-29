import express from 'express';
import { otpVerifyAdminController, otpVerifyController, sendOtpAdminController, sendOtpController } from '../controllers/otpControllers.js';
import { authenticateAdminJWT, authenticateUserJWT } from '../middleware/auth.js';

const otpRouter = express.Router();

// VERIFY USER 
otpRouter.post('/verify', otpVerifyController);

// VERIFY USER ADMIN
otpRouter.post('/admin/verify', otpVerifyAdminController);

// SEND USER 
otpRouter.post('/sendOtp', authenticateUserJWT, sendOtpController);

// SEND USER ADMIN
otpRouter.post('/admin/sendOtp', authenticateAdminJWT, sendOtpAdminController);

export default otpRouter;