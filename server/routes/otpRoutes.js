import express from 'express';
import { otpVerifyAdminController, otpVerifyController, sendOtpAdminController, sendOtpAdminForgotPasswordController, sendOtpController, sendOtpForgotPasswordController, sendOtpNoCookieAdminController, sendOtpNoCookieController } from '../controllers/otpControllers.js';
import { authenticateAdminJWT, authenticateUserJWT } from '../middleware/auth.js';
import { sendOtpLimiter, verifyOtpLimiter } from '../middleware/rateLimiter/otpRateLimiter.js';

const otpRouter = express.Router();

// VERIFY USER 
otpRouter.post('/verify', verifyOtpLimiter, otpVerifyController);

// VERIFY USER ADMIN
otpRouter.post('/admin/verify', verifyOtpLimiter, otpVerifyAdminController);

// SEND OTP USER 
otpRouter.post('/sendOtp', sendOtpLimiter, authenticateUserJWT, sendOtpController);

// SEND OTP NO COOKIE USER 
otpRouter.post('/sendOtpNoCookie', sendOtpLimiter, sendOtpNoCookieController);

// SEND OTP FORGOT PASSWORD USER
otpRouter.post('/forgot-password/sendOtp', sendOtpLimiter, sendOtpForgotPasswordController);

// SEND OTP ADMIN
otpRouter.post('/admin/sendOtp', sendOtpLimiter, authenticateAdminJWT, sendOtpAdminController);

// SEND OTP NO COOKIE ADMIN
otpRouter.post('/admin/sendOtpNoCookie', sendOtpLimiter, sendOtpNoCookieAdminController);

// SEND OTP FORGOT-PASSWORD ADMIN
otpRouter.post('/admin/forgot-password/sendOtp', sendOtpLimiter, sendOtpAdminForgotPasswordController);

export default otpRouter;
