import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { isValidPHPhone, validateEmail, validatePassword } from "../utils/inputValidators.js";
import { capitalizeEachWord, removeUnnecessarySpaces } from "../utils/format.js";
import { sendMail } from "../utils/mailer.js";
import { createUserToken } from "../utils/token.js";
import {Applicants} from '../models/index.js';

// REGISTER USER
export const userRegistrationService = async (fullname, email, password, confirmPassword) => {
    try {
        const passwordError = validatePassword(password);

        if (!fullname.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            return {
                success: false,
                message: "Please complete all fields to proceed with account creation."
            };
        }

        email = email.toLowerCase().trim();

        if (!validateEmail(email)) return { success: false, message: "Invalid email format." };

        if (passwordError) return { success: false, message: passwordError };

        if (password !== confirmPassword) return { success: false, message: "Password does not match." }

        // Check if user already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return {
                success: false,
                message: "Email already in use"
            };
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Optional: generate OTP and expiration
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const formattedFullname = capitalizeEachWord(
            removeUnnecessarySpaces(fullname)
        );

        // Create user
        const user = await Users.create({
            fullname: formattedFullname,
            email,
            password: hashedPassword,
            otp,
            otpExpireAt
        });

        // TODO: send OTP via email/SMS
        // sendEmail(user.email, `Your OTP code is ${otp}`);
        sendMail({
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
            message: "User created successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// LOGIN USER 
export const userLoginService = async (email, password) => {
    try {
        if (!email || !password) {
            return { success: false, message: "Please complete all fields" };
        }

        const user = await Users.findOne({ where: { email } });
        if (!user) return { success: false, message: "Wrong email or password!" };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: "Wrong email or password!" };

        if (user.isVerified === 'no') {

            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

            await user.update({
                otp,
                otpExpireAt
            });

            sendMail({
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

            return { success: false, isVerified: true }
        }

        const token = createUserToken({
            id: user.id,
            fullname: user.fullname,
        });

        return {
            success: true,
            token
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// UPDATE USER PROFILE
export const userUpdateService = async (userId, fullname, phone, bio, skills) => {
    try {

        const user = await Users.findByPk(userId);

        if (!user) return { message: false, message: "User not found." };

        if (!fullname || !phone || !bio || !skills) {
            return { success: false, message: "Please complete all required fields." };
        }

        const formattedFullname = removeUnnecessarySpaces(fullname);

        if (formattedFullname.length < 4) return { success: false, message: "fullname should have atleast 4 character." };

        if (!isValidPHPhone(phone)) return { success: false, message: "Phone number is not valid." };

        user.fullname = fullname || null;
        user.phone = phone || null;
        user.bio = bio || null;
        user.skills = skills || [];

        await user.save();

        return {
            success: true,
            message: "User profile updated successfully!",
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ USER PROFILE
export const fetchUserProfileService = async (userId) => {
    try {

        const user = await Users.findOne({
            attributes: [
                "fullname",
                "email",
                "phone",
                "bio",
                "skills"
            ],
            where: { id: userId }
        });

        if (!user) return { message: false, message: "User not found." };

        return {
            success: true,
            user
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// APPLY
export const applyUserService = async (
    fullname,
    phone,
    linkedIn,
    portforlio,
    coverLeeter,
    resume
) => {
    try {

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}