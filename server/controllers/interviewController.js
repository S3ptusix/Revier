import {
    bulkFailedInterviewService,
    bulkForOrientationService,
    failedInterviewService,
    fetchAllInterviewsService,
    fetchOneInterviewsService,
    forOrientationService,
    rescheduleInterviewService
} from "../services/interviewServices.js";

// FETCH ALL INTERVIEWS
export const fetchAllInterviewsController = async (req, res) => {
    try {
        const { role, id } = req.admin;
        const {
            search,
            companyId,
            page
        } = req.query;

        const result = await fetchAllInterviewsService(
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
        const admin = req.admin;
        const { applicantId } = req.params;
        const { rejectedReason, rejectedReasonNote } = req.body;

        const result = await failedInterviewService(
            applicantId,
            rejectedReason,
            rejectedReasonNote,
            admin
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

// RESCHEDULE INTERVIEW
export const rescheduleInterviewController = async (req, res) => {
    try {
        const admin = req.admin;
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
            scheduleSummary,
            admin
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

// BULK FOR ORIENTATION
export const bulkForOrientationController = async (req, res) => {
    try {
        const admin = req.admin;
        const { orientationId } = req.params;
        const { applicantIds } = req.body;

        const result = await bulkForOrientationService(
            applicantIds,
            orientationId,
            admin
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
        const admin = req.admin;
        const { applicantId } = req.params;
        const { orientationId } = req.body;

        const result = await forOrientationService(
            applicantId,
            orientationId,
            admin
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

// BULK FAILED INTERVIEW
export const bulkFailedInterviewController = async (req, res) => {
    try {

        const admin = req.admin;
        const {
            applicantIds,
            rejectedReason,
            rejectedReasonNote

        } = req.body;

        const result = await bulkFailedInterviewService(
            applicantIds,
            rejectedReason,
            rejectedReasonNote,
            admin
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