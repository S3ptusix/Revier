import Users from "../models/User.js";
import { validateEmail } from "../utils/inputValidators.js";
import { sendMail } from "../utils/mailer.js";
import crypto from "crypto";
import { createAdminToken, createUserToken } from "../utils/token.js";
import Admins from "../models/Admin.js";
import { userAccountCreatedHTML, otpEmailHTML } from "../emailTemplates/otpTemplates.js";

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

const generateOtp = () => crypto.randomInt(100000, 999999).toString();
const getOtpExpiry = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

// OTP VERIFY
export const otpVerifyService = async (email, otp) => {
    try {
        if (!email || !otp || otp.length < OTP_LENGTH) {
            return { success: false, message: "Enter the 6-digit code sent to your email." };
        }

        const user = await Users.findOne({ where: { email } });

        if (!user) return { success: false, message: "We couldn't find an account for this email." };

        // Check expiration
        if (new Date() > user.otpExpireAt) {
            return {
                success: false,
                message: "This code has expired. Request a new one to continue."
            };
        }

        // Check OTP
        if (user.otp !== otp) {
            return {
                success: false,
                message: "That code isn't correct. Please check and try again."
            };
        }

        // Clear OTP (good practice)
        await user.update({
            otp: null,
            otpExpireAt: null,
            isVerified: 'yes'
        });

        const token = createUserToken({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });

        await sendMail({
            to: email,
            subject: 'Your REVIER Account is Ready',
            html: userAccountCreatedHTML({ firstName: user?.firstName })
        });

        return {
            success: true,
            token
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// OTP VERIFY ADMIN
export const otpVerifyAdminService = async (email, otp) => {
    try {
        if (!email || !otp || otp.length < OTP_LENGTH) {
            return { success: false, message: "Enter the 6-digit code sent to your email." };
        }

        const admin = await Admins.findOne({ where: { email } });

        if (!admin) return { success: false, message: "We couldn't find an account for this email." };

        // Check expiration
        if (new Date() > admin.otpExpireAt) {
            return {
                success: false,
                message: "This code has expired. Request a new one to continue."
            };
        }

        // Check OTP
        if (admin.otp !== otp) {
            return {
                success: false,
                message: "That code isn't correct. Please check and try again."
            };
        }

        // Clear OTP (good practice)
        await admin.update({
            otp: null,
            otpExpireAt: null,
            isVerified: 'yes'
        });

        const token = createAdminToken({
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role
        });
        return {
            success: true,
            token
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// SEND OTP
export const sendOtpService = async (email) => {
    try {

        if (!email) {
            return {
                success: false,
                message: "Enter your email to continue."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Enter a valid email address."
            };
        }

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return {
                success: true,
                message: "If an account exists for this email, we've sent a verification code."
            };
        }

        // Generate OTP
        const otp = generateOtp();

        // Set expiration
        const otpExpireAt = getOtpExpiry();

        // Save OTP to user
        await user.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your REVIER Verification Code',
            html: otpEmailHTML({
                firstName: user?.firstName,
                otp,
                expiresInMinutes: OTP_EXPIRY_MINUTES,
                intro: 'We received a request to access your account. Use the code below to verify it\u2019s you.'
            })
        });

        return {
            success: true,
            message: "Verification code sent. Please check your email."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
};

// SEND OTP FORGOT-PASSWORD
export const sendOtpForgotPasswordService = async (email) => {
    try {

        if (!email) {
            return {
                success: false,
                message: "Enter your email to continue."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Enter a valid email address."
            };
        }

        const user = await Users.findOne({ where: { email } });
        if (!user || user.isVerified === 'no') {
            return {
                success: true,
                message: "If an account exists for this email, we've sent a verification code."
            };
        }

        // Generate OTP
        const otp = generateOtp();

        // Set expiration
        const otpExpireAt = getOtpExpiry();

        // Save OTP to user
        await user.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your REVIER Verification Code',
            html: otpEmailHTML({
                firstName: user?.firstName,
                otp,
                expiresInMinutes: OTP_EXPIRY_MINUTES,
                heading: 'Reset Your Password',
                intro: 'We received a request to reset your password. Use the code below to continue.'
            })
        });

        return {
            success: true,
            message: "If an account exists for this email, we've sent a verification code."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
};

// SEND OTP ADMIN
export const sendOtpAdminService = async (email) => {
    try {
        if (!email) {
            return {
                success: false,
                message: "Enter your email to continue."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Enter a valid email address."
            };
        }

        const admin = await Admins.findOne({ where: { email } });

        if (!admin) {
            return {
                success: true,
                message: "If an account exists for this email, we've sent a verification code."
            };
        }

        // Generate OTP
        const otp = generateOtp();

        // Set expiration
        const otpExpireAt = getOtpExpiry();

        // Save OTP to admin
        await admin.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your REVIER Verification Code',
            html: otpEmailHTML({
                firstName: admin?.firstName,
                otp,
                expiresInMinutes: OTP_EXPIRY_MINUTES,
                intro: 'We received a request to access your account. Use the code below to verify it\u2019s you.'
            })
        });

        return {
            success: true,
            message: "Verification code sent. Please check your email."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
};

// SEND OTP FORGOT-PASSWORD ADMIN
export const sendOtpAdminForgotPasswordService = async (email) => {
    try {
        if (!email) {
            return {
                success: false,
                message: "Enter your email to continue."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Enter a valid email address."
            };
        }

        const admin = await Admins.findOne({ where: { email } });

        if (!admin || admin.isVerified === 'no') {

            return {
                success: true,
                message: "If an account exists for this email, we've sent a verification code."
            };
        }

        // Generate OTP
        const otp = generateOtp();

        // Set expiration
        const otpExpireAt = getOtpExpiry();

        // Save OTP to admin
        await admin.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your REVIER Verification Code',
            html: otpEmailHTML({
                firstName: admin?.firstName,
                otp,
                expiresInMinutes: OTP_EXPIRY_MINUTES,
                heading: 'Reset Your Password',
                intro: 'We received a request to reset your password. Use the code below to continue.'
            })
        });

        return {
            success: true,
            message: "If an account exists for this email, we've sent a verification code."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
};