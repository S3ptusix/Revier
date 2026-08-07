import { blacklistService, fetchBlacklistReasonService } from "../services/blacklistServices.js";

// BLACKLIST
export const blacklistController = async (req, res) => {
    try {
        const admin = req.admin;
        const { applicantId } = req.params;
        const { blacklistedReason, blacklistedReasonNote } = req.body;

        const result = await blacklistService(admin, applicantId, blacklistedReason, blacklistedReasonNote);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH BLACKLIST REASON
export const fetchBlacklistReasonController = async (req, res) => {
    try {
        const { applicantId } = req.params;

        const result = await fetchBlacklistReasonService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}