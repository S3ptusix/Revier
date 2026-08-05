import { Op, fn, col, literal, where as sequelizeWhere } from "sequelize";
import { Applicants, Companies, Jobs, OrientationEvents } from "../models/index.js";


// ======================================================
// RECRUITMENT OVERVIEW DASHBOARD
// ======================================================

export const recruitmentOverviewService = async (
    companyId = null,
    year = new Date().getFullYear()
) => {
    try {

        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59);

        const include = companyId ? [{
            model: Jobs,
            as: "job",
            attributes: [],
            where: { companyId },
            required: true
        }] : [];

        const baseWhere = {
            createdAt: { [Op.between]: [start, end] }
        };

        const totalApplicants = await Applicants.count({
            where: baseWhere,
            include,
            distinct: true
        });

        const hiredApplicants = await Applicants.count({
            where: { ...baseWhere, applicantStatus: "Hired" },
            include,
            distinct: true
        });

        const rejectedApplicants = await Applicants.count({
            where: { ...baseWhere, isRejected: true },
            include,
            distinct: true
        });

        const activeApplicants = await Applicants.count({
            where: {
                ...baseWhere,
                isRejected: false,
                applicantStatus: { [Op.ne]: "Hired" }
            },
            include,
            distinct: true
        });

        return {
            success: true,
            data: {
                totalApplicants,
                activeApplicants,
                hiredApplicants,
                rejectedApplicants,
                hiringRate:
                    totalApplicants > 0
                        ? Number(((hiredApplicants / totalApplicants) * 100).toFixed(2))
                        : 0
            }
        };

    } catch (error) {
        throw error;
    }
};


// ======================================================
// HIRING TREND ANALYSIS
// ======================================================

export const hiringTrendService = async (
    year = new Date().getFullYear(),
    companyId = null
) => {
    try {

        const result = [];

        const include = companyId ? [{
            model: Jobs,
            as: "job",
            attributes: [],
            where: { companyId },
            required: true
        }] : [];

        for (let m = 0; m < 12; m++) {

            const start = new Date(year, m, 1);
            const end = new Date(year, m + 1, 0, 23, 59, 59);

            const applicants = await Applicants.count({
                where: { createdAt: { [Op.between]: [start, end] } },
                include,
                distinct: true
            });

            const hired = await Applicants.count({
                where: {
                    hiredAt: { [Op.between]: [start, end] },
                    applicantStatus: "Hired"
                },
                include,
                distinct: true
            });

            result.push({
                month: start.toLocaleString("default", { month: "long" }),
                applicants,
                hired,
                hiringRate: applicants > 0
                    ? Number(((hired / applicants) * 100).toFixed(2))
                    : 0
            });
        }

        return { success: true, data: result };

    } catch (error) {
        throw error;
    }
};



// ======================================================
// ATTRITION RATE TREND
// ======================================================

export const attritionTrendService = async (
    year = new Date().getFullYear(),
    companyId = null
) => {
    try {

        const data = [];

        const include = companyId ? [{
            model: Jobs,
            as: "job",
            attributes: [],
            where: { companyId },
            required: true
        }] : [];

        for (let m = 0; m < 12; m++) {

            const start = new Date(year, m, 1);
            const end = new Date(year, m + 1, 0, 23, 59, 59);

            const rejected = await Applicants.count({
                where: {
                    rejectedAt: { [Op.between]: [start, end] },
                    isRejected: true
                },
                include,
                distinct: true
            });

            const processed = await Applicants.count({
                where: { createdAt: { [Op.between]: [start, end] } },
                include,
                distinct: true
            });

            data.push({
                month: start.toLocaleString("default", { month: "long" }),
                rejected,
                processed,
                attritionRate: processed > 0
                    ? Number(((rejected / processed) * 100).toFixed(2))
                    : 0
            });
        }

        return { success: true, data };

    } catch (error) {
        throw error;
    }
};



// ======================================================
// HIRING VELOCITY
// Average Days From Application To Hiring
// ======================================================

