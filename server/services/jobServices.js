import { Applicants, Companies, Jobs } from '../models/index.js';
import { employmentTypes } from '../utils/data.js';
import { normalizeArray, removeUnnecessarySpaces } from '../utils/format.js';
import Admins from '../models/Admin.js';
import { Sequelize, Op } from "sequelize";
import { getDistanceKm } from '../utils/tools.js';
import { validateSalary } from '../utils/inputValidators.js';

// CREATE JOB
export const createJobService = async (
    jobTitle,
    companyId,
    slot,
    employmentType,
    education,
    experience,
    description,
    payType,
    payMin,
    payMax,
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

        const salaryError = validateSalary(payType, payMin, payMax);

        if (salaryError) {
            return {
                success: false,
                message: salaryError
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
            payType: payType === '' ? null : payType,
            payMin: payType === '' ? null : payMin,
            payMax: payType === '' ? null : payMax,
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
    toSearch = "",
    toLocation = "",
    type = "",
    page = 1,
    userLat = null,
    userLng = null,
    radius = 10
) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            status: "open",
        };

        // SEARCH
        if (toSearch.trim()) {
            whereClause.jobTitle = {
                [Op.like]: `%${removeUnnecessarySpaces(toSearch)}%`,
            };
        }

        // TYPE
        if (type.trim()) {
            whereClause.type = type;
        }

        const companyWhere = {};

        // LOCATION FILTER
        if (toLocation.trim()) {
            companyWhere.location = {
                [Op.like]: `%${removeUnnecessarySpaces(toLocation)}%`,
            };
        }

        // =========================
        // FETCH JOBS
        // =========================
        const jobs = await Jobs.findAll({
            where: whereClause,
            include: [
                {
                    model: Companies,
                    as: "company",
                    attributes: [
                        "companyName",
                        "location",
                        "industry",
                        "latitude",
                        "longitude",
                    ],
                    required: true,
                    where: Object.keys(companyWhere).length
                        ? companyWhere
                        : undefined,
                },
            ],
        });

        // =========================
        // IF NO LOCATION → RETURN ALL JOBS (NO FILTER)
        // =========================
        if (userLat == null || userLng == null) {
            const paginated = jobs.slice(offset, offset + limit);

            return {
                success: true,
                jobs: paginated.map(j => j.toJSON()),
                pagination: {
                    total: jobs.length,
                    page,
                    limit,
                    totalPages: Math.ceil(jobs.length / limit),
                },
            };
        }

        // =========================
        // WITH LOCATION → APPLY NEARBY FILTER
        // =========================
        let finalJobs = jobs
            .map(job => {
                const company = job.company;

                if (!company?.latitude || !company?.longitude) {
                    return null;
                }

                const distance = getDistanceKm(
                    Number(userLat),
                    Number(userLng),
                    Number(company.latitude),
                    Number(company.longitude)
                );

                return {
                    ...job.toJSON(),
                    distance,
                };
            })
            .filter(job => job !== null)
            .filter(job => job.distance <= Number(radius))
            .sort((a, b) => a.distance - b.distance);

        const paginatedJobs = finalJobs.slice(offset, offset + limit);
        return {
            success: true,
            jobs: paginatedJobs,
            pagination: {
                total: finalJobs.length,
                page,
                limit,
                totalPages: Math.ceil(finalJobs.length / limit),
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
                'payType',
                'payMin',
                'payMax',
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
export const readAllJobService = async (
    search = "",
    status = "",
    type = "",
    companyId = "",
    page = 1
) => {
    try {

        page = parseInt(page) || 1;
        const limit = 10;

        const offset = (page - 1) * limit;

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

        if (companyId) {
            jobWhere.companyId = companyId;
        }

        const total = await Jobs.count({
            where: jobWhere,
            include: [
                {
                    model: Companies,
                    as: "company",
                    required: true
                }
            ],
            distinct: true,
            col: "id"
        });

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
            limit,
            offset,
            subQuery: false
        });

        return {
            success: true,
            jobs,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit)
            }
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
    payType,
    payMin,
    payMax,
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

        const salaryError = validateSalary(payType, payMin, payMax);

        if (salaryError) {
            return {
                success: false,
                message: salaryError
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
            payType: payType === '' ? null : payType,
            payMin: payType === '' ? null : payMin,
            payMax: payType === '' ? null : payMax,
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