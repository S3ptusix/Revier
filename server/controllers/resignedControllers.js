import { fetchAllResignedService, fetchResignedTotalService } from "../services/resignedService.js";

// FETCH ALL RESIGNED
export const fetchAllResignedController = async (req, res) => {
    try {
        const {
            search,
            companyId,
            page

        } = req.query;
        const result = await fetchAllResignedService(
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

// FETCH RESIGNED TOTALS
export const fetchResignedTotalController = async (req, res) => {
    try {
        const result = await fetchResignedTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}