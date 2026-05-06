import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH REJECTED TOTALS
export const fetchResignedTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/resigned/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch resigned totals'
        };
    }
};

// FETCH ALL RESIGNED
export const fetchAllResigned = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/resigned/fetchAll`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all resigned applicant'
        };
    }
};