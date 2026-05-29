import { otpVerifyAdminService, otpVerifyService, sendOtpAdminService, sendOtpService } from "../services/otpServices.js";
import { cookieOptions } from "../utils/cookie.js";

// VERIFY OTP
export const otpVerifyController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await otpVerifyService(email, otp);

        if (!result.success) {
            return res.json({ success: false, message: result.message })
        }
        res.cookie('userToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Email verified and logged in successfully"
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// VERIFY OTP ADMIN
export const otpVerifyAdminController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await otpVerifyAdminService(email, otp);

        if (!result.success) {
            return res.json({ success: false, message: result.message })
        }
        res.cookie('adminToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Email verified and logged in successfully"
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// SEND OTP
export const sendOtpController = async (req, res) => {
    try {
        const user = req.user;
        const result = await sendOtpService(user.email);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// SEND OTP ADMIN
export const sendOtpAdminController = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await sendOtpAdminService(admin.email);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}