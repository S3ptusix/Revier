import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH ALL INTERVIEWS
export const fetchAllInterviews = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/interview/fetchAll`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all applicant to interview'
        };
    }
};

// FETCH ONE INTERVIEW
export const fetchOneInterview = async (applicantId) => {
    try {
        const response = await axios.get(`${API_URL}/api/interview/fetchOne/${applicantId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch one applicant to interview'
        };
    }
};

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

// BULK FOR ORIENTATION
export const bulkForOrientation = async (orientationId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/interview/bulkForOrientation/${orientationId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add selected applicant[s] to event'
        };
    }
};

// BULK FAILED INTERVIEW 
export const bulkFailedInterview = async (formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/interview/bulkFailedInterview`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to reject selected applicant[s]'
        };
    }
};