export const hiringVelocityService = async (
    companyId = null,
    year = new Date().getFullYear()
) => {
    try {

        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59);

        const include = [{
            model: Jobs,
            as: "job",
            attributes: [],
            where: companyId ? { companyId } : {},
            required: !!companyId
        }];

        const applicants = await Applicants.findAll({
            attributes: ["createdAt", "hiredAt"],
            where: {
                hiredAt: { [Op.between]: [start, end] }
            },
            include
        });

        const months = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString("default", { month: "short" }),
            total: 0,
            count: 0
        }));

        applicants.forEach(a => {
            if (!a.hiredAt) return;

            const m = new Date(a.hiredAt).getMonth();
            const days = (a.hiredAt - a.createdAt) / (1000 * 60 * 60 * 24);

            months[m].total += days;
            months[m].count++;
        });

        return {
            success: true,
            data: months.map(m => ({
                month: m.month,
                hiringVelocity: m.count > 0
                    ? Number((m.total / m.count).toFixed(2))
                    : 0
            }))
        };

    } catch (error) {
        throw error;
    }
};



// ======================================================
// JOB POSITION PERFORMANCE
// ======================================================

export const jobPerformanceService = async ({
    companyId = null,
    year = new Date().getFullYear()
} = {}) => {

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const jobWhere = companyId ? { companyId } : {};

    const result = await Applicants.findAll({
        attributes: [
            [col("job.jobTitle"), "job"],
            [fn("COUNT", literal("*")), "applicants"],
            [fn("SUM", literal(`CASE WHEN applicantStatus='Hired' THEN 1 ELSE 0 END`)), "hired"]
        ],
        where: {
            createdAt: { [Op.between]: [start, end] }
        },
        include: [{
            model: Jobs,
            as: "job",
            attributes: [],
            where: jobWhere,
            required: !!companyId
        }],
        group: ["job.id", "job.jobTitle"],
        order: [[literal("hired"), "DESC"]],
        raw: true
    });

    let data = result.map(r => {
        const applicants = Number(r.applicants);
        const hired = Number(r.hired);
        return {
            job: r.job,
            applicants,
            hired,
            successRate: applicants > 0
                ? Number(((hired / applicants) * 100).toFixed(2))
                : 0
        };
    });

    if (!companyId) data = data.slice(0, 5);

    return { success: true, data };
};


// ======================================================
// COMPANY HIRING PERFORMANCE
// ======================================================

export const companyPerformanceService = async ({
    companyId = null,
    year = new Date().getFullYear()
} = {}) => {

    try {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59);


        const companyWhere = companyId ? { id: companyId } : {};

        const result = await Applicants.findAll({

            attributes: [

                [col("job.company.companyName"), "companyName"],

                [fn("COUNT", literal("*")), "applicants"],

                [
                    fn(
                        "SUM",
                        literal(`CASE WHEN applicant.applicantStatus = 'Hired' THEN 1 ELSE 0 END`)
                    ),
                    "hired"
                ],

                // ✅ FIXED: precise days using hours
                [
                    fn(
                        "SUM",
                        literal(`
                            CASE 
                                WHEN applicant.applicantStatus = 'Hired' 
                                AND applicant.hiredAt IS NOT NULL
                                THEN TIMESTAMPDIFF(HOUR, applicant.createdAt, applicant.hiredAt) / 24
                                ELSE 0
                            END
                        `)
                    ),
                    "totalDays"
                ],

                [
                    fn(
                        "SUM",
                        literal(`
                    CASE 
                        WHEN applicant.applicantStatus = 'Hired' AND applicant.hiredAt IS NOT NULL
                        THEN 1
                        ELSE 0
                    END
                `)
                    ),
                    "hiredCount"
                ]
            ],

            where: sequelizeWhere(
                col("applicant.createdAt"),
                {
                    [Op.between]: [start, end]
                }
            ),

            include: [
                {
                    model: Jobs,
                    as: "job",
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: "company",
                            attributes: [],
                            where: companyWhere,
                            required: !!companyId
                        }
                    ]
                }
            ],

            group: ["job.company.id", "job.company.companyName"],

            order: [[literal("hired"), "DESC"]],

            raw: true
        });

        const formatted = result.map(r => {

            const applicants = Number(r.applicants) || 0;
            const hired = Number(r.hired) || 0;
            const totalDays = Number(r.totalDays) || 0;
            const hiredCount = Number(r.hiredCount) || 0;

            return {
                companyName: r.companyName,
                applicants,
                hired,
                successRate:
                    applicants > 0
                        ? Number(((hired / applicants) * 100).toFixed(2))
                        : 0,
                averageDaysToHire:
                    hiredCount > 0
                        ? Number((totalDays / hiredCount).toFixed(2))
                        : 0
            };
        });

        return {
            success: true,
            data: formatted
        };

    } catch (error) {
        throw error;
    }
};

