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

// RECENT APPLICATIONS
export const fetchRecentApplications = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/recentApplications`, { withCredentials: true });
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
export const notifications = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/notification`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch notications"
        };
    }
};