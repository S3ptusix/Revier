import express from 'express';
import { otpVerifyAdminController, otpVerifyController, sendOtpController } from '../controllers/otpControllers.js';

const otpRouter = express.Router();

// VERIFY USER 
otpRouter.post('/verify', otpVerifyController);

// VERIFY USER ADMIN
otpRouter.post('/admin/verify', otpVerifyAdminController);

// SEND USER 
otpRouter.post('/sendOtp', sendOtpController);

export default otpRouter;