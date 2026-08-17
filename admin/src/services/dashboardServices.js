import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getDashboardData = async () => {
    try {
        const [
            summaryRes,
            pipelineRes,
            interviewsRes,
            orientationsRes
        ] = await Promise.all([
            axios.get(`${API_URL}/api/dashboard/summary`, { withCredentials: true }),
            axios.get(`${API_URL}/api/dashboard/pipeline`, { withCredentials: true }),
            axios.get(`${API_URL}/api/dashboard/interviews-today`, { withCredentials: true }),
            axios.get(`${API_URL}/api/dashboard/upcoming-orientations`, { withCredentials: true })
        ]);

        return {
            summary: summaryRes.data.summary,
            pipeline: pipelineRes.data.pipeline,
            schedules: {
                interviewsToday: interviewsRes.data.interviewsToday,
                upcomingOrientations: orientationsRes.data.upcomingOrientations
            }
        };

    } catch (error) {
        console.error("Dashboard API Error:", error);
        throw error;
    }
};