import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE JOB
export const createJob = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/job/create`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create job'
        };
    }
};

// FETCH ALL JOB
export const fetchAllJob = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/job/readAll`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all job'
        };
    }
};

// DELETE JOB
export const deletejob = async (jobId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/job/delete/${jobId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete job'
        };
    }
};