import { Applicants, Companies, Jobs, Users } from "../models/index.js";
import { col, fn, Op, where } from "sequelize";
import { getCompanyScope } from "../utils/getCompanyScope.js";

// FETCH ALL HIRED
export const fetchAllHiredService = async (
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
            applicantStatus: "Hired",
            isRejected: "No",
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
                pagination: { total: 0, page, totalPages: 0 }
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
                            required: true,
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
                "blacklistedReason",
                "createdAt",
                "hiredAt"
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
                            required: true,
                            where: scope.companyWhere,
                        },
                    ],
                },
            ],
            order: [["hiredAt", "DESC"]],
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