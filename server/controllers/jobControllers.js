import { createJobService, deletejobService, jobPostingService, readAllJobService, readOneJobService } from "../services/jobServices.js";

// CREATE JOB
export const createJobController = async (req, res) => {
    try {
        const { jobTitle, companyId, employmentType, education, experience, description, responsibilities, requirements, benefitsAndPerks } = req.body;
        const result = await createJobService(jobTitle, companyId, employmentType, education, experience, description, responsibilities, requirements, benefitsAndPerks);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// JOB POSTING
export const jobPostingController = async (req, res) => {
    try {
        const { searchInput, location, industry, employmentType, page } = req.query;
        const result = await jobPostingService(searchInput, location, industry, employmentType, page);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ONE JOB
export const readOneJobController = async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log(jobId);
        const result = await readOneJobService(jobId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL JOB
export const readAllJobController = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await readAllJobService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// DELETE JOB
export const deleteJobController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const result = await deletejobService(jobId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
