import express from 'express';
import { otpVerifyController, sendOtpController } from '../controllers/otpControllers.js';

const otpRouter = express.Router();

// VERIFY USER 
otpRouter.post('/verify', otpVerifyController);

// SEND USER 
otpRouter.post('/sendOtp', sendOtpController);

export default otpRouter;