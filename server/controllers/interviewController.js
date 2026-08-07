import {
    failedInterviewService,
    fetchAllInterviewsService,
    fetchOneInterviewsService,
    forOrientationService,
    rescheduleInterviewService
} from "../services/interviewServices.js";

// FETCH ALL INTERVIEWS
export const fetchAllInterviewsController = async (req, res) => {
    try {
        const {
            search,
            companyId,
            page
        } = req.query;

        const result = await fetchAllInterviewsService(
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

// FETCH ONE INTERVIEW
export const fetchOneInterviewsController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const result = await fetchOneInterviewsService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FAILED INTERVIEW
export const failedInterviewController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { rejectedReason, rejectedReasonNote } = req.body;

        const result = await failedInterviewService(applicantId, rejectedReason, rejectedReasonNote);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// RESCHEDULE INTERVIEW
export const rescheduleInterviewController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const {
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
            scheduleSummary
        } = req.body;
        const result = await rescheduleInterviewService(
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

// FOR ORIENTATION
export const forOrientationController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { orientationId } = req.body;

        const result = await forOrientationService(applicantId, orientationId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}