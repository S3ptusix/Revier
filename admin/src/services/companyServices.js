import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE COMPANY
export const createCompany = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/company/create`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create company'
        };
    }
};

// FETCH ADD COMPANY
export const fetchAllCompany = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/company/fetchAll`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all company'
        };
    }
};