import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getDashboardData = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/`);
        return response.data.data;
    } catch (error) {
        console.error("Dashboard API Error:", error);
        throw error;
    }
};