import { Op } from 'sequelize';
import { Applicants, Companies, Jobs } from '../models/index.js';
import { employmentTypes } from '../utils/data.js';
import { normalizeArray, removeUnnecessarySpaces } from '../utils/format.js';
import Admins from '../models/Admin.js';
import { Sequelize } from "sequelize";

// CREATE JOB
export const createJobService = async (
    jobTitle,
    companyId,
    employmentType,
    education,
    experience,
    description,
    responsibilities,
    requirements,
    benefitsAndPerks
) => {
    try {
        if (
            !jobTitle?.trim() ||
            !companyId ||
            isNaN(companyId) ||
            !employmentType?.trim() ||
            !education?.trim() ||
            !experience?.trim() ||
            !description?.trim() ||
            !Array.isArray(responsibilities) ||
            !Array.isArray(requirements) ||
            !Array.isArray(benefitsAndPerks)
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const company = await Companies.findByPk(companyId);
        if (!company) {
            return { success: false, message: "Invalid company." };
        }

        if (!employmentTypes.includes(employmentType)) {
            return {
                success: false,
                message: "Invalid employment type."
            };
        }

        await Jobs.create({
            jobTitle: removeUnnecessarySpaces(jobTitle),
            companyId,
            type: employmentType,
            education: removeUnnecessarySpaces(education),
            experience: removeUnnecessarySpaces(experience),
            description: description.trim(),
            responsibilities: normalizeArray(responsibilities),
            requirements: normalizeArray(requirements),
            benefitsAndPerks: normalizeArray(benefitsAndPerks),
            postedAt: new Date(),
        });

        return {
            success: true,
            message: "Job created successfully",
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
};

// JOBPOSTING
export const jobPostingService = async (
    searchInput = '',
    location = '',
    industry = '',
    employmentType = '',
    page = 1,
    limit = 10
) => {
    try {
        const whereClause = {
            status: 'open',
        };

        if (searchInput.trim()) {
            whereClause.jobTitle = {
                [Op.like]: `%${removeUnnecessarySpaces(searchInput)}%`,
            };
        }

        if (employmentType.trim()) {
            whereClause.type = employmentType;
        }

        const companyWhere = {};

        if (location.trim()) {
            companyWhere.location = {
                [Op.like]: `%${removeUnnecessarySpaces(location)}%`,
            };
        }

        if (industry.trim()) {
            companyWhere.industry = industry;
        }

        const offset = (page - 1) * limit;

        const { rows: jobs, count: totalItems } = await Jobs.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: ['id', 'jobTitle', 'type', 'postedAt'],
            include: [
                {
                    model: Companies,
                    as: 'company',
                    attributes: ['companyName', 'location', 'industry'],
                    where: Object.keys(companyWhere).length
                        ? companyWhere
                        : undefined,
                },
            ],
            order: [['postedAt', 'DESC']],
        });

        return {
            success: true,
            jobs: jobs || [],
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
};

// FETCH ONE JOB
export const readOneJobService = async (jobId) => {
    try {
        if (!jobId || isNaN(jobId)) {
            return {
                success: false,
                message: "Invalid job ID."
            };
        }

        const job = await Jobs.findByPk(jobId, {
            attributes: [
                'id',
                'companyId',
                'jobTitle',
                'type',
                'education',
                'experience',
                'description',
                'responsibilities',
                'requirements',
                'benefitsAndPerks',
                'postedAt'
            ],
            include: [
                {
                    model: Companies,
                    as: 'company',
                    attributes: [
                        'companyName',
                        'location',
                        'industry'
                    ],
                },
            ],
        });

        if (!job) {
            return {
                success: false,
                message: "Job not found."
            };
        }

        return {
            success: true,
            job
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
};

// FETCH ALL JOB
export const readAllJobService = async (adminId) => {
    try {
        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let jobs;

        if (admin.role === "HR Manager") {
            jobs = await Jobs.findAll({
                attributes: [
                    "id",
                    "jobTitle",
                    "type",
                    "status",
                    "postedAt",
                    [Sequelize.fn("COUNT", Sequelize.col("applicants.id")), "applicantCount"]
                ],
                include: [
                    {
                        model: Companies,
                        as: "company",
                        attributes: ["companyName", "location"]

                    },
                    {
                        model: Applicants,
                        as: "applicants",
                        attributes: []
                    }
                ],
                group: ["job.id", "company.id"],
                order: [["jobTitle", "ASC"]],
            });
        } else {
            jobs = await Jobs.findAll({
                where: {
                    companyId: admin.assignedCompanies,
                },
                attributes: [
                    "id",
                    "jobTitle",
                    "type",
                    "status",
                    "postedAt",
                    [Sequelize.fn("COUNT", Sequelize.col("applicants.id")), "applicantCount"]
                ],
                include: [
                    {
                        model: Companies,
                        as: "company",
                        attributes: ["companyName", "location"]
                    },
                    {
                        model: Applicants,
                        as: "applicants",
                        attributes: []
                    }
                ],
                group: ["job.id", "company.id"],
                order: [["jobTitle", "ASC"]],
            });
        }

        return {
            success: true,
            jobs,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// DELETE JOB 
export const deleteJobService = async (jobId) => {
    try {
        const affectedRows = await Jobs.destroy({
            where: { id: jobId }
        });
        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Job not found'
            };
        }

        return {
            success: true,
            message: 'Job deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// EDIT JOB
export const editJobService = async (
    jobId,
    jobTitle,
    companyId,
    employmentType,
    education,
    experience,
    description,
    responsibilities,
    requirements,
    benefitsAndPerks
) => {
    try {

        if (
            isNaN(jobId) ||
            !jobTitle?.trim() ||
            !companyId ||
            isNaN(companyId) ||
            !employmentType?.trim() ||
            !education?.trim() ||
            !experience?.trim() ||
            !description?.trim() ||
            !Array.isArray(responsibilities) ||
            !Array.isArray(requirements) ||
            !Array.isArray(benefitsAndPerks)
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Jobs.update({
            jobTitle,
            companyId,
            type: employmentType,
            education,
            experience,
            description,
            responsibilities,
            requirements,
            benefitsAndPerks
        }, {
            where: { id: jobId }
        });

        return {
            success: true,
            message: "Job updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// EDIT JOB STATUS
export const editJobStatusService = async (
    jobId,
    status
) => {
    try {

        if (
            isNaN(jobId) ||
            !status?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        status = status === 'open' ? 'closed' : 'open';

        await Jobs.update({
            status
        }, {
            where: { id: jobId }
        });

        return {
            success: true,
            message: "Job status updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}