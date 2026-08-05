import express from 'express';
import { otpVerifyAdminController, otpVerifyController, sendOtpAdminController, sendOtpAdminForgotPasswordController, sendOtpController, sendOtpForgotPasswordController, sendOtpNoCookieAdminController, sendOtpNoCookieController } from '../controllers/otpControllers.js';
import { authenticateAdminJWT, authenticateUserJWT } from '../middleware/auth.js';

const otpRouter = express.Router();

// VERIFY USER 
otpRouter.post('/verify', otpVerifyController);

// VERIFY USER ADMIN
otpRouter.post('/admin/verify', otpVerifyAdminController);

// SEND OTP USER 
otpRouter.post('/sendOtp', authenticateUserJWT, sendOtpController);

// SEND OTP NO COOKIE USER 
otpRouter.post('/sendOtpNoCookie', sendOtpNoCookieController);

// SEND OTP FORGOT PASSWORD USER
otpRouter.post('/forgot-password/sendOtp', sendOtpForgotPasswordController);

// SEND OTP ADMIN
otpRouter.post('/admin/sendOtp', authenticateAdminJWT, sendOtpAdminController);

// SEND OTP NO COOKIE ADMIN
otpRouter.post('/admin/sendOtpNoCookie', sendOtpNoCookieAdminController);

// SEND OTP FORGOT PASSWORD ADMIN
otpRouter.post('/admin/forgot-password/sendOtp', sendOtpAdminForgotPasswordController);

export default otpRouter;