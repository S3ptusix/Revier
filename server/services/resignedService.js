import { col, fn, Op, where } from "sequelize";
import { Applicants, ApplicantStatusHistory, Companies, Jobs, Users } from "../models/index.js";

// FETCH RESIGNED TOTALS
export const fetchResignedTotalService = async () => {
    try {

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        let totals = {
            totalRejected: 0,
            blacklisted: 0,
            thisMonth: 0
        };

        // total rejected
        totals.totalRejected = await Applicants.count({
            where: {
                isRejected: 'Yes',
                applicantStatus: 'Hired'
            }
        });

        // rejected this month
        totals.thisMonth = await Applicants.count({
            where: {
                isRejected: 'Yes',
                applicantStatus: 'Hired',
                createdAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

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

// FETCH ALL RESIGNED 
export const fetchAllResignedService = async (
    search = "",
    companyId,
    page = 1
) => {
    try {

        search = search.trim();

        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            isRejected: "Yes",
            applicantStatus: 'Hired'
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
                { "$User.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job.company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        const total = await Applicants.count({
            where: whereClause,
            include: [
                {
                    model: Users,
                    attributes: [],
                    required: true,
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: [],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: "company",
                            attributes: [],
                            required: false,
                        },
                    ],
                },
            ],
            distinct: true,
            col: "id",
        });

        const applicants = await Applicants.findAll({
            attributes: [
                "id",
                "firstName",
                "lastName",
                "phone",
                "isRejected",
                "blacklistedReason",
            ],
            where: whereClause,
            include: [
                {
                    model: Users,
                    attributes: ["email"],
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
                    model: ApplicantStatusHistory,
                    attributes: ["createdAt"],
                    required: true,
                    where: {
                        applicantStatus: "Rejected",
                    },
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
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
            subQuery: false,
            distinct: true,
        });

        return {
            success: true,
            applicants,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit)
            },
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};
