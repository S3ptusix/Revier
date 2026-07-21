import { Op, fn, col, where } from "sequelize";
import Admins from '../models/Admin.js';
import { Applicants, Users, Jobs, Companies, OrientationEvents, Notification } from '../models/index.js'
import { cleanDateTime, formatDateTime } from "../utils/format.js";
import { addDays } from "../utils/tools.js"
import { io } from "../server.js";

// PIPELINE 
export const fetchApplicantPipelineService = async (
    search = "",
    companyId = ""
) => {
    try {
        search = search.trim();

        const whereClause = {
            isRejected: false,
        };

        // =========================
        // SEARCH (FIRST + LAST NAME FIXED)
        // =========================
        if (search) {
            whereClause[Op.or] = [
                where(
                    fn(
                        "concat",
                        col("applicant.firstName"),
                        " ",
                        col("applicant.lastName")
                    ),
                    { [Op.like]: `%${search}%` }
                ),
                { "$user.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job->company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        const jobWhere = {};
        if (companyId) {
            jobWhere.companyId = companyId;
        }

        const applicants = await Applicants.findAll({
            attributes: [
                "id",
                "firstName",   // ✅ updated
                "lastName",    // ✅ updated
                "phone",
                "applicantStatus",
                "interviewStatus",
                "interviewAt",
                "orientationId",
                "orientationStatus",
                "blacklistedReason",
            ],
            where: whereClause,
            include: [
                {
                    model: Users,
                    attributes: ["email"],
                    required: true,
                    include: {
                        model: Applicants,
                        attributes: ["id"],
                        required: false,
                        where: {
                            blacklistedReason: { [Op.ne]: null }
                        },
                    }
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ["jobTitle"],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: "company",
                            attributes: ["companyName"],
                            required: true,
                        },
                    ],
                },
                {
                    model: OrientationEvents,
                    attributes: ["eventTitle", "eventAt"],
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
            subQuery: false,
        });

        const pipeline = {
            new: [],
            interview: [],
            orientation: [],
        };

        applicants.forEach((app) => {
            if (app.applicantStatus === "New") {
                pipeline.new.push(app);
            } else if (app.applicantStatus === "Interview") {
                pipeline.interview.push(app);
            } else if (app.applicantStatus === "Orientation") {
                pipeline.orientation.push(app);
            }
        });

        return {
            success: true,
            pipeline,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// MOVE APPLICANT
export const moveApplicantService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['id', 'userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [{
                        model: Companies,
                        as: 'company',
                        attributes: ['companyName']
                    }]
                }
            ]
        });

        if (!applicant) {
            return { success: false, message: 'Applicant not found.' };
        }

        /* =========================
           UPDATE STATUS
        ========================= */
        await applicant.update({
            applicantStatus: 'Interview'
        });

        /* =========================
           CREATE NOTIFICATION
        ========================= */
        const notification = await Notification.create({
            userId: applicant.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: 'Good news! Your application has progressed to the interview stage. Please stay tuned for further details regarding your interview schedule.'
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return {
            success: true,
            message: "Applicant moved to interview successfully"
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH APPLICANT STATUS HISTORY
export const fetchApplicantStatusHistoryService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        return {
            success: true,
            statusHistory: {}
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH ALL INTERVIEWS 
export const fetchAllInterviewsService = async (
    isScheduled = false,
    search = '',
    companyId = '',
    page = 1,
) => {
    try {

        isScheduled = isScheduled === true || isScheduled === "true";
        search = search.trim();

        const limit = 10;

        const whereClause = {
            applicantStatus: 'Interview',
            isRejected: false,
            interviewAt: isScheduled ? { [Op.ne]: null } : { [Op.eq]: null },
        };

        const jobWhere = {};
        if (companyId) {
            jobWhere.companyId = companyId;
        }

        // SEARCH
        if (search) {
            whereClause[Op.or] = [
                where(
                    fn(
                        "concat",
                        col("applicant.firstName"),
                        " ",
                        col("applicant.lastName")
                    ),
                    { [Op.like]: `%${search}%` }
                ),
                { "$user.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job.company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows: applicants } = await Applicants.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'interviewStatus',
                'interviewAt',
                'interviewLocation',
                'blacklistedReason'
            ],
            include: [
                {
                    model: Users,
                    as: "user",
                    attributes: ['email'],
                    required: true,
                    include: [
                        {
                            model: Applicants,
                            attributes: ['id'],
                            where: {
                                blacklistedReason: {
                                    [Op.ne]: null
                                }
                            },
                            required: false
                        }
                    ]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: whereClause,
            order: [['interviewAt', 'DESC']],
            limit,
            offset,
            distinct: true,
            subQuery: false
        });

        return {
            success: true,
            applicants,
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

// FETCH ONE INTERVIEW
export const fetchOneInterviewsService = async (applicantId) => {
    try {
        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: [
                'interviewAt',
                'interviewMode',
                'interviewLocation',
                'interviewNotes'
            ]
        });


        return {
            success: true,
            applicant
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// RESCHEDULE INTERVIEW
export const RescheduleInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes,
) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            interviewStatus: 'Pending',
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        })

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: `Your interview is now scheduled on ${formatDateTime(interviewAt)} via ${interviewMode} at ${interviewLocation}.${interviewNotes ? ` Notes: ${interviewNotes}` : ''}`
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// SCHEDULE INTERVIEW
export const scheduleInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes
) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        })

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: `Your interview is set on ${formatDateTime(interviewAt)} via ${interviewMode} at ${interviewLocation}.${interviewNotes ? ` Notes: ${interviewNotes}` : ''}`
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return {
            success: true,
            message: "Applicant scheduled for interview successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// INTERVIEW RESULT
export const interviewResultService = async (applicantId, interviewStatus) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const interviewStatusArray = ['Passed', 'Failed'];

        interviewStatus = interviewStatusArray.includes(interviewStatus) ? interviewStatus : 'Passed';

        if (interviewStatus === 'Passed') {
            await Applicants.update({
                applicantStatus: 'Orientation',
                interviewStatus: "Passed"
            }, {
                where: { id: applicantId }
            });

        } else {

            await Applicants.update({
                applicantStatus: "Interview",
                interviewStatus: "Failed",
                isRejected: true,
                rejectedAt: new Date()
            }, {
                where: { id: applicantId }
            });
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        })

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: interviewStatus === 'Passed'
                ? `Interview Result: Passed. Congratulations! You have successfully passed the interview and will proceed to the orientation stage. Please wait for further details.`
                : `Interview Result: ${interviewStatus}. Thank you for attending the interview. We appreciate your time and interest in the position.`,
            type: interviewStatus === 'Passed' ? 'success' : 'error'
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// IS REJECTED
export const isRejectedService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        await Applicants.update({
            isRejected: true,
            rejectedAt: new Date(),
            canApplyAgainAt: addDays(new Date(), 30)
        }, {
            where: { id: applicantId }
        });

        // await Applicants.update({
        //     canApplyAgainAt: null
        // }, {
        //     where: { id: applicantId }
        // });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        })


        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: `We appreciate your interest in this position. After careful consideration, we won’t be moving forward with your application at this time.`,
            type: 'error'
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH APPLICANT TOTALS
export const fetchApplicantTotalService = async (adminId) => {
    try {

        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let totals = {
            totalApplicants: 0,
            inProcess: 0,
            hired: 0,
            rejected: 0,
        };

        totals.totalApplicants = await Applicants.count();
        totals.inProcess = await Applicants.count({
            where: {
                applicantStatus: {
                    [Op.in]: ['New', 'Interview', 'Orientation']
                },
                isRejected: false
            }
        });
        totals.hired = await Applicants.count({ where: { applicantStatus: 'Hired' } });
        totals.rejected = await Applicants.count({ where: { isRejected: true } });

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH INTERVIEW TOTALS
export const fetchInterviewTotalService = async (adminId) => {
    try {

        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let totals = {
            totalInterviewed: 0,
            pendingInterviews: 0,
            passed: 0,
            failed: 0,
        };

        totals.totalInterviewed = await Applicants.count({
            where: {
                interviewStatus: {
                    [Op.in]: ['Passed', 'Failed']
                }
            }
        });
        totals.pendingInterviews = await Applicants.count({
            where: {
                applicantStatus: 'Interview',
                interviewStatus: 'Pending',
                isRejected: false
            }
        });
        totals.passed = await Applicants.count({ where: { interviewStatus: 'Passed' } });
        totals.failed = await Applicants.count({ where: { interviewStatus: 'Failed' } });

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// APPLICANT DETAILS
export const applicantDetailsService = async (applicantId) => {
    try {
        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: [
                'userId',
                'firstName',
                'lastName',
                'sex',
                'phone',
                'createdAt',
                'linkedIn',
                'portfolio',
                'resume',
                'validId',
                'interviewAt',
                'interviewMode',
                'interviewLocation',
                'interviewStatus',
                'orientationStatus',
                'applicantStatus'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email']
                },
                {
                    model: Jobs,
                    attributes: ['jobTitle'],
                    as: 'job',
                    include: [
                        {
                            model: Companies,
                            attributes: ['companyName'],
                            as: 'company'
                        }
                    ]
                },
                {
                    model: OrientationEvents,
                    attributes: [
                        'eventAt',
                        'eventTitle',
                        'location'
                    ]
                }
            ]
        });

        const userId = applicant.userId;
        const blacklist = await Applicants.findAll({
            attributes: ['blacklistedReason'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: {
                userId,
                blacklistedReason: {
                    [Op.ne]: null
                }
            }
        })

        return {
            success: true,
            applicant,
            blacklist
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// APPLICANT TOTALS
export const applicantTotalsService = async (
    search = '',
    companyId = null
) => {
    try {

        companyId = parseInt(companyId);

        const companyWhere =
            Number.isInteger(companyId) && !isNaN(companyId)
                ? { id: companyId }
                : undefined;

        // =========================
        // BASE WHERE
        // =========================
        const whereClause = {};

        // 🔍 SEARCH
        if (search?.trim()) {
            whereClause[Op.or] = [
                where(
                    fn(
                        "concat",
                        col("applicant.firstName"),
                        " ",
                        col("applicant.lastName")
                    ),
                    { [Op.like]: `%${search}%` }
                ),
                { "$user.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job->company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        // =========================
        // INCLUDE
        // =========================
        const include = [
            {
                model: Users,
                as: "user",
                attributes: ["email"]
            },
            {
                model: Jobs,
                as: "job",
                required: true, // 👈 important to enforce filtering
                include: [
                    {
                        model: Companies,
                        as: "company",
                        required: !!companyWhere,
                        ...(companyWhere && { where: companyWhere })
                    }
                ]
            }
        ];

        // =========================
        // COUNTS
        // =========================
        const totalApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: {
                    [Op.ne]: 'Hired'
                },
                isRejected: false
            },
            include
        });

        const newApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "New",
                isRejected: false
            },
            include
        });

        const interviewApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "Interview",
                interviewAt: null,
                isRejected: false
            },
            include
        });

        const interviewScheduledApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "Interview",
                interviewAt: {
                    [Op.ne]: null
                },
                isRejected: false
            },
            include
        });

        const orientationApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "Orientation",
                orientationId: null,
                isRejected: false
            },
            include
        });

        const orientationScheduledApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "Orientation",
                orientationId: {
                    [Op.ne]: null
                },
                isRejected: false
            },
            include
        });

        const hired = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "Hired"
            },
            include
        });

        const rejected = await Applicants.count({
            where: {
                ...whereClause,
                isRejected: true
            },
            include
        });

        // =========================
        // RESPONSE
        // =========================
        return {
            success: true,
            data: {
                totalApplicants,
                new: newApplicants,
                interview: interviewApplicants,
                scheduledForInterview: interviewScheduledApplicants,
                orientation: orientationApplicants,
                scheduledForOrientation: orientationScheduledApplicants,
                hired,
                rejected
            }
        };

    } catch (error) {
        throw error;
    }
};