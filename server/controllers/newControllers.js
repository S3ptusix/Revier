import { fetchAllNewService, forInterviewService, rejectService } from "../services/newServices.js";

// REJECTION
export const rejectController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { rejectedReason } = req.body;
        const result = await rejectService(applicantId, rejectedReason);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL NEW
export const fetchAllNewController = async (req, res) => {
    try {
        const {
            search,
            companyId,
            page
        } = req.query;
        const result = await fetchAllNewService(
            search,
            companyId,
            page
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

// PASSED INTERVIEW
export const forInterviewController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const {
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
            scheduleSummary
        } = req.body;
        const result = await forInterviewService(
            applicantId,
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes, 
            scheduleSummary
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
