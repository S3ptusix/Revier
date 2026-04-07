import { Applicants, Companies, Jobs } from '../models/index.js';
import { employmentTypes } from '../utils/data.js';
import { normalizeArray, removeUnnecessarySpaces } from '../utils/format.js';
import Admins from '../models/Admin.js';
import { Sequelize, Op } from "sequelize";

// CREATE JOB
export const createJobService = async (
    jobTitle,
    companyId,
    slot,
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
            !slot ||
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
            slot,
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
    toSearch,
    toLocation,
    type,
) => {
    try {
        const whereClause = {
            status: 'open',
        };

        if (toSearch.trim()) {
            whereClause.jobTitle = {
                [Op.like]: `%${removeUnnecessarySpaces(toSearch)}%`,
            };
        }

        if (type.trim()) {
            whereClause.type = type;
        }

        const companyWhere = {};

        if (toLocation.trim()) {
            companyWhere.location = {
                [Op.like]: `%${removeUnnecessarySpaces(toLocation)}%`,
            };
        }

        const jobs = await Jobs.findAll({
            where: whereClause,
            attributes: [
                'id',
                'jobTitle',
                'slot',
                'type',
                'postedAt'

            ],
            include: [
                {
                    model: Companies,
                    as: 'company',
                    attributes: ['companyName', 'location', 'industry'],
                    required: true,
                    where: Object.keys(companyWhere).length
                        ? companyWhere
                        : undefined,
                },
            ],
            order: [['postedAt', 'DESC']],
        });

        return {
            success: true,
            jobs: jobs || []
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
                'jobTitle',
                'companyId',
                'slot',
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
export const readAllJobService = async (search = "", status = "", type = "") => {
    try {

        // Build job filters
        const jobWhere = {};

        if (search) {
            jobWhere.jobTitle = {
                [Op.like]: `%${search}%`
            };
        }

        if (status) {
            jobWhere.status = status;
        }

        if (type) {
            jobWhere.type = type;
        }

        const jobs = await Jobs.findAll({
            where: jobWhere,
            attributes: [
                "id",
                "jobTitle",
                "slot",
                "type",
                "status",
                "postedAt",
                [Sequelize.fn("COUNT", Sequelize.col("applicants.id")), "applicantCount"]
            ],
            include: [
                {
                    model: Companies,
                    as: "company",
                    attributes: ["companyName", "location"],
                    required: true
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

        return {
            success: true,
            jobs
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
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
    slot,
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
            !slot ||
            isNaN(slot) ||
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
            slot,
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

// FETCH JOB TOTALS
export const fetchJobTotalsService = async (adminId) => {
    try {
        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let totals = {
            totalJobs: 0,
            openPositions: 0,
            closed: 0,
            totalApplicants: 0
        }


        totals.totalJobs = await Jobs.count();
        totals.openPositions = await Jobs.count({ where: { status: 'open' } });
        totals.closed = await Jobs.count({ where: { status: 'closed' } });
        totals.totalApplicants = await Applicants.count();

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