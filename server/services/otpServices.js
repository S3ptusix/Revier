import Users from "../models/User.js";
import { validateEmail } from "../utils/inputValidators.js";
import { sendMail } from "../utils/mailer.js";
import crypto from "crypto";
import { createAdminToken, createUserToken } from "../utils/token.js";
import Admins from "../models/Admin.js";

// OTP VERIFY
export const otpVerifyService = async (email, otp) => {
    try {
        if (!email || !otp || otp.length < 6) return { success: false, message: "Please complete all fields" };

        const user = await Users.findOne({ where: { email } });

        if (!user) return { success: false, message: "User not found" };

        // Check expiration
        if (new Date() > user.otpExpireAt) {
            return {
                success: false,
                message: "OTP expired"
            };
        }

        // Check OTP
        if (user.otp !== otp) {
            return {
                success: false,
                message: "Invalid OTP"
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
        if (!email || !otp || otp.length < 6) return { success: false, message: "Please complete all fields" };

        const admin = await Admins.findOne({ where: { email } });

        if (!admin) return { success: false, message: "Admin not found" };

        // Check expiration
        if (new Date() > admin.otpExpireAt) {
            return {
                success: false,
                message: "OTP expired"
            };
        }

        // Check OTP
        if (admin.otp !== otp) {
            return {
                success: false,
                message: "Invalid OTP"
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
                message: "Please complete all fields to proceed with OTP request."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Invalid email format."
            };
        }

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return {
                success: true,
                message: "If the email is registered, an OTP has been sent."
            };
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set expiration (5 minutes)
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP to admin
        await user.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your One-Time Password (OTP)',
            html: `
                <div style="background-color:#f0fdf4; padding:40px 0; font-family:Arial, sans-serif;">
                    <div style="
                        max-width:520px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 10px 25px rgba(0,0,0,0.08);
                    ">
                        
                        <!-- Header -->
                        <div style="background-color:#10b981; padding:20px 24px;">
                        <h1 style="
                            margin:0;
                            color:#ffffff;
                            font-size:22px;
                            font-weight:700;
                            text-align:center;
                        ">
                            REVIER Security Code
                        </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:28px 24px; color:#333;">
                        <p style="margin-top:0;">Hi there 👋</p>

                        <p>
                            We received a request to access your account.  
                            Please use the One-Time Password (OTP) below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            margin:24px 0;
                            padding:16px;
                            text-align:center;
                            border-radius:10px;
                            background-color:#ecfdf5;
                            border:2px dashed #10b981;
                        ">
                            <span style="
                            font-size:28px;
                            letter-spacing:6px;
                            font-weight:700;
                            color:#10b981;
                            ">
                            ${otp}
                            </span>
                        </div>

                        <p>
                            This code is valid for a limited time.  
                            <strong>Do not share this OTP with anyone.</strong>
                        </p>

                        <p style="color:#555;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>

                        <p style="margin-bottom:0;">
                            Thanks,<br/>
                            <strong>REVIER Team</strong>
                        </p>
                        </div>

                        <!-- Footer -->
                        <div style="
                        padding:16px;
                        text-align:center;
                        font-size:12px;
                        color:#6b7280;
                        background:#f9fafb;
                        ">
                        © ${new Date().getFullYear()} REVIER. All rights reserved.
                        </div>

                    </div>
                </div>
            `
        });

        return {
            success: true,
            message: "If the email is registered, an OTP has been sent."
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
                message: "Please complete all fields to proceed with OTP request."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Invalid email format."
            };
        }

        const user = await Users.findOne({ where: { email } });
        console.log({user})
        if (!user || user.isVerified === 'no') {
            return {
                success: true,
                message: "If the email is registered, an OTP has been sent."
            };
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set expiration (5 minutes)
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP to admin
        await user.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your One-Time Password (OTP)',
            html: `
                <div style="background-color:#f0fdf4; padding:40px 0; font-family:Arial, sans-serif;">
                    <div style="
                        max-width:520px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 10px 25px rgba(0,0,0,0.08);
                    ">
                        
                        <!-- Header -->
                        <div style="background-color:#10b981; padding:20px 24px;">
                        <h1 style="
                            margin:0;
                            color:#ffffff;
                            font-size:22px;
                            font-weight:700;
                            text-align:center;
                        ">
                            REVIER Security Code
                        </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:28px 24px; color:#333;">
                        <p style="margin-top:0;">Hi there 👋</p>

                        <p>
                            We received a request to access your account.  
                            Please use the One-Time Password (OTP) below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            margin:24px 0;
                            padding:16px;
                            text-align:center;
                            border-radius:10px;
                            background-color:#ecfdf5;
                            border:2px dashed #10b981;
                        ">
                            <span style="
                            font-size:28px;
                            letter-spacing:6px;
                            font-weight:700;
                            color:#10b981;
                            ">
                            ${otp}
                            </span>
                        </div>

                        <p>
                            This code is valid for a limited time.  
                            <strong>Do not share this OTP with anyone.</strong>
                        </p>

                        <p style="color:#555;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>

                        <p style="margin-bottom:0;">
                            Thanks,<br/>
                            <strong>REVIER Team</strong>
                        </p>
                        </div>

                        <!-- Footer -->
                        <div style="
                        padding:16px;
                        text-align:center;
                        font-size:12px;
                        color:#6b7280;
                        background:#f9fafb;
                        ">
                        © ${new Date().getFullYear()} REVIER. All rights reserved.
                        </div>

                    </div>
                </div>
            `
        });

        return {
            success: true,
            message: "If the email is registered, an OTP has been sent."
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
                message: "Please complete all fields to proceed with OTP request."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Invalid email format."
            };
        }

        const admin = await Admins.findOne({ where: { email } });

        if (!admin) {
            return {
                success: true,
                message: "If the email is registered, an OTP has been sent."
            };
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set expiration (5 minutes)
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP to admin
        await admin.update({
            otp,
            otpExpireAt
        });

        await sendMail({
            to: email,
            subject: 'Your One-Time Password (OTP)',
            html: `
                <div style="background-color:#f0fdf4; padding:40px 0; font-family:Arial, sans-serif;">
                    <div style="
                        max-width:520px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 10px 25px rgba(0,0,0,0.08);
                    ">
                        
                        <!-- Header -->
                        <div style="background-color:#10b981; padding:20px 24px;">
                        <h1 style="
                            margin:0;
                            color:#ffffff;
                            font-size:22px;
                            font-weight:700;
                            text-align:center;
                        ">
                            REVIER Security Code
                        </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:28px 24px; color:#333;">
                        <p style="margin-top:0;">Hi there 👋</p>

                        <p>
                            We received a request to access your account.  
                            Please use the One-Time Password (OTP) below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            margin:24px 0;
                            padding:16px;
                            text-align:center;
                            border-radius:10px;
                            background-color:#ecfdf5;
                            border:2px dashed #10b981;
                        ">
                            <span style="
                            font-size:28px;
                            letter-spacing:6px;
                            font-weight:700;
                            color:#10b981;
                            ">
                            ${otp}
                            </span>
                        </div>

                        <p>
                            This code is valid for a limited time.  
                            <strong>Do not share this OTP with anyone.</strong>
                        </p>

                        <p style="color:#555;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>

                        <p style="margin-bottom:0;">
                            Thanks,<br/>
                            <strong>REVIER Team</strong>
                        </p>
                        </div>

                        <!-- Footer -->
                        <div style="
                        padding:16px;
                        text-align:center;
                        font-size:12px;
                        color:#6b7280;
                        background:#f9fafb;
                        ">
                        © ${new Date().getFullYear()} REVIER. All rights reserved.
                        </div>

                    </div>
                </div>
            `
        });

        return {
            success: true,
            message: "OTP has been sent."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
};

// SEND OTP ADMIN FORGOT-PASSWORD
export const sendOtpAdminForgotPasswordService = async (email) => {
    try {
        if (!email) {
            return {
                success: false,
                message: "Please complete all fields to proceed with OTP request."
            };
        }
        if (!validateEmail(email)) {
            return {
                success: false,
                message: "Invalid email format."
            };
        }

        const admin = await Admins.findOne({ where: { email } });

        if (!admin || admin.isVerified === 'no') {
            return {
                success: true,
                message: "If the email is registered, an OTP has been sent."
            };
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set expiration (5 minutes)
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP to admin
        await admin.update({
            otp,
            otpExpireAt
        });
        
        await sendMail({
            to: email,
            subject: 'Your One-Time Password (OTP)',
            html: `
                <div style="background-color:#f0fdf4; padding:40px 0; font-family:Arial, sans-serif;">
                    <div style="
                        max-width:520px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 10px 25px rgba(0,0,0,0.08);
                    ">
                        
                        <!-- Header -->
                        <div style="background-color:#10b981; padding:20px 24px;">
                        <h1 style="
                            margin:0;
                            color:#ffffff;
                            font-size:22px;
                            font-weight:700;
                            text-align:center;
                        ">
                            REVIER Security Code
                        </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:28px 24px; color:#333;">
                        <p style="margin-top:0;">Hi there 👋</p>

                        <p>
                            We received a request to access your account.  
                            Please use the One-Time Password (OTP) below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            margin:24px 0;
                            padding:16px;
                            text-align:center;
                            border-radius:10px;
                            background-color:#ecfdf5;
                            border:2px dashed #10b981;
                        ">
                            <span style="
                            font-size:28px;
                            letter-spacing:6px;
                            font-weight:700;
                            color:#10b981;
                            ">
                            ${otp}
                            </span>
                        </div>

                        <p>
                            This code is valid for a limited time.  
                            <strong>Do not share this OTP with anyone.</strong>
                        </p>

                        <p style="color:#555;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>

                        <p style="margin-bottom:0;">
                            Thanks,<br/>
                            <strong>REVIER Team</strong>
                        </p>
                        </div>

                        <!-- Footer -->
                        <div style="
                        padding:16px;
                        text-align:center;
                        font-size:12px;
                        color:#6b7280;
                        background:#f9fafb;
                        ">
                        © ${new Date().getFullYear()} REVIER. All rights reserved.
                        </div>

                    </div>
                </div>
            `
        });

        return {
            success: true,
            message: "If the email is registered, an OTP has been sent."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
};