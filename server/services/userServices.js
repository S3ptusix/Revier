import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { isValidPHPhone, validateEmail, validatePassword } from "../utils/inputValidators.js";
import { capitalizeEachWord, cleanDateTime, removeUnnecessarySpaces } from "../utils/format.js";
import { sendMail } from "../utils/mailer.js";
import { createUserToken } from "../utils/token.js";
import { Applicants, ApplicantStatusHistory, Companies, Jobs, Notification } from '../models/index.js';
import fs from "fs";
import path from "path";
import { duplicateFileWithMeta } from "../utils/duplicateFile.js";
import { Op } from 'sequelize';

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

    let newResumePath = null;
    let newValidIdPath = null;

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

        // =========================
        // RESUME REPLACEMENT
        // =========================
        if (resume?.filename) {

            // delete old resume
            if (user.resume) {
                const oldResumePath = path.join("uploads/resumes", user.resume);

                if (fs.existsSync(oldResumePath)) {
                    fs.unlinkSync(oldResumePath);
                }
            }

            user.resume = resume.filename;

            newResumePath = path.join("uploads/resumes", resume.filename);
        }

        // =========================
        // VALID ID REPLACEMENT
        // =========================
        if (validId?.filename) {

            // delete old validId
            if (user.validId) {
                const oldValidIdPath = path.join("uploads/validIds", user.validId);

                if (fs.existsSync(oldValidIdPath)) {
                    fs.unlinkSync(oldValidIdPath);
                }
            }

            user.validId = validId.filename;

            newValidIdPath = path.join("uploads/validIds", validId.filename);
        }

        // =========================
        // UPDATE TEXT FIELDS
        // =========================
        user.fullname = formattedFullname;
        user.phone = phone;
        user.linkedIn = linkedIn || null;
        user.portfolio = portfolio || null;

        await user.save();

        return {
            success: true,
            message: "User profile updated successfully!"
        };

    } catch (error) {

        // cleanup newly uploaded files if error happens
        if (newResumePath && fs.existsSync(newResumePath)) {
            fs.unlinkSync(newResumePath);
        }

        if (newValidIdPath && fs.existsSync(newValidIdPath)) {
            fs.unlinkSync(newValidIdPath);
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
    resumeFile,
    validIdFile
) => {

    let resumePath = null;
    let validIdPath = null;

    try {

        // =========================
        // RESUME HANDLING
        // =========================
        if (!resumeFile) {
            const user = await Users.findByPk(userId, {
                attributes: ['resume']
            });

            if (user?.resume) {
                resumeFile = await duplicateFileWithMeta({
                    oldPath: `uploads/resumes/${user.resume}`,
                    fieldname: "resume",
                    originalname: user.resume,
                    destination: "uploads/resumes"
                });
            }
        }

        // =========================
        // VALID ID HANDLING
        // =========================
        if (!validIdFile) {
            const user = await Users.findByPk(userId, {
                attributes: ['validId']
            });

            if (user?.validId) {
                validIdFile = await duplicateFileWithMeta({
                    oldPath: `uploads/validIds/${user.validId}`,
                    fieldname: "validId",
                    originalname: user.validId,
                    destination: "uploads/validIds"
                });
            }
        }

        const resumeFilename = resumeFile?.filename || null;
        const validIdFilename = validIdFile?.filename || null;

        // =========================
        // VALIDATION
        // =========================
        if (
            isNaN(userId) ||
            isNaN(jobId) ||
            !fullname?.trim() ||
            !phone?.trim() ||
            !resumeFilename ||
            !validIdFilename
        ) {
            throw new Error("Please complete all required fields.");
        }

        // =========================
        // JOB CHECK
        // =========================
        const jobExist = await Jobs.findByPk(jobId);
        if (!jobExist) throw new Error("Job is not available.");

        // =========================
        // PATHS
        // =========================
        resumePath = path.join("uploads/resumes", resumeFilename);
        validIdPath = path.join("uploads/validIds", validIdFilename);

        const thisApplicant = await Applicants.findOne({
            attributes: ['applicantStatus', 'isRejected', 'canApplyAgainAt'],
            where: {
                userId,
                jobId
            }
        });
        if (thisApplicant) {
            if (['New', 'Interview', 'Orientation'].includes(thisApplicant.applicantStatus) && (thisApplicant.isRejected === 'No')) {
                throw new Error(`You have pending application to this job you can apply again at ${cleanDateTime(thisApplicant.canApplyAgainAt)}.`);
            }

            const currentDateTime = new Date();
            if (currentDateTime !== thisApplicant.canApplyAgainAt) {
                throw new Error(`You cannot apply to this job until. ${cleanDateTime(thisApplicant.canApplyAgainAt)}.`);
            }
        }


        // =========================
        // CREATE APPLICATION
        // =========================
        const applicant = await Applicants.create({
            userId,
            jobId,
            fullname,
            phone,
            linkedIn,
            portfolio,
            resume: resumeFilename,
            validId: validIdFilename,
            canApplyAgainAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
        });

        await ApplicantStatusHistory.create({
            applicantId: applicant.id,
            applicantStatus: "New"
        });

        const createdApplicant = await Applicants.findOne({
            attributes: ['id'],
            include: [
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
                id: applicant.id
            }
        })

        await Notification.create({
            userId,
            message: `Success! Your application for ${createdApplicant?.job?.jobTitle} at ${createdApplicant?.job?.company?.companyName} has been received. We'll notify you of any updates soon.`,
            type: "success"
        });

        return {
            success: true,
            message: "Applied successfully"
        };

    } catch (error) {

        // cleanup files
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

// EDIT APPLICATION
export const editApplicationService = async (
    applicationId,
    fullname,
    phone,
    linkedIn,
    portfolio,
    resumeFile,
    validIdFile
) => {

    let newResumePath = null;
    let newValidIdPath = null;

    try {
        const application = await Applicants.findByPk(applicationId);

        if (!application) {
            throw new Error("Application not found.");
        }

        if (resumeFile?.filename) {

            // delete old resume
            if (application.resume) {
                const oldResumePath = path.join("uploads/resumes", application.resume);

                if (fs.existsSync(oldResumePath)) {
                    fs.unlinkSync(oldResumePath);
                }
            }

            application.resume = resumeFile.filename;
            newResumePath = path.join("uploads/resumes", resumeFile.filename);
        }

        if (validIdFile?.filename) {

            // delete old validId
            if (application.validId) {
                const oldValidIdPath = path.join("uploads/validIds", application.validId);

                if (fs.existsSync(oldValidIdPath)) {
                    fs.unlinkSync(oldValidIdPath);
                }
            }

            application.validId = validIdFile.filename;
            newValidIdPath = path.join("uploads/validIds", validIdFile.filename);
        }

        application.fullname = fullname?.trim();
        application.phone = phone?.trim();
        application.linkedIn = linkedIn || null;
        application.portfolio = portfolio || null;

        await application.save();

        return {
            success: true,
            message: "Application updated successfully"
        };

    } catch (error) {

        // cleanup newly uploaded files if error occurs
        if (newResumePath && fs.existsSync(newResumePath)) {
            fs.unlinkSync(newResumePath);
        }

        if (newValidIdPath && fs.existsSync(newValidIdPath)) {
            fs.unlinkSync(newValidIdPath);
        }

        return {
            success: false,
            message: error.message
        };
    }
};

// RECENT APPLICATION
export const recentApplicantionService = async (userId, page = 1) => {
    try {
        const limit = 5;
        const offset = (page - 1) * limit;

        const { count, rows } = await Applicants.findAndCountAll({
            attributes: [
                'id',
                'applicantStatus',
                'isRejected',
                'createdAt'
            ],
            include: [
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
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            success: true,
            recentAppilcations: rows,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit)
            }
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
export const fetchAllNotificationService = async (userId, page = 1) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Notification.findAndCountAll({
            attributes: ['message', 'type', 'createdAt'],
            where: {
                userId
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            success: true,
            notifications: rows,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// SAVE JOB
export const saveJobService = async (userId, jobId) => {
    try {

        const user = await Users.findOne({
            where: { id: userId },
            attributes: ['savedJobs'],
            raw: true
        });

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        let savedJobs = user.savedJobs || [];

        // If stored as string, convert it
        if (typeof savedJobs === "string") {
            try {
                savedJobs = JSON.parse(savedJobs);
            } catch {
                savedJobs = savedJobs.split(",").map(Number);
            }
        }

        savedJobs = savedJobs.map(Number).filter(Boolean);

        const jobIdNum = Number(jobId);

        const alreadySaved = savedJobs.includes(jobIdNum);
        if (alreadySaved) {
            // ❌ Unsave job
            savedJobs = savedJobs.filter(id => id !== jobIdNum);
        } else {
            // ✅ Save job
            savedJobs.push(jobIdNum);
        }

        await Users.update(
            {
                savedJobs
            },
            {
                where: { id: userId }
            }
        );

        return { success: true };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH ALL SAVED JOB LIST
export const fetchAllSavedJobListService = async (userId) => {
    try {

        const user = await Users.findOne({
            where: { id: userId },
            attributes: ['savedJobs'],
            raw: true
        });

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        let savedJobsList = user.savedJobs || [];

        // convert if stored as string
        if (typeof savedJobsList === "string") {
            try {
                savedJobsList = JSON.parse(savedJobsList);
            } catch {
                savedJobsList = savedJobsList.split(",").map(Number);
            }
        }

        savedJobsList = savedJobsList.map(Number).filter(Boolean);

        return {
            success: true,
            savedJobsList
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH ALL SAVED JOB 
export const fetchAllSavedJobsService = async (userId, page = 1) => {
    try {
        const limit = 5;
        const user = await Users.findOne({
            attributes: ['savedJobs'],
            where: { id: userId },
            raw: true
        });

        if (!user || !user.savedJobs) {
            return {
                success: true,
                saveJobs: [],
                pagination: {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: page,
                    pageSize: limit
                }
            };
        }

        // Convert savedJobs -> array of numbers
        let savedJobsArray = user.savedJobs;

        if (typeof savedJobsArray === "string") {
            try {
                savedJobsArray = JSON.parse(savedJobsArray);
            } catch {
                savedJobsArray = savedJobsArray.split(",").map(Number);
            }
        }

        savedJobsArray = savedJobsArray.map(Number).filter(Boolean);

        // ✅ Pagination logic
        const offset = (page - 1) * limit;
        const paginatedIds = savedJobsArray.slice(offset, offset + limit);

        const { count, rows } = await Jobs.findAndCountAll({
            where: {
                id: { [Op.in]: paginatedIds }
            },
            attributes: [
                "id",
                "jobTitle",
                "slot",
                "type",
                "postedAt",
            ],
            include: [
                {
                    model: Companies,
                    as: "company",
                    attributes: ["companyName", "location", "industry"],
                    required: true
                },
            ],
            order: [["postedAt", "DESC"]]
        });

        return {
            success: true,
            savedJobs: rows,
            pagination: {
                total: savedJobsArray.length, // total saved jobs
                totalPages: Math.ceil(savedJobsArray.length / limit)
            }
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};