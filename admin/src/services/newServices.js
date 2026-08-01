import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// REJECT
export const reject = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/new/reject/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed update reject status'
        };
    }
};

// FETCH ALL NEW
export const fetchAllNew = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/new/fetchAll`, { params: formData, withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all new applicants'
        };
    }
};

// FOR INTERVIEW 
export const forInterview = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/new/forInterview/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update applicant'
        };
    }
};