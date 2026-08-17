import { Op, fn, col, where } from "sequelize";
import Admins from '../models/Admin.js';
import { Applicants, Users, Jobs, Companies, OrientationEvents, Notification } from '../models/index.js'
import { formatDateTime } from "../utils/format.js";
import { addDays } from "../utils/tools.js"
import { io } from "../server.js"
import { getCompanyScope } from '../utils/getCompanyScope.js';

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
            rejectedReasonNote: null,
        };

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: [
                'userId',
                'firstName',
                'lastName',
                'sex',
                'birthday',
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
                'rejectedReasonNote'
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
        trackApplication.rejectedReasonNote = applicant.rejectedReasonNote;

        const userId = applicant.userId;

        const blacklist = await Applicants.findAll({
            attributes: ['blacklistedReasonNote', 'blacklistedAt'],
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
    companyId = null,
    role,
    adminId
) => {
    try {

        companyId = parseInt(companyId);
        const hasCompanyIdFilter = Number.isInteger(companyId) && !isNaN(companyId);

        const emptyData = {
            totalApplicants: 0,
            new: 0,
            interview: 0,
            orientation: 0,
            hired: 0,
            rejected: 0
        };

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, data: emptyData };

        // combine the requested companyId (if any) with the admin's allowed companies
        let companyWhere;
        if (hasCompanyIdFilter) {
            if (scope.restricted) {
                const allowedIds = scope.companyWhere.id; // array from getCompanyScope
                if (!allowedIds.includes(companyId)) {
                    // requested a company outside their access — no data, not an error
                    return { success: true, data: emptyData };
                }
            }
            companyWhere = { id: companyId };
        } else {
            companyWhere = scope.restricted ? scope.companyWhere : undefined;
        }

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
                isRejected: false
            },
            include
        });

        const orientationApplicants = await Applicants.count({
            where: {
                ...whereClause,
                applicantStatus: "Orientation",
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
                orientation: orientationApplicants,
                hired,
                rejected
            }
        };

    } catch (error) {
        throw error;
    }
};