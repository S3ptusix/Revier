import { createJobService, deleteJobService, editJobService, editJobStatusService, fetchJobTotalsService, jobPostingService, readAllJobArchiveService, readAllJobService, readOneJobService, restoreJobService } from "../services/jobServices.js";

// CREATE JOB
export const createJobController = async (req, res) => {
    try {
        const {
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
        } = req.body;

        const result = await createJobService(
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
        );

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
        const {
            toSearch,
            toLocation,
            type,
            page,
            userLat,
            userLng,
            radius
        } = req.query;
        const result = await jobPostingService(
            toSearch,
            toLocation,
            type,
            page,
            userLat,
            userLng,
            radius
        );

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

        const { role, id } = req.admin;

        const {
            search,
            status,
            type,
            companyId,
            page
        } = req.query;
        const result = await readAllJobService(
            search,
            status,
            type,
            companyId,
            page,
            role,
            id

        );

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
        const result = await deleteJobService(jobId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// EDIT JOB
export const editJobController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
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
        } = req.body;
        const result = await editJobService(
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
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// EDIT JOB STATUS
export const editJobStatusController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status } = req.body;
        const result = await editJobStatusService(jobId, status);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH JOB TOTALS
export const fetchJobTotalController = async (req, res) => {
    try {

        const { role, id } = req.admin;
        const result = await fetchJobTotalsService(role, id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL JOB ARCHIVE
export const readAllJobArchiveController = async (req, res) => {
    try {
        const { role, id } = req.admin;

        const {
            search,
            type,
            companyId,
            page
        } = req.query;
        const result = await readAllJobArchiveService(
            search,
            type,
            companyId,
            page,
            role,
            id

        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// RESTORE JOB
export const restoreJobController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const result = await restoreJobService(jobId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}