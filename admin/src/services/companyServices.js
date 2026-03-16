import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE COMPANY
export const createCompany = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/company/create`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create company'
        };
    }
};

// FETCH ADD COMPANY
export const fetchAllSelectCompany = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/company/select/fetchAll`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all company'
        };
    }
};

// FETCH ALL COMPANY
export const fetchAllCompany = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/company/fetchAll`, {
            params: formData,
            withCredentials: true
        });

        return response.data;

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all company'
        };
    }
};
// FETCH ONE COMPANY
export const fetchOneCompany = async (comapanyId) => {
    try {
        const response = await axios.get(`${API_URL}/api/company/fetchOne/${comapanyId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch company'
        };
    }
};

// UPDATE COMPANY
export const updateCompany = async (companyId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/company/update/${companyId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update company'
        };
    }
};

// DELETE COMPANY
export const deleteCompany = async (companyId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/company/delete/${companyId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete company'
        };
    }
};

// FETCH COMPANY TOTALS
export const fetchCompanyTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/company/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch company totals'
        };
    }
};