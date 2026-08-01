import { col, fn, Op, where } from "sequelize";
import { Applicants, Companies, Jobs, Notification, Users } from "../models/index.js";
import { io } from "../server.js";

// FETCH REJECTED TOTALS
export const fetchRejectedTotalService = async () => {
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
                isRejected: true,
                applicantStatus: { [Op.ne]: 'Hired' }
            }
        });

        // rejected this month
        totals.thisMonth = await Applicants.count({
            where: {
                isRejected: true,
                applicantStatus: { [Op.ne]: 'Hired' },
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

// FETCH ALL REJECTED 
export const fetchAllRejectedAndBlacklistedService = async (
    search = "",
    companyId,
    page = 1
) => {
    try {

        search = search.trim();

        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            isRejected: true,
            applicantStatus: { [Op.ne]: 'Hired' }
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

        const total = await Applicants.count({
            where: whereClause,
            include: [
                {
                    model: Users,
                    as: "user",
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
                "rejectedAt"
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