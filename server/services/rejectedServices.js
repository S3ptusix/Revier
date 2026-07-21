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
                { "$user.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job.company.companyName$": { [Op.like]: `%${search}%` } },
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

// FETCH BLACKLIST REASON
export const fetchBlacklistReasonService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }
        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['blacklistedReason']
        })

        return {
            success: true,
            blacklistedReason: applicant.blacklistedReason
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// BLACKLIST
export const blacklistService = async (
    admin,
    applicantId,
    blacklistedReason
) => {
    try {

        if (!applicantId || isNaN(applicantId)) {
            return {
                success: false,
                message: "Invalid applicant ID."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['id', 'userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [{
                        model: Companies,
                        as: 'company',
                        attributes: ['companyName']
                    }]
                }
            ]
        });

        if (!applicant) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        if (!blacklistedReason || !blacklistedReason.trim()) {
            await applicant.update({
                blacklistedReason: null
            });

            return {
                success: true,
                message: "Blacklist removed."
            };
        }

        await applicant.update({
            blacklistedBy: admin.id,
            blacklistedReason: blacklistedReason.trim(),
            isRejected: true,
            rejectedAt: new Date(),
        });

        const notification = await Notification.create({
            userId: applicant.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: "We regret to inform you that your application has been rejected due to policy reasons. You may contact support for clarification.",
            type: "error"
        });

        io.to("admins").emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return {
            success: true,
            message: "Applicant has been blacklisted."
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};