import {
    Applicants,
    ApplicantStatusHistory,
    Companies,
    Jobs
} from "../models/index.js";
import {
    Sequelize,
    Op
} from "sequelize";

// REPORTS TOTALS
export const fetchReportsTotalService = async (companyId, monthYear) => {
    try {
        const { Op, Sequelize } = require("sequelize");

        const startDate = monthYear ? `${monthYear}-01` : null;
        const endDate = monthYear ? `${monthYear}-31` : null;

        const dateFilter = monthYear
            ? { [Op.between]: [startDate, endDate] }
            : undefined;

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

        // ✅ UNIQUE APPLICATIONS (based on "New")
        const totalApplications = await ApplicantStatusHistory.count({
            distinct: true,
            col: "applicantId",
            where: {
                applicantStatus: "New",
                ...(dateFilter && { createdAt: dateFilter })
            },
            include: [applicantInclude]
        });

        // ✅ UNIQUE HIRES
        const totalHires = await ApplicantStatusHistory.count({
            distinct: true,
            col: "applicantId",
            where: {
                applicantStatus: "Hired",
                ...(dateFilter && { createdAt: dateFilter })
            },
            include: [applicantInclude]
        });

        // ✅ UNIQUE REJECTED
        const totalRejected = await ApplicantStatusHistory.count({
            distinct: true,
            col: "applicantId",
            where: {
                applicantStatus: "Rejected",
                ...(dateFilter && { createdAt: dateFilter })
            },
            include: [applicantInclude]
        });

        // ✅ TOTAL PROCESSED (same cohort)
        const totalProcessed = await ApplicantStatusHistory.count({
            distinct: true,
            col: "applicantId",
            where: {
                applicantStatus: {
                    [Op.in]: ["Rejected", "Hired"]
                },
                ...(dateFilter && { createdAt: dateFilter })
            },
            include: [applicantInclude]
        });

        // ✅ CORRECT ATTRITION
        const attritionRate = totalProcessed
            ? ((totalRejected / totalProcessed) * 100).toFixed(2)
            : "0.00";

        return {
            success: true,
            totals: {
                totalHires,
                totalApplications,
                totalRejected,
                attritionRate
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

        // 1️⃣ GET AGGREGATED COUNTS (existing logic)
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
            order: [
                [Sequelize.fn("MONTH", Sequelize.col("ApplicantStatusHistory.createdAt")), "ASC"]
            ],
            raw: true
        });

        // 2️⃣ GET FULL HISTORY (for RESIGN logic)
        const histories = await ApplicantStatusHistory.findAll({
            attributes: ["applicantId", "applicantStatus", "createdAt"],
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
            order: [
                ["applicantId", "ASC"],
                ["createdAt", "ASC"]
            ],
            raw: true
        });

        // 3️⃣ CALCULATE RESIGN (Hired → Rejected)
        const resignCounts = Array(12).fill(0);

        let prev = null;

        histories.forEach(curr => {
            if (
                prev &&
                prev.applicantId === curr.applicantId &&
                prev.applicantStatus === "Hired" &&
                curr.applicantStatus === "Rejected"
            ) {
                const monthIndex = new Date(curr.createdAt).getMonth(); // 0–11
                resignCounts[monthIndex]++;
            }

            prev = curr;
        });

        // 4️⃣ BUILD FINAL STRUCTURE
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const statuses = [
            "New",
            "Interview",
            "Orientation",
            "Hired",
            "Rejected",
            "Resign" // 👈 added
        ];

        const trends = months.map((month, index) => {

            const monthData = { month };

            statuses.forEach(status => {

                if (status === "Resign") {
                    monthData[status] = resignCounts[index];
                } else {
                    const found = results.find(
                        r => Number(r.month) === index + 1 &&
                             r.applicantStatus === status
                    );

                    monthData[status] = found ? Number(found.count) : 0;
                }

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
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

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

        const trends = [];

        for (let i = 0; i < 12; i++) {

            const start = new Date(year, i, 1);
            const end = new Date(year, i + 1, 1);

            const dateFilter = {
                [Op.gte]: start,
                [Op.lt]: end
            };

            // SAME AS REPORT
            const totalRejected = await ApplicantStatusHistory.count({
                distinct: true,
                col: "applicantId",
                where: {
                    applicantStatus: "Rejected",
                    createdAt: dateFilter
                },
                include: [applicantInclude]
            });

            const totalProcessed = await ApplicantStatusHistory.count({
                distinct: true,
                col: "applicantId",
                where: {
                    applicantStatus: {
                        [Op.in]: ["Rejected", "Hired"]
                    },
                    createdAt: dateFilter
                },
                include: [applicantInclude]
            });

            trends.push({
                month: months[i],
                attritionRate: totalProcessed
                    ? Number(((totalRejected / totalProcessed) * 100).toFixed(2))
                    : 0
            });
        }

        return { success: true, trends };

    } catch (error) {
        return { success: false, message: error.message };
    }
};


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

        const top5 = results
            .map(company => ({
                ...company,
                total: Number(company.hiredCount) + Number(company.newCount),
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        return {
            success: true,
            data: top5
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};

// MONTHLY ATTRITION SERVICE (FINAL CLEAN VERSION)
export const monthlyAttritionRateService = async (companyId = "", year = "") => {
    try {
        const targetYear = year ? Number(year) : new Date().getFullYear();

        const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59);

        // JOB FILTER
        const jobWhere = companyId ? { companyId } : {};

        // FETCH HISTORY 
        const histories = await ApplicantStatusHistory.findAll({
            where: {
                applicantStatus: {
                    [Op.in]: ["Hired", "Rejected"],
                },
                createdAt: {
                    [Op.lte]: yearEnd,
                },
            },
            include: [
                {
                    model: Applicants,
                    required: true,
                    include: [
                        {
                            model: Jobs,
                            as: "job",
                            required: true,
                            where: Object.keys(jobWhere).length
                                ? jobWhere
                                : undefined,
                        },
                    ],
                },
            ],
            order: [["createdAt", "ASC"]],
            raw: true,
        });

        // BUILD EMPLOYEE TIMELINE MAP       
        const map = {};

        for (const h of histories) {
            const id = h.applicantId;
            const date = new Date(h.createdAt);

            if (!map[id]) {
                map[id] = {
                    hiredAt: null,
                    rejectedAt: null,
                };
            }

            if (h.applicantStatus === "Hired" && !map[id].hiredAt) {
                map[id].hiredAt = date;
            }

            // IMPORTANT:
            // treat "Rejected after hire" as exit event in YOUR system
            if (h.applicantStatus === "Rejected") {
                map[id].rejectedAt = date;
            }
        }

        // MONTH TEMPLATE
        const months = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(targetYear, i).toLocaleString("default", {
                month: "long",
            }),
            startHeadCount: 0,
            joined: 0,
            leavers: 0,
            endHeadCount: 0,
            attritionRate: 0,
        }));

        // MAIN CALCULATION  
        for (let m = 0; m < 12; m++) {
            const start = new Date(targetYear, m, 1);
            const end = new Date(targetYear, m + 1, 0, 23, 59, 59);

            let startHeadCount = 0;
            let endHeadCount = 0;
            let joined = 0;
            let leavers = 0;

            for (const a of Object.values(map)) {
                const hiredAt = a.hiredAt;
                const rejectedAt = a.rejectedAt;

                if (!hiredAt) continue;

                // JOINED
                if (hiredAt >= start && hiredAt <= end) {
                    joined++;
                }

                // LEAVERS (FIXED MEANING)           
                const isLeaver =
                    rejectedAt &&
                    hiredAt &&
                    rejectedAt > hiredAt &&
                    rejectedAt >= start &&
                    rejectedAt <= end;

                if (isLeaver) {
                    leavers++;
                }

                // ACTIVE CHECK      
                const isActiveAt = (date) =>
                    hiredAt <= date && (!rejectedAt || rejectedAt > date);

                // START HEADCOUNT         
                if (isActiveAt(start)) {
                    startHeadCount++;
                }

                // END HEADCOUNT         
                if (isActiveAt(end)) {
                    endHeadCount++;
                }
            }

            // ATTRITION RATE        
            const avgHeadCount =
                (startHeadCount + endHeadCount) / 2;

            const attritionRate =
                avgHeadCount > 0
                    ? (leavers / avgHeadCount) * 100
                    : 0;

            months[m] = {
                month: months[m].month,
                startHeadCount,
                joined,
                leavers,
                endHeadCount,
                attritionRate: Number(attritionRate.toFixed(2)),
            };
        }

        let companyName = "ALL COMPANIES";

        if (companyId) {
            const company = await Companies.findByPk(companyId, {
                attributes: ["companyName"], // adjust field name if different
                raw: true,
            });

            companyName = company?.companyName || "Unknown Company";
        }

        return {
            success: true,
            year: targetYear,
            companyName,
            data: months,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};