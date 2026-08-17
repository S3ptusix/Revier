import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH ALL HIRED
export const fetchAllHired = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/hired/fetchAll`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all hired applicant'
        };
    }
};