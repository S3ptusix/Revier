import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH APPLICANTS PIPELINE
export const fetchApplicantsPipeline = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/applicants/pipeline`, { params: formData, withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch applicants pipeline'
        };
    }
};

// FETCH APPLICANT STATUS HISTORY
export const applicantStatusHistory = async (applicantId) => {
    try {
        const response = await axios.get(`${API_URL}/api/applicants/statusHistory/${applicantId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch applicant status history'
        };
    }
};

// FETCH APPLICANT TOTALS
export const fetchApplicantTotals = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/applicants/totals`, { params: formData, withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch applicants totals'
        };
    }
};

// APPLICANT DETAILS
export const applicantDetails = async (applicantId) => {
    try {
        const response = await axios.get(`${API_URL}/api/applicants/applicantDetails/${applicantId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch applicant details'
        };
    }
};