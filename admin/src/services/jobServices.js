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

// FETCH ONE JOB
export const fetchOneJob = async (jobId) => {
    try {
        const response = await axios.get(`${API_URL}/api/job/read/${jobId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch job'
        };
    }
};

// FETCH ALL JOB
export const fetchAllJob = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/job/readAll`, {
            params: formData,
            withCredentials: true
        });
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
export const deleteJob = async (jobId) => {
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

// EDIT JOB
export const editJob = async (jobId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/job/edit/${jobId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to edit job'
        };
    }
};

// EDIT JOB STATUS
export const editJobStatus = async (jobId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/job/status/edit/${jobId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to edit job status'
        };
    }
};

// FETCH JOB TOTALS
export const fetchJobTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/job/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch job totals'
        };
    }
};