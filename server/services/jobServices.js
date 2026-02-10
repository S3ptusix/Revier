import { Op } from 'sequelize';
import { Companies, Jobs } from '../models/index.js';
import { employmentTypes } from '../utils/data.js';
import { normalizeArray, removeUnnecessarySpaces } from '../utils/format.js';

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
            postedAt: {
                [Op.ne]: null,
            },
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

// READ ONE JOB
export const readOneJobService = async (jobId) => {
    try {
        if (!jobId || isNaN(jobId)) {
            return {
                success: false,
                message: "Invalid job ID."
            };
        }

        const job = await Jobs.findByPk(jobId, {
            attributes: ['id', 'jobTitle', 'type', 'education', 'experience', 'description', 'responsibilities', 'requirements', 'benefitsAndPerks', 'postedAt'],
            include: [
                {
                    model: Companies,
                    as: 'company',
                    attributes: ['companyName', 'location', 'industry'],
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

