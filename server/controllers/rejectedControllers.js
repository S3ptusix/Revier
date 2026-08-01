import { fetchAllRejectedAndBlacklistedService, fetchRejectedTotalService } from "../services/rejectedServices.js";

// FETCH ALL REJECTED AND BLACKLISTED
export const fetchAllRejectedAndBlacklistedController = async (req, res) => {
    try {
        const {
            search,
            companyId,
            page

        } = req.query;
        const result = await fetchAllRejectedAndBlacklistedService(
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

// FETCH REJECTED TOTALS
export const fetchRejectedTotalController = async (req, res) => {
    try {
        const result = await fetchRejectedTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}