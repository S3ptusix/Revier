import {
    applicantDetailsService,
    applicantTotalsService,
    fetchApplicantStatusHistoryService,
} from "../services/applicantServices.js";

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
        const { role, id } = req.admin;
        const { search, companyId } = req.query;
        const result = await applicantTotalsService(
            search,
            companyId,
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
