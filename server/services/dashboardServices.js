import { Op, fn, col } from "sequelize";
import { Applicants, Jobs, Companies, OrientationEvents } from "../models/index.js";
import { calculateChange } from "../utils/tools.js";
import { getCompanyScope } from "../utils/getCompanyScope.js";

// ============================
// 1. PIPELINE COUNTS
// ============================
export const fetchPipelineCountsService = async (role, adminId) => {
    try {
        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };

        const pipeline = { New: 0, Interview: 0, Orientation: 0, Hired: 0 };

        if (scope.empty) {
            return { success: true, pipeline };
        }

        const pipelineCounts = await Applicants.findAll({
            attributes: [
                "applicantStatus",
                [fn("COUNT", col("applicant.id")), "count"]
            ],
            where: { isRejected: false },
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
                            required: true,
                            where: scope.companyWhere
                        }
                    ]
                }
            ],
            group: ["applicantStatus"],
            subQuery: false
        });

        pipelineCounts.forEach(item => {
            pipeline[item.applicantStatus] = Number(item.dataValues.count);
        });

        return { success: true, pipeline };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

// ============================
// 2. SUMMARY WITH COMPARISON
// ============================
export const fetchDashboardSummaryService = async (role, adminId) => {
    try {
        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };

        const emptySummary = {
            totalApplicants: calculateChange(0, 0),
            hired: calculateChange(0, 0),
            rejected: calculateChange(0, 0),
            openPositions: calculateChange(0, 0)
        };

        if (scope.empty) {
            return { success: true, summary: emptySummary };
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const applicantCompanyInclude = [
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
                        required: true,
                        where: scope.companyWhere
                    }
                ]
            }
        ];

        const jobCompanyInclude = [
            {
                model: Companies,
                as: "company",
                attributes: [],
                required: true,
                where: scope.companyWhere
            }
        ];

        // TOTAL APPLICANTS
        const totalApplicants = await Applicants.count({
            where: { isRejected: false },
            include: applicantCompanyInclude,
            distinct: true,
            col: "id"
        });

        const lastMonthApplicants = await Applicants.count({
            where: {
                isRejected: false,
                createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] }
            },
            include: applicantCompanyInclude,
            distinct: true,
            col: "id"
        });

        // HIRED
        const hiredThisMonth = await Applicants.count({
            where: { applicantStatus: "Hired", hiredAt: { [Op.gte]: startOfMonth } },
            include: applicantCompanyInclude,
            distinct: true,
            col: "id"
        });

        const hiredLastMonth = await Applicants.count({
            where: { applicantStatus: "Hired", hiredAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
            include: applicantCompanyInclude,
            distinct: true,
            col: "id"
        });

        // REJECTED
        const rejectedThisMonth = await Applicants.count({
            where: { isRejected: true, rejectedAt: { [Op.gte]: startOfMonth } },
            include: applicantCompanyInclude,
            distinct: true,
            col: "id"
        });

        const rejectedLastMonth = await Applicants.count({
            where: { isRejected: true, rejectedAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
            include: applicantCompanyInclude,
            distinct: true,
            col: "id"
        });

        // OPEN POSITIONS
        const openPositions = await Jobs.count({
            where: { status: "Open" },
            include: jobCompanyInclude,
            distinct: true,
            col: "id"
        });

        const openPositionsLastMonth = await Jobs.count({
            where: { status: "Open", createdAt: { [Op.lte]: endOfLastMonth } },
            include: jobCompanyInclude,
            distinct: true,
            col: "id"
        });

        return {
            success: true,
            summary: {
                totalApplicants: calculateChange(totalApplicants, lastMonthApplicants),
                hired: calculateChange(hiredThisMonth, hiredLastMonth),
                rejected: calculateChange(rejectedThisMonth, rejectedLastMonth),
                openPositions: calculateChange(openPositions, openPositionsLastMonth)
            }
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

// ============================
// 3. INTERVIEWS TODAY
// ============================
export const fetchInterviewsTodayService = async (role, adminId) => {
    try {
        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, interviewsToday: [] };

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const interviewsToday = await Applicants.findAll({
            where: {
                applicantStatus: "Interview",
                interviewAt: { [Op.between]: [todayStart, todayEnd] }
            },
            attributes: ["id", "firstName", "lastName", "interviewAt", "interviewMode"],
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
                            required: true,
                            where: scope.companyWhere
                        }
                    ]
                }
            ],
            order: [["interviewAt", "ASC"]],
            subQuery: false
        });

        return { success: true, interviewsToday };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

// ============================
// 4. UPCOMING ORIENTATIONS
// ============================
// ⚠️ Assumes OrientationEvents relates to Applicants (as "applicants"), which relates
// to Jobs -> Companies. Confirm/adjust the `as` alias against your real associations.
export const fetchUpcomingOrientationsService = async (role, adminId) => {
    try {
        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, upcomingOrientations: [] };

        const now = new Date();

        const upcomingOrientations = await OrientationEvents.findAll({
            where: { eventAt: { [Op.gte]: now } },
            attributes: [
                "id",
                "eventTitle",
                "location",
                "eventAt",
                [fn("COUNT", col("applicants.id")), "attendeesCount"]
            ],
            include: [
                {
                    model: Applicants,
                    as: "applicants",
                    attributes: [],
                    required: true,
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
                                    required: true,
                                    where: scope.companyWhere
                                }
                            ]
                        }
                    ]
                }
            ],
            group: ["id"],
            order: [["eventAt", "ASC"]],
            limit: 10,
            subQuery: false
        });

        return { success: true, upcomingOrientations };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};