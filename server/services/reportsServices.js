import { Applicants, ApplicantStatusHistory, Companies, Jobs } from "../models/index.js";
import { Sequelize, Op } from 'sequelize';

// REPORTS TOTALS
export const fetchReportsTotalService = async (companyId, monthYear) => {
    try {

        const dateFilter = monthYear
            ? { [Op.between]: [`${monthYear}-01`, `${monthYear}-31`] }
            : undefined;

        const jobFilter = {};
        if (companyId) jobFilter.companyId = companyId;
        if (dateFilter) jobFilter.createdAt = dateFilter;

        const applicantInclude = {
            model: Applicants,
            attributes: [],
            required: true,
            include: [
                {
                    model: Jobs,
                    as: "job",
                    attributes: [],
                    where: companyId ? { companyId } : undefined,
                    required: true
                }
            ]
        };

        const [totalHires, totalApplications, totalRejected] = await Promise.all([

            ApplicantStatusHistory.count({
                where: {
                    applicantStatus: "Hired",
                    ...(dateFilter && { createdAt: dateFilter })
                },
                include: [applicantInclude]
            }),

            ApplicantStatusHistory.count({
                where: {
                    applicantStatus: "New",
                    ...(dateFilter && { createdAt: dateFilter })
                },
                include: [applicantInclude]
            }),

            ApplicantStatusHistory.count({
                where: {
                    applicantStatus: 'Rejected',
                    ...(dateFilter && { createdAt: dateFilter })
                },
                include: [applicantInclude]
            })

        ]);

        const attritionRate = ((totalRejected / totalApplications) * 100).toFixed(2);

        return {
            success: true,
            totals: {
                totalHires,
                totalApplications,
                totalRejected,
                attritionRate: (attritionRate == 'NaN') ? (0).toFixed(2) : attritionRate
            }
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// HIRING TRENDS ANALYSIS
export const hiringTrendsAnalysisService = async (companyId, year) => {
    try {

        const results = await ApplicantStatusHistory.findAll({
            attributes: [
                [Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt")), "month"],
                "applicantStatus",
                [Sequelize.fn("COUNT", Sequelize.col("ApplicantStatusHistory.id")), "count"]
            ],
            where: {
                createdAt: {
                    [Op.between]: [`${year}-01-01`, `${year}-12-31`]
                }
            },
            include: [
                {
                    model: Applicants,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Jobs,
                            as: "job",
                            attributes: [],
                            where: companyId ? { companyId } : undefined,
                            required: true
                        }
                    ]
                }
            ],
            group: [
                Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt")),
                "applicantStatus"
            ],
            order: [[Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt")), "ASC"]],
            raw: true
        });

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const statuses = ["New", "Interview", "Orientation", "Hired", "Rejected"];

        const trends = months.map((month, index) => {

            const monthData = { month };

            statuses.forEach(status => {
                const found = results.find(
                    r => Number(r.month) === index + 1 && r.applicantStatus === status
                );

                monthData[status] = found ? Number(found.count) : 0;
            });

            return monthData;
        });

        return {
            success: true,
            trends
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// ATTRITION RATE TREND
export const attritionRateTrendService = async (companyId, year) => {
    try {

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Total applicants per month
        const totalApplicantsResults = await ApplicantStatusHistory.findAll({
            attributes: [
                [Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt")), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("ApplicantStatusHistory.id")), "count"]
            ],
            where: {
                applicantStatus: "New",
                createdAt: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] }
            },
            include: [
                {
                    model: Applicants,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Jobs,
                            as: "job",
                            attributes: [],
                            where: companyId ? { companyId } : undefined,
                            required: true
                        }
                    ]
                }
            ],
            group: [Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt"))],
            raw: true
        });

        // Rejected applicants per month
        const rejectedResults = await ApplicantStatusHistory.findAll({
            attributes: [
                [Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt")), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("ApplicantStatusHistory.id")), "count"]
            ],
            where: {
                applicantStatus: "Rejected",
                createdAt: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] }
            },
            include: [
                {
                    model: Applicants,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Jobs,
                            as: "job",
                            attributes: [],
                            where: companyId ? { companyId } : undefined,
                            required: true
                        }
                    ]
                }
            ],
            group: [Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt"))],
            raw: true
        });

        // Map each month to attrition rate
        const trends = months.map((monthName, index) => {
            const month = index + 1;

            const applicants = Number(
                totalApplicantsResults.find(r => Number(r.month) === month)?.count || 0
            );

            const rejectedApplicants = Number(
                rejectedResults.find(r => Number(r.month) === month)?.count || 0
            );

            const attritionRate = applicants
                ? ((rejectedApplicants / applicants) * 100).toFixed(2)
                : 0;

            return {
                month: monthName,
                attritionRate: Number(attritionRate)
            };
        });

        return {
            success: true,
            trends
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};;

// FETCH STATUS DISTRIBUTIONS
export const fetchStatusDistributionService = async () => {
    try {

        const [newApplicants, interview, orientation, hired, rejected] = await Promise.all([

            Applicants.count({
                where: {
                    applicantStatus: "New",
                    isRejected: "No",
                }
            }),

            Applicants.count({
                where: {
                    applicantStatus: "Interview",
                    isRejected: "No",
                }
            }),

            Applicants.count({
                where: {
                    applicantStatus: "Orientation",
                    isRejected: "No",
                }
            }),

            Applicants.count({
                where: {
                    applicantStatus: "Hired",
                    isRejected: "No",
                }
            }),

            Applicants.count({
                where: {
                    isRejected: "Yes",
                }
            }),

        ]);

        const total =
            newApplicants +
            interview +
            orientation +
            hired +
            rejected;

        const percent = (value) =>
            total === 0 ? 0 : ((value / total) * 100).toFixed(2);

        const totals = {
            new: {
                total: newApplicants,
                percentage: percent(newApplicants),
            },
            interview: {
                total: interview,
                percentage: percent(interview),
            },
            orientation: {
                total: orientation,
                percentage: percent(orientation),
            },
            hired: {
                total: hired,
                percentage: percent(hired),
            },
            rejected: {
                total: rejected,
                percentage: percent(rejected),
            },
        };

        return {
            success: true,
            totalApplicants: total,
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

// JOBS BY INDUSTRY
export const jobsByIndustryService = async () => {
    try {
        // Count open jobs grouped by company industry
        const results = await Jobs.findAll({
            attributes: [
                [Sequelize.col("company.industry"), "industry"],
                [Sequelize.fn("COUNT", Sequelize.col("job.id")), "total"]
            ],
            where: {
                status: "open"
            },
            include: [
                {
                    model: Companies,
                    as: "company",
                    attributes: [],
                    required: true
                }
            ],
            group: ["company.industry"],
            raw: true
        });

        // Format simple total per industry
        const totals = results.map(item => ({
            industry: item.industry,
            total: Number(item.total)
        }));

        return {
            success: true,
            totals
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};

// TOP PERFORMANCE COMPANIES
export const topPerformanceCompaniesService = async () => {
    try {
        // Count Hired and New applicants per company
        const results = await Applicants.findAll({
            attributes: [
                [Sequelize.col("job.company.id"), "companyId"],
                [Sequelize.col("job.company.companyName"), "companyName"],
                [Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN applicantStatus = 'Hired' THEN 1 ELSE 0 END`)), "hiredCount"],
                [Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN applicantStatus = 'New' THEN 1 ELSE 0 END`)), "newCount"]
            ],
            include: [
                {
                    model: Jobs,
                    as: "job",
                    attributes: [],
                    include: [
                        {
                            model: Companies,
                            as: "company",
                            attributes: []
                        }
                    ]
                }
            ],
            group: ["job.company.id"],
            order: [[Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN applicantStatus = 'Hired' THEN 1 ELSE 0 END`)), "DESC"]],
            raw: true
        });
       
        return {
            success: true,
            data: results
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};