// ======================================================
// Dashboard Totals
// ======================================================

export const dashboardTotalsService = async (
    companyId = null,
    year = new Date().getFullYear()
) => {
    
    try {

        // ================================
        // DATE RANGE (YEAR)
        // ================================
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59);
        const now = new Date();

        // ================================
        // COMPANY FILTER
        // ================================
        const include = companyId ? [{
            model: Jobs,
            as: "job",
            attributes: [],
            where: { companyId },
            required: true
        }] : [];

        // ================================
        // BASE WHERE
        // ================================
        const baseWhere = {
            createdAt: {
                [Op.between]: [start, end]
            }
        };

        // ================================
        // BASIC COUNTS
        // ================================
        const totalApplicants = await Applicants.count({
            where: baseWhere,
            include,
            distinct: true
        });

        const newApplicants = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: "New",
                isRejected: false
            },
            include,
            distinct: true
        });

        const interviewStage = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: "Interview",
                isRejected: false
            },
            include,
            distinct: true
        });

        const orientationStage = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: "Orientation",
                isRejected: false
            },
            include,
            distinct: true
        });

        const hired = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: "Hired"
            },
            include,
            distinct: true
        });

        const rejected = await Applicants.count({
            where: {
                ...baseWhere,
                isRejected: true
            },
            include,
            distinct: true
        });

        // ================================
        // PIPELINE / OPERATIONS
        // ================================
        const scheduledInterviews = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: "Interview",
                interviewAt: { [Op.ne]: null },
                isRejected: false
            },
            include,
            distinct: true
        });

        const scheduledOrientations = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: "Orientation",
                orientationId: { [Op.ne]: null },
                isRejected: false
            },
            include,
            distinct: true
        });

        const incomingOrientations = await Applicants.count({
            where: {
                applicantStatus: "Orientation",
                isRejected: false
            },
            include: [
                {
                    model: OrientationEvents,
                    attributes: [],
                    required: true,
                    where: {
                        eventAt: {
                            [Op.gte]: now
                        }
                    }
                },
                ...include // your Jobs filter if companyId exists
            ],
            distinct: true
        });

        const activePipeline = await Applicants.count({
            where: {
                ...baseWhere,
                isRejected: false,
                applicantStatus: {
                    [Op.ne]: "Hired"
                }
            },
            include,
            distinct: true
        });

        // ================================
        // PERFORMANCE
        // ================================
        const hiringRate =
            totalApplicants > 0
                ? Number(((hired / totalApplicants) * 100).toFixed(2))
                : 0;

        const processed = await Applicants.count({
            where: {
                ...baseWhere,
                applicantStatus: {
                    [Op.in]: ["Interview", "Orientation", "Hired"]
                }
            },
            include,
            distinct: true
        });

        const attritionRate =
            processed > 0
                ? Number(((rejected / processed) * 100).toFixed(2))
                : 0;

        // ================================
        // HIRING VELOCITY
        // ================================
        const hiredApplicants = await Applicants.findAll({
            where: {
                applicantStatus: "Hired",
                hiredAt: {
                    [Op.between]: [start, end]
                }
            },
            include,
            attributes: ["createdAt", "hiredAt"]
        });

        const totalDays = hiredApplicants.reduce((sum, app) => {
            if (!app.hiredAt) return sum;

            const diff =
                new Date(app.hiredAt) -
                new Date(app.createdAt);

            return sum + (diff / (1000 * 60 * 60 * 24));
        }, 0);

        const avgHiringDays =
            hiredApplicants.length > 0
                ? Number((totalDays / hiredApplicants.length).toFixed(2))
                : 0;

        return {
            success: true,
            data: {
                totals: {
                    totalApplicants,
                    newApplicants,
                    interviewStage,
                    orientationStage,
                    hired,
                    rejected
                },
                operations: {
                    scheduledInterviews,
                    scheduledOrientations,
                    incomingOrientations,
                    activePipeline
                },
                performance: {
                    hiringRate,
                    attritionRate,
                    avgHiringDays
                }
            }
        };

    } catch (error) {
        throw error;
    }
};