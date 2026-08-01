import {
    applicantDetailsService,
    applicantTotalsService,
    fetchAllInterviewsService,
    fetchApplicantPipelineService,
    fetchApplicantStatusHistoryService,
    fetchApplicantTotalService,
    fetchInterviewTotalService,
    fetchOneInterviewsService,
} from "../services/applicantServices.js";

// FETCH APPLICANTS PIPELINE
export const fetchApplicantPipelineController = async (req, res) => {
    try {
        const { search, companyId } = req.query;
        const result = await fetchApplicantPipelineService(search, companyId);

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

// FETCH APPLICANT TOTALS
export const fetchApplicantTotalController = async (req, res) => {
    try {

        const admin = req.admin;
        const result = await fetchApplicantTotalService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH INTERVIEW TOTALS
export const fetchInterviewTotalController = async (req, res) => {
    try {

        const admin = req.admin;
        const result = await fetchInterviewTotalService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// APPLICANT DETAILS
export const applicantDetailsController = async (req, res) => {
    try {

        const { applicantId } = req.params;
        const result = await applicantDetailsService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// APPLICANT TOTALS
export const applicantTotalsController = async (req, res) => {
    try {

        const { search, companyId } = req.query;
        const result = await applicantTotalsService(search, companyId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
