import { Op, fn, col, where } from "sequelize";
import Admins from '../models/Admin.js';
import { Applicants, Users, Jobs, Companies, OrientationEvents, Notification } from '../models/index.js'
import { formatDateTime } from "../utils/format.js";
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
    search = '',
    companyId = '',
    page = 1,
) => {
    try {
        search = search.trim();

        const limit = 10;

        const whereClause = {
            applicantStatus: 'Interview',
            isRejected: false
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

        const trackApplication = {
            appliedAt: null,
            interviewedAt: null,
            orientedAt: null,
            hiredAt: null,
            rejectedAt: null,
        };

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
                'applicantStatus',
                'hiredAt',
                'isRejected',
                'rejectedAt',
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
                    as: 'orientationEvent',
                    attributes: [
                        'eventAt',
                        'eventTitle',
                        'location'
                    ]
                }
            ]
        });

        trackApplication.appliedAt = applicant.createdAt;
        trackApplication.interviewedAt = applicant.interviewAt;
        trackApplication.orientedAt = applicant.orientationEvent?.eventAt || null;
        trackApplication.hiredAt = applicant.hiredAt;
        trackApplication.rejectedAt = applicant.rejectedAt;

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
            trackApplication,
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