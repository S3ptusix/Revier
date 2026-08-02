import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { isValidPHPhone, validateEmail, validatePassword } from "../utils/inputValidators.js";
import { capitalizeEachWord, formatDateTime, removeUnnecessarySpaces } from "../utils/format.js";
import { sendMail } from "../utils/mailer.js";
import { createUserToken } from "../utils/token.js";
import { Applicants, Companies, Jobs, Notification } from '../models/index.js';
import { duplicateFileWithMeta } from "../utils/duplicateFile.js";
import { Op } from 'sequelize';
import { title } from "process";
import { io } from "../server.js";
import { calculateChange } from "../utils/tools.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { duplicateFileFromUrl, replaceFile, uploadFile } from "../utils/cloudinaryFileHandler.js";
import { applyHTML, emailVerificationHTML } from "../emailTemplates/userTemplates.js";

// REGISTER USER
export const userRegistrationService = async (
    firstName,
    lastName,
    sex,
    email,
    password,
    confirmPassword,
    phone,
    linkedIn,
    portfolio,
    resumeFile,
    validIdFile
) => {
    try {
        // =========================
        // VALIDATION
        // =========================
        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            !sex?.trim() ||
            !email?.trim() ||
            !password?.trim() ||
            !confirmPassword?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields to proceed with account creation."
            };
        }

        email = email.toLowerCase().trim();

        if (!validateEmail(email)) {
            return { success: false, message: "Invalid email format." };
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return { success: false, message: passwordError };
        }

        if (password !== confirmPassword) {
            return { success: false, message: "Password does not match." };
        }

        if (phone && !isValidPHPhone(phone)) {
            return { success: false, message: "Phone number is not valid." };
        }

        // =========================
        // CHECK EXISTING USER
        // =========================
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return {
                success: false,
                message: "Email already in use"
            };
        }

        // =========================
        // FORMAT NAMES
        // =========================
        const formattedFirstName = capitalizeEachWord(
            removeUnnecessarySpaces(firstName)
        );

        const formattedLastName = capitalizeEachWord(
            removeUnnecessarySpaces(lastName)
        );

        if (formattedFirstName.length < 4) {
            return { success: false, message: "First name should have at least 4 characters." };
        }

        if (formattedLastName.length < 4) {
            return { success: false, message: "Last name should have at least 4 characters." };
        }

        // =========================
        // FILE UPLOAD (USING uploadFile)
        // =========================
        let resume = null;
        let resumePublicId = null;

        let validId = null;
        let validIdPublicId = null;

        if (resumeFile) {
            const uploaded = await uploadFile(resumeFile, "resumes");
            resume = uploaded.url;
            resumePublicId = uploaded.publicId;
        }

        if (validIdFile) {
            const uploaded = await uploadFile(validIdFile, "valid_ids");
            validId = uploaded.url;
            validIdPublicId = uploaded.publicId;
        }

        // =========================
        // HASH PASSWORD
        // =========================
        const hashedPassword = await bcrypt.hash(password, 10);

        // =========================
        // OTP
        // =========================
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

        // =========================
        // CREATE USER
        // =========================
        const user = await Users.create({
            firstName: formattedFirstName,
            lastName: formattedLastName,
            sex,
            email,
            password: hashedPassword,
            phone: phone || null,
            linkedIn: linkedIn || null,
            portfolio: portfolio || null,
            resume,
            resumePublicId,
            validId,
            validIdPublicId,
            otp,
            otpExpireAt
        });

        // =========================
        // SEND OTP
        // =========================
        await sendMail({
            to: email,
            subject: "Your Verification Code",
            html: emailVerificationHTML({ otp })
        });

        return {
            success: true,
            message: "Account created. Please verify your email."
        };

    } catch (error) {

        if (resumePublicId) await deleteFileByPublicId(resumePublicId);
        if (validIdPublicId) await deleteFileByPublicId(validIdPublicId);

        console.error("REGISTER ERROR:", error);

        return {
            success: false,
            message: error.message
        };
    }
};

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

            await sendMail({
                to: email,
                subject: 'Your One-Time Password (OTP)',
                html: emailVerificationHTML({ otp })
            });

            return { success: false, isVerified: false }
        }

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
        };
    }
};

// UPDATE USER PROFILE
export const userUpdateService = async (
    userId,
    firstName,
    lastName,
    sex,
    phone,
    linkedIn,
    portfolio,
    resumeFile,
    validIdFile
) => {
    try {
        // =========================
        // VALIDATION
        // =========================
        if (
            !Number.isInteger(Number(userId)) ||
            !firstName?.trim() ||
            !lastName?.trim() ||
            !sex?.trim()
        ) {
            throw new Error(
                "Please complete all required fields."
            );
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        const formattedFirstName = capitalizeEachWord(
            removeUnnecessarySpaces(firstName)
        );

        const formattedLastName = capitalizeEachWord(
            removeUnnecessarySpaces(lastName)
        );

        if (formattedFirstName.length < 4) {
            throw new Error(
                "First name should have at least 4 characters."
            );
        }

        if (formattedLastName.length < 4) {
            throw new Error(
                "Last name should have at least 4 characters."
            );
        }

        if (phone && !isValidPHPhone(phone)) {
            throw new Error("Phone number is not valid.");
        }

        // =========================
        // FILE REPLACEMENT
        // =========================
        if (resumeFile) {
            const result = await replaceFile(
                resumeFile,
                user.resumePublicId,
                "resumes"
            );

            user.resume = result.url;
            user.resumePublicId = result.publicId;
        }

        if (validIdFile) {
            const result = await replaceFile(
                validIdFile,
                user.validIdPublicId,
                "valid_ids"
            );

            user.validId = result.url;
            user.validIdPublicId = result.publicId;
        }

        // =========================
        // UPDATE TEXT FIELDS
        // =========================
        user.firstName = formattedFirstName;
        user.lastName = formattedLastName;
        user.sex = sex;
        user.phone = phone || null;
        user.linkedIn = linkedIn || null;
        user.portfolio = portfolio || null;

        await user.save();

        return {
            success: true,
            message: "User profile updated successfully!"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH USER PROFILE
export const fetchUserProfileService = async (userId) => {
    try {

        const user = await Users.findOne({
            attributes: [
                "firstName",
                "lastName",
                "sex",
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
    firstName,
    lastName,
    sex,
    phone,
    linkedIn,
    portfolio,
    resumeFile,
    validIdFile,
    resumeUrl,
    validIdUrl
) => {

    let uploadedResume = null;
    let uploadedValidId = null;

    try {
        // =========================
        // VALIDATION
        // =========================
        if (
            !Number.isInteger(Number(userId)) ||
            !Number.isInteger(Number(jobId)) ||
            !firstName?.trim() ||
            !lastName?.trim() ||
            !sex?.trim() ||
            !phone?.trim() ||
            (!resumeFile && !resumeUrl) ||
            (!validIdFile && !validIdUrl)
        ) {
            throw new Error("Please complete all required fields.");
        }

        const formattedFirstName = capitalizeEachWord(
            removeUnnecessarySpaces(firstName)
        );

        const formattedLastName = capitalizeEachWord(
            removeUnnecessarySpaces(lastName)
        );

        if (formattedFirstName.length < 4) {
            throw new Error("First name should have at least 4 characters.");
        }

        if (formattedLastName.length < 4) {
            throw new Error("Last name should have at least 4 characters.");
        }

        if (!isValidPHPhone(phone)) {
            throw new Error("Must be a valid Philippine phone number.");
        }

        // =========================
        // JOB CHECK
        // =========================
        const jobExist = await Jobs.findByPk(jobId);

        if (!jobExist) {
            throw new Error("Job is not available.");
        }

        // =========================
        // PENDING APPLICATION CHECK
        // =========================
        const pendingApplication = await Applicants.findOne({
            attributes: [
                "applicantStatus",
                "isRejected",
                "canApplyAgainAt"
            ],
            where: { userId, jobId }
        });

        if (pendingApplication) {
            if (
                ["New", "Interview", "Orientation"].includes(
                    pendingApplication.applicantStatus
                ) &&
                pendingApplication.isRejected === "No"
            ) {
                throw new Error(
                    `You already have a pending application. You can apply again at ${formatDateTime(
                        pendingApplication.canApplyAgainAt
                    )}.`
                );
            }

            if (
                new Date() <
                new Date(pendingApplication.canApplyAgainAt)
            ) {
                throw new Error(
                    `You cannot apply again until ${formatDateTime(
                        pendingApplication.canApplyAgainAt
                    )}.`
                );
            }
        }

        // =========================
        // BLACKLIST CHECK
        // =========================
        const blacklistedApplication = await Applicants.findOne({
            where: {
                userId,
                blacklistedReason: { [Op.ne]: null }
            },
            include: [
                {
                    model: Jobs,
                    as: "job",
                    where: { companyId: jobExist.companyId }
                }
            ]
        });

        if (blacklistedApplication) {
            throw new Error(
                "You are blacklisted from applying to this company."
            );
        }

        // =========================
        // UPLOAD FILES
        // =========================
        try {
            // RESUME
            if (resumeFile) {
                uploadedResume = await uploadFile(resumeFile, "resumes");
            } else if (resumeUrl) {
                uploadedResume = await duplicateFileFromUrl(resumeUrl, "resumes");
            }

            // VALID ID
            if (validIdFile) {
                uploadedValidId = await uploadFile(validIdFile, "valid_ids");
            } else if (validIdUrl) {
                uploadedValidId = await duplicateFileFromUrl(validIdUrl, "valid_ids");
            }

            if (!uploadedResume || !uploadedValidId) {
                throw new Error("Upload failed");
            }

        } catch (err) {
            throw new Error("Error uploading files. Please try again.");
        }

        // =========================
        // CREATE APPLICATION
        // =========================
        const applicant = await Applicants.create({
            userId,
            jobId,
            firstName: formattedFirstName,
            lastName: formattedLastName,
            sex,
            phone,
            linkedIn,
            portfolio,

            // ✅ URLs
            resume: uploadedResume.url,
            validId: uploadedValidId.url,

            // ✅ PUBLIC IDS (IMPORTANT)
            resumePublicId: uploadedResume.publicId,
            validIdPublicId: uploadedValidId.publicId,

            canApplyAgainAt: new Date(
                Date.now() +
                6 * 30 * 24 * 60 * 60 * 1000
            )
        });

        // =========================
        // FETCH DATA FOR NOTIFICATION
        // =========================
        const createdApplicant = await Applicants.findOne({
            attributes: ["id"],
            include: [
                {
                    model: Users,
                    as: "user",
                    attributes: ["email", "firstName"]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ["jobTitle"],
                    include: [
                        {
                            model: Companies,
                            as: "company",
                            attributes: ["companyName"]
                        }
                    ]
                }
            ],
            where: { id: applicant.id }
        });

        // =========================
        // NOTIFICATION
        // =========================

        const message = `Your application for the ${createdApplicant?.job?.jobTitle} position at ${createdApplicant?.job?.company?.companyName} has been successfully submitted.

Our team will review your application and notify you if you are selected for an interview.`;

        const notification = await Notification.create({
            userId,
            title: createdApplicant?.job?.jobTitle,
            subTitle:
                createdApplicant?.job?.company?.companyName,
            message,
            type: "success"
        });

        // =========================
        // REALTIME
        // =========================
        io.to("admins").emit("dashboard");
        io.to(`user_${userId}`).emit("newNotification", notification);


        await sendMail({
            to: createdApplicant.user.email,
            subject: `Application Submitted – ${createdApplicant?.job?.jobTitle}`,
            html: applyHTML({
                firstName: createdApplicant?.user?.firstName,
                jobTitle: createdApplicant?.job?.jobTitle,
                companyName: createdApplicant?.job?.company?.companyName
            })
        });

        return {
            success: true,
            message: "Applied successfully"
        };

    } catch (error) {
        // =========================
        // CLEANUP FAILED UPLOADS
        // =========================
        if (uploadedResume?.publicId) {
            await deleteFileByPublicId(uploadedResume.publicId);
        }

        if (uploadedValidId?.publicId) {
            await deleteFileByPublicId(uploadedValidId.publicId);
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
    firstName,
    lastName,
    sex,
    phone,
    linkedIn,
    portfolio,
    resumeFile,
    validIdFile
) => {

    try {
        const application = await Applicants.findByPk(applicationId);

        if (!application) {
            throw new Error("Application not found.");
        }

        const formattedFirstName = capitalizeEachWord(
            removeUnnecessarySpaces(firstName)
        );

        const formattedLastName = capitalizeEachWord(
            removeUnnecessarySpaces(lastName)
        );

        if (formattedFirstName.length < 4) {
            throw new Error("First name should have at least 4 characters.");
        }

        if (formattedLastName.length < 4) {
            throw new Error("Last name should have at least 4 characters.");
        }

        if (!isValidPHPhone(phone)) {
            throw new Error("Must be a valid Philippine phone number.");
        }

        // =========================
        // REPLACE FILES (Cloudinary)
        // =========================
        if (resumeFile) {
            const result = await replaceFile(
                resumeFile,
                application.resumePublicId,
                "resumes"
            );

            application.resume = result.url;
            application.resumePublicId = result.publicId;
        }

        if (validIdFile) {
            const result = await replaceFile(
                validIdFile,
                application.validIdPublicId,
                "valid_ids"
            );

            application.validId = result.url;
            application.validIdPublicId = result.publicId;
        }

        // =========================
        // UPDATE TEXT FIELDS
        // =========================
        application.firstName = formattedFirstName;
        application.lastName = formattedLastName;
        application.sex = sex;
        application.phone = phone;
        application.linkedIn = linkedIn || null;
        application.portfolio = portfolio || null;

        await application.save();

        return {
            success: true,
            message: "Application updated successfully"
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// RECENT APPLICATION
export const recentApplicationService = async (userId, page = 1) => {
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
            attributes: [
                'title',
                'subTitle',
                'message',
                'type',
                'createdAt'
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

// APPLY STATUS
export const applyStatusService = async (userId, jobId) => {
    try {

        // =========================
        // GET JOB
        // =========================
        const jobExist = await Jobs.findByPk(jobId);

        if (!jobExist) {
            throw new Error("Job not found");
        }

        // =========================
        // CHECK BLACKLIST
        // =========================
        const blacklistedApplication = await Applicants.findOne({
            where: {
                userId,
                blacklistedReason: {
                    [Op.ne]: null
                }
            },
            include: [
                {
                    model: Jobs,
                    as: "job",
                    where: {
                        companyId: jobExist.companyId
                    }
                }
            ]
        });
        if (blacklistedApplication) {
            return {
                success: true,
                canApply: false,
                message: "Blacklisted"
            };
        };

        // =========================
        // CHECK IF USER APPLIED
        // =========================
        const appliedJob = await Applicants.findOne({
            attributes: ['canApplyAgainAt'],
            where: { userId, jobId },
            raw: true,
        });

        // ✅ Never applied
        if (!appliedJob) {
            return {
                success: true,
                canApply: true,
                message: "Apply"
            };
        }

        const now = new Date();

        // ⏳ Still cooling down
        if (
            appliedJob.canApplyAgainAt &&
            new Date(appliedJob.canApplyAgainAt) > now
        ) {
            return {
                success: true,
                canApply: false,
                message: "Cannot Apply"
            };
        }

        // ✅ Cooldown done
        return {
            success: true,
            canApply: true,
            message: "Apply"
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// CHANGE PASSWORD
export const changePasswordService = async (
    userId,
    password,
    confirmPassword,
) => {
    try {
        if (
            isNaN(userId) ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found."
            };
        }

        if (password !== confirmPassword) {
            return {
                success: false,
                message: 'Password does not match.'
            };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        await Users.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );

        return {
            success: true,
            message: "Change password successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};