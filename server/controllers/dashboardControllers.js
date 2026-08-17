import {
    fetchPipelineCountsService,
    fetchDashboardSummaryService,
    fetchInterviewsTodayService,
    fetchUpcomingOrientationsService
} from "../services/dashboardServices.js";

export const getPipelineCounts = async (req, res) => {
    try {
        const { role, id: adminId } = req.admin; // adjust to match your auth middleware's shape

        const { success, message, pipeline } = await fetchPipelineCountsService(role, adminId);

        if (!success) {
            return res.status(400).json({ success: false, message });
        }

        res.status(200).json({ success: true, pipeline });
    } catch (error) {
        console.error("Pipeline Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch pipeline counts" });
    }
};

export const getDashboardSummary = async (req, res) => {
    try {
        const { role, id: adminId } = req.admin;

        const { success, message, summary } = await fetchDashboardSummaryService(role, adminId);

        if (!success) {
            return res.status(400).json({ success: false, message });
        }

        res.status(200).json({ success: true, summary });
    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard summary" });
    }
};

export const getInterviewsToday = async (req, res) => {
    try {
        const { role, id: adminId } = req.admin;

        const { success, message, interviewsToday } = await fetchInterviewsTodayService(role, adminId);

        if (!success) {
            return res.status(400).json({ success: false, message });
        }

        res.status(200).json({ success: true, interviewsToday });
    } catch (error) {
        console.error("Interviews Today Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch today's interviews" });
    }
};

export const getUpcomingOrientations = async (req, res) => {
    try {
        const { role, id: adminId } = req.admin;

        const { success, message, upcomingOrientations } = await fetchUpcomingOrientationsService(role, adminId);

        if (!success) {
            return res.status(400).json({ success: false, message });
        }

        res.status(200).json({ success: true, upcomingOrientations });
    } catch (error) {
        console.error("Upcoming Orientations Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch upcoming orientations" });
    }
};