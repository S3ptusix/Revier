import { otpVerifyService, sendOtpService } from "../services/otpServices.js";
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

// SEND OTP 
export const sendOtpController = async (req, res) => {
    try {
        const email = req.body;
        console.log(email);
        const result = await sendOtpService(email);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}