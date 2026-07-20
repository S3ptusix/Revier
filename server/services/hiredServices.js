import { Applicants, Companies, Jobs, Users } from "../models/index.js";
import { col, fn, Op, where } from "sequelize";

// FETCH ALL HIRED WITH PAGINATION
export const fetchAllHiredService = async (
    search = "",
    companyId,
    page = 1
) => {
    try {
        search = search.trim();
        
        const limit = 10;
        const offset = (page - 1) * limit;

        const applicantWhere = {
            applicantStatus: "Hired",
            isRejected: "No",
        };

        const jobWhere = {};
        if (companyId) {
            jobWhere.companyId = companyId;
        }

        // SEARCH
        if (search) {
            applicantWhere[Op.or] = [
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
            where: applicantWhere,
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
                            required: true,
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
                "blacklistedReason",
                "createdAt",
                "hiredAt"
            ],
            where: applicantWhere,
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
                            required: true,
                        },
                    ],
                },
            ],
            order: [["createdAt", "ASC"]],
            limit,
            offset,
            subQuery: false,
        });

        return {
            success: true,
            applicants,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
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

// FETCH HIRED TOTALS
export const fetchHiredTotalService = async () => {
    try {

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        let totals = {
            totalHired: 0,
            thisMonth: 0,
            companies: 0,
            position: 0,
        };

        // total hired
        totals.totalHired = await Applicants.count({
            where: { applicantStatus: 'Hired' }
        });

        // hired this month
        totals.thisMonth = await Applicants.count({
            where: {
                applicantStatus: 'Hired',
                createdAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        // companies hired from
        totals.companies = await Applicants.count({
            distinct: true,
            col: 'jobId',
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
            where: { applicantStatus: 'Hired' }
        });

        // positions hired
        totals.position = await Applicants.count({
            distinct: true,
            col: 'jobId',
            where: { applicantStatus: 'Hired' }
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