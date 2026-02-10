import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ADMIN REGISTRATION
export const handleRegister = async (adminData) => {
    try {
        const response = await axios.post(`${API_URL}/api/admin/register`, adminData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to register account'
        };
    }
};