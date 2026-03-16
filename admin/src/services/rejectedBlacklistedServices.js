import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH ALL REJECTED AND BLACKLISTED
export const fetchAllRejectedBlacklisted = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/rejectedBlacklisted/fetchAll`, {
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

// FETCH BLACKLIST REASON
export const fetchBlacklistReason = async (applicantId) => {
    try {
        const response = await axios.get(`${API_URL}/api/rejectedBlacklisted/fetch/blacklist/${applicantId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch blacklist reason'
        };
    }
};

// BLACKLIST
export const blacklist = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/rejectedBlacklisted/blacklist/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add applicant to blacklist'
        };
    }
};

// FETCH REJECTED TOTALS
export const fetchHiredTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/rejectedBlacklisted/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch rejected totals'
        };
    }
};