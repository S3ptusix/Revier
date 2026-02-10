import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// READ JOB POSTING
export const readJobPosting = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/job/jobposting`, { params: formData });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch jobs'
        };
    }
};

// READ ONE JOB
export const readOneJob = async (jobId) => {
    try {
        const response = await axios.get(`${API_URL}/api/job/read/${jobId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch job details'
        };
    }
};
