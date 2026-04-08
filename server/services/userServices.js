import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { isValidPHPhone, validateEmail, validatePassword } from "../utils/inputValidators.js";
import { capitalizeEachWord, cleanDateTime, removeUnnecessarySpaces } from "../utils/format.js";
import { sendMail } from "../utils/mailer.js";
import { createUserToken } from "../utils/token.js";
import { Applicants, ApplicantStatusHistory, Companies, Jobs, Notification } from '../models/index.js';
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

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
export const userUpdateService = async (
    userId,
    fullname,
    phone,
    linkedIn,
    portfolio,
    resume,
    validId
) => {
    let resumePath = null;
    let validIdPath = null;

    try {
        if (
            isNaN(userId) ||
            !fullname?.trim() ||
            !phone?.trim()
        ) {
            throw new Error("Please complete all required fields.");
        }

        const user = await Users.findByPk(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        const formattedFullname = removeUnnecessarySpaces(fullname);

        if (formattedFullname.length < 4) {
            throw new Error("Fullname should have at least 4 characters.");
        }

        if (!isValidPHPhone(phone)) {
            throw new Error("Phone number is not valid.");
        }

        // filenames
        const resumeFilename = resume ? resume.filename : null;
        const validIdFilename = validId ? validId.filename : null;

        // paths (for cleanup if error)
        if (resumeFilename) {
            resumePath = path.join("uploads/resumes", resumeFilename);
        }

        if (validIdFilename) {
            validIdPath = path.join("uploads/validIds", validIdFilename);
        }

        // ✅ only update if new file exists
        if (resumeFilename) {
            user.resume = resumeFilename;
        }

        if (validIdFilename) {
            user.validId = validIdFilename;
        }

        user.fullname = formattedFullname;
        user.phone = phone;
        user.linkedIn = linkedIn || null;
        user.portfolio = portfolio || null;

        await user.save();

        return {
            success: true,
            message: "User profile updated successfully!",
        };

    } catch (error) {

        // ❗ cleanup uploaded files if error
        if (resumePath && fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
        }

        if (validIdPath && fs.existsSync(validIdPath)) {
            fs.unlinkSync(validIdPath);
        }

        return {
            success: false,
            message: error.message
        };
    }
};

// READ USER PROFILE
export const fetchUserProfileService = async (userId) => {
    try {

        const user = await Users.findOne({
            attributes: [
                "fullname",
                "email",
                "phone",
                'linkedIn',
                'portfolio',
                'resume',
                'validId'
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
    userId,
    jobId,
    fullname,
    phone,
    linkedIn,
    portfolio,
    resume,
    validId
) => {
    let resumePath = null;
    let validIdPath = null;

    try {
        const resumeFilename = resume ? resume.filename : null;
        const validIdFilename = validId ? validId.filename : null;

        // ✅ set paths independently
        if (resumeFilename) {
            resumePath = path.join("uploads/resumes", resumeFilename);
        }

        if (validIdFilename) {
            validIdPath = path.join("uploads/validIds", validIdFilename);
        }

        if (
            isNaN(userId) ||
            isNaN(jobId) ||
            !fullname?.trim() ||
            !phone?.trim() ||
            !resumeFilename?.trim() ||
            !validIdFilename?.trim()
        ) {
            throw new Error("Please complete all required fields.");
        }

        const jobExist = await Jobs.findByPk(jobId);
        if (!jobExist) {
            throw new Error("Job is not available.");
        }

        const blacklistedHistory = await Applicants.findAll({
            attributes: ['jobId'],
            where: {
                userId,
                blacklistedReason: { [Op.not]: null }
            },
            include: [
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['companyId'],
                    required: true,
                }
            ]
        });

        const companyOfTheJobApplying = await Companies.findByPk(jobExist.companyId);

        const blacklistedFromThisCompany = blacklistedHistory.some(
            applicant => applicant.job?.companyId === companyOfTheJobApplying.id
        );

        if (blacklistedFromThisCompany) {
            throw new Error("You are blacklisted from applying to this company.");
        }

        const thisApplicant = await Applicants.findOne({
            where: { userId, jobId }
        });

        if (thisApplicant?.canApplyAgainAt > new Date()) {
            throw new Error(
                "You have already applied for this job. You can apply again on " +
                cleanDateTime(thisApplicant.canApplyAgainAt)
            );
        }

        // can apply after 6 months
        const canApplyAgainAt = new Date();
        canApplyAgainAt.setMonth(canApplyAgainAt.getMonth() + 6);

        const applicant = await Applicants.create({
            userId,
            jobId,
            fullname,
            phone,
            canApplyAgainAt,
            linkedIn,
            portfolio,
            resume: resumeFilename,
            validId: validIdFilename // ✅ FIXED
        });

        await ApplicantStatusHistory.create({
            applicantId: applicant.id,
            applicantStatus: 'New'
        });

        await Notification.create({
            userId,
            message: `🎉 Application Submitted! You have successfully applied.`,
            type: 'success'
        });

        return {
            success: true,
            message: "Applied successfully",
        };

    } catch (error) {

        // ✅ delete files safely (independent)
        if (resumePath && fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
        }

        if (validIdPath && fs.existsSync(validIdPath)) {
            fs.unlinkSync(validIdPath);
        }

        return {
            success: false,
            message: error.message
        };
    }
};

// RECENT APPLICATION
export const recentApplicantionService = async (userId) => {
    try {

        const recentAppilcations = await Applicants.findAll({
            attributes: [
                'id',
                'applicantStatus',
                'createdAt'
            ],
            include: [
                {
                    model: ApplicantStatusHistory,
                    attributes: [
                        'applicantStatus',
                        'createdAt',
                    ]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName'],
                            required: true
                        }
                    ]
                }
            ],
            where: {
                userId
            }
        });

        return {
            success: true,
            recentAppilcations,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH ALL NOTIFICATION
export const fetchAllNotificationService = async (userId) => {
    try {

        const notifications = await Notification.findAll({
            attributes: ['message', 'type', 'createdAt'],
            where: {
                userId
            }
        })

        return {
            success: true,
            notifications
        }

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
}