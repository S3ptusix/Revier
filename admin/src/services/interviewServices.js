import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FAILED INTERVIEW 
export const failedInterview = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/interview/failed/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to reject applicant'
        };
    }
};

// RESCHEDULE INTERVIEW
export const rescheduleInterview = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/interview/reschedule/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to reschedule interview'
        };
    }
};

// FOR ORIENTATION
export const forOrientation = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/interview/forOrientation/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add applicant to event'
        };
    }
};
