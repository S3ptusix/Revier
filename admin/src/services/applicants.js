import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH APPLICANTS PIPELINE
export const fetchApplicantsPipeline = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/applicants/pipeline`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch applicants pipeline'
        };
    }
};

// MOVE APPLICANT
export const moveApplicant = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/applicants/move/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to move applicant'
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

// FETCH ALL INTERVIEWS
export const fetchAllInterviews = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/applicants/fetchAll/interviews`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all applicant to interview'
        };
    }
};

// SCHEDULE INTERVIEW
export const scheduleInterview = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/applicants/interview/schedule/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to set applicant a interview schedule'
        };
    }
};

// INTERVIEW RESULT
export const interviewResult = async (interviewResult, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/applicants/interview/result/${interviewResult}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to set applicant a interview result'
        };
    }
};