import { col, fn, Op, where } from "sequelize";
import { Applicants, Companies, Jobs, Notification, Users } from "../models/index.js";
import { io } from "../server.js";
import { getCompanyScope } from '../utils/getCompanyScope.js';

// FETCH ALL REJECTED 
export const fetchAllRejectedService = async (
    search = "",
    companyId,
    page = 1,
    role,
    adminId
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

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) {
            return {
                success: true,
                applicants: [],
                pagination: { total: 0, totalPages: 0 }
            };
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
                            required: true, // 🔥 must be true for scope.companyWhere to actually filter
                            where: scope.companyWhere,
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
                "rejectedAt",
                "createdAt",
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
                            required: true, // 🔥 must be true for scope.companyWhere to actually filter
                            where: scope.companyWhere,
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