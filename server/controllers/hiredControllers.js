import { fetchAllHiredService, fetchHiredTotalService } from "../services/HiredServices.js";

// FETCH ALL HIRED
export const fetchAllHiredController = async (req, res) => {
    try {
        const { search } = req.query;
        const result = await fetchAllHiredService(search);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH HIRED TOTALS
export const fetchHiredTotalController = async (req, res) => {
    try {
        const result = await fetchHiredTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}