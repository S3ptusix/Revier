import { Applicants, ApplicantStatusHistory, Companies, Jobs, Users } from "../models/index.js";
import { Op } from "sequelize";

// FETCH ALL HIRED
export const fetchAllHiredService = async (search = "") => {
    try {
        const applicantWhere = {
            applicantStatus: "Hired",
            isRejected: "No",
        };

        // Only search within relevant fields if search term exists
        if (search) {
            applicantWhere[Op.or] = [
                { fullname: { [Op.like]: `%${search}%` } },
                { "$User.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job.company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        const applicants = await Applicants.findAll({
            attributes: ["id", "fullname", "phone", "blacklistedReason"],
            where: applicantWhere,
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    required: true,
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
                    attributes: ["jobTitle"],
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
                {
                    model: ApplicantStatusHistory,
                    attributes: ["applicantStatus", "createdAt"], // Include status and date
                    required: true,
                    where: {
                        applicantStatus: { [Op.in]: ["Hired", "New"] }, // Include both Hired and New
                    },
                },
            ],
            order: [["fullname", "ASC"]],
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