import express from 'express';
import { otpVerifyAdminController, otpVerifyController, sendOtpAdminController, sendOtpAdminForgotPasswordController, sendOtpController, sendOtpForgotPasswordController } from '../controllers/otpControllers.js';
import { authenticateAdminJWT, authenticateUserJWT } from '../middleware/auth.js';

const otpRouter = express.Router();

// VERIFY USER 
otpRouter.post('/verify', otpVerifyController);

// VERIFY USER ADMIN
otpRouter.post('/admin/verify', otpVerifyAdminController);

// SEND USER 
otpRouter.post('/sendOtp', authenticateUserJWT, sendOtpController);

// SEND USER FORGOT-PASSWORD
otpRouter.post('/forgot-password/sendOtp', sendOtpForgotPasswordController);

// SEND ADMIN
otpRouter.post('/admin/sendOtp', authenticateAdminJWT, sendOtpAdminController);

// SEND ADMIN
otpRouter.post('/admin/forgot-password/sendOtp', sendOtpAdminForgotPasswordController);

export default otpRouter;