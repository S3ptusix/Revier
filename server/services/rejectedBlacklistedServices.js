import { Op } from "sequelize";
import { Applicants, Companies, Jobs, Users } from "../models/index.js";

// FETCH ALL REJECTED 
export const fetchAllRejectedAndBlacklistedService = async (search) => {
    try {

        const whereClause = { isRejected: 'Yes' };

        if (search) {
            whereClause[Op.or] = [
                { fullname: { [Op.like]: `%${search}%` } },
                { "$User.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job.company.companyName$": { [Op.like]: `%${search}%` } }
            ];
        }

        const applicants = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone',
                'isRejected',
                'blacklistedReason'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    include: [
                        {
                            model: Applicants,
                            attributes: ['blacklistedReason'],
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
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: whereClause
        });

        return {
            success: true,
            applicants,
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
    applicantId,
    blacklistedReason
) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            blacklistedReason: !blacklistedReason?.trim() ? null : blacklistedReason
        }, {
            where: { id: applicantId }
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

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
            where: { isRejected: 'Yes' }
        });

        // users who are blacklisted from ANY application
        totals.blacklisted = await Applicants.count({
            distinct: true,
            col: 'userId',
            where: {
                blacklistedReason: {
                    [Op.ne]: null
                }
            }
        });

        // rejected this month
        totals.thisMonth = await Applicants.count({
            where: {
                isRejected: 'Yes',
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