import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH USER PROFILE
export const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/profile/fetch`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch jobs'
        };
    }
};

// EDIT USER PROFILE
export const editUserProfile = async (formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/user/profile/update`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch jobs'
        };
    }
};

// APPLY USER
export const applyUser = async (jobId, formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/user/apply/${jobId}`, formData, {
            withCredentials: true,       // include cookies
            headers: { "Content-Type": "multipart/form-data" } // ensure FormData is recognized
        }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to apply"
        };
    }
};

// EDIT APPLICATION
export const editApplication = async (applicationId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/user/edit/${applicationId}`, formData, {
            withCredentials: true,       // include cookies
            headers: { "Content-Type": "multipart/form-data" } // ensure FormData is recognized
        }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to edit application"
        };
    }
};

// RECENT APPLICATIONS
export const fetchRecentApplications = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/user/recentApplications`, { params: formData, withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch recent applications"
        };
    }
};

// NOTIFICATIONS
export const notifications = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/user/notification`, { params: formData, withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch notications"
        };
    }
};

// SAVE JOB
export const saveJob = async (jobId) => {
    try {
        const response = await axios.put(`${API_URL}/api/user/saveJob/${jobId}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to save job"
        };
    }
};

// FETCH ALL SAVED JOB LIST
export const fetchAllSavedJobList = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/savedJobs/list`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch all saved job list"
        };
    }
};

// SAVED JOB
export const fetchAllSavedJobs = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/user/savedJobs`, { params: formData, withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to saved job"
        };
    }
};