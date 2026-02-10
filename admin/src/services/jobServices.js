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