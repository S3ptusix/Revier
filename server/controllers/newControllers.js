import { fetchAllNewService, forInterviewService, rejectService } from "../services/newServices.js";

// REJECTION
export const rejectController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { rejectedReason, rejectedReasonNote } = req.body;
        const result = await rejectService(applicantId, rejectedReason, rejectedReasonNote);

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
        const { role, id } = req.admin;
        const {
            search,
            companyId,
            page
        } = req.query;
        const result = await fetchAllNewService(
            search,
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
