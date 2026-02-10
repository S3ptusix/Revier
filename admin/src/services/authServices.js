import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ADMIM LOGIN
export const loginAdmin = async (adminData) => {
    try {
        const response = await axios.post(`${API_URL}/api/admin/login`, adminData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            message: error.response?.data?.message || 'Failed to login'
        };
    }
}


// LOGOUT ADMIN
export const logoutAdmin = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/logout`, { withCredentials: true });
        return response.data;

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to logout'
        };
    }
};

// FETCH ADMIM 
export const fetchAdmin = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/fetch`, { withCredentials: true });
        return response.data.admin;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch admin'
        };
    }
};
