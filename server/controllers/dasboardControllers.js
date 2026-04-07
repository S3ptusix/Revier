import { fetchDashboardTotalService } from "../services/dashboardServices.js";

// FETCH DASHBOARD TOTALS
export const fetchDashboardTotalController = async (req, res) => {
    try {

        const result = await fetchDashboardTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

