import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH ALL REJECTED AND BLACKLISTED
export const fetchAllRejected = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/rejected/fetchAll`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all rejected and blacklisted applicant'
        };
    }
};