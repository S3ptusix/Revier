import { fetchApplicantPipelineService, fetchApplicantStatusHistoryService, moveApplicantService } from "../services/applicantsServices.js";

// FETCH APPLICANTS PIPELINE
export const fetchApplicantPipelineControllter = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await fetchApplicantPipelineService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// MOVE APPLICANT
export const moveApplicantController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { applicantStatus } = req.body;
        const result = await moveApplicantService(applicantId, applicantStatus);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH APPLICANT STATUS HISTORY
export const fetchApplicantStatusHistoryController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const result = await fetchApplicantStatusHistoryService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}