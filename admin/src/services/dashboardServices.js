import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH DASHBOARD TOTALS
export const fetchDashboardTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dashboard totals'
        };
    }
};