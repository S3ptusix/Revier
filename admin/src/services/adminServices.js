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

// FETCH ONE ADMIN
export const fetchOneAdmin = async (adminId) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/fetchOne/${adminId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch admin'
        };
    }
};

// FETCH ALL ADMIN
export const fetchAllAdmin = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/fetchAll`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all admin'
        };
    }
};

// DELETE ADMIN
export const deleteAdmin = async (adminId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/admin/delete/${adminId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete admin'
        };
    }
};

// EDIT ADMIN
export const editAdmin = async (adminId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/admin/edit/${adminId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to edit admin'
        };
    }
};

// FETCH ADMIN TOTALS
export const fetchAdminTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch admin totals'
        };
    }
};
