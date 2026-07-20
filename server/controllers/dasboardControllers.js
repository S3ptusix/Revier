import { fetchDashboardDataService } from "../services/dashboardServices.js";

export const getDashboardData = async (req, res) => {
    try {
        const data = await fetchDashboardDataService();

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
};