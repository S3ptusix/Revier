import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// BLACKLIST
export const blacklist = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/blacklist/blacklist/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add applicant to blacklist'
        };
    }
};

// FETCH BLACKLIST REASON
export const fetchBlacklistReason = async (applicantId) => {
    try {
        const response = await axios.get(`${API_URL}/api/blacklist/fetchBlacklistReason/${applicantId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch blacklist reason'
        };
    }
};