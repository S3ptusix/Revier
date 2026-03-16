import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE ORIENTATION EVENT
export const createOrientationEvent = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/orientations/create`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create orientation event'
        };
    }
};

// FETCH ONE ORIENTATION EVENT
export const fetchOneOrientationEvent = async (orientationId) => {
    try {
        const response = await axios.get(`${API_URL}/api/orientations/fetchOne/${orientationId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch one orientation event'
        };
    }
};

// FETCH ALL ORIENTATION EVENT
export const fetchAllOrientationEvent = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orientations/fetchAll/events`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all orientation events'
        };
    }
};

// FETCH ALL ORIENTATIONS
export const fetchAllOrientation = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/orientations/fetchAll/applicants`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all orientation applicants'
        };
    }
};

// FETCH ALL APPLICANTS FROM ORIENTATION
export const applicantsFromOrientation = async (orientationId) => {
    try {
        const response = await axios.get(`${API_URL}/api/orientations/fetchAll/applicantsFromOrientation/${orientationId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch all applicants from orientation'
        };
    }
};

// ADD TO EVENT
export const addToEvent = async (applicantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/orientations/addToEvent/${applicantId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add applicant to event'
        };
    }
};

// EDIT ORIENTATION STATUS
export const editOrientationStatus = async (orientationId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/orientations/edit/orientationStatus/${orientationId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete orientation event'
        };
    }
};

// DELETE ORIENTATION 
export const deleteOrientation = async (orientationId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/orientations/delete/${orientationId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete orientation event'
        };
    }
};

// REMOVE FROM EVENT 
export const removeFromEvent = async (applicantId) => {
    try {
        const response = await axios.put(`${API_URL}/api/orientations/removeFromEvent/${applicantId}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove applicant from the event'
        };
    }
};


// EDIT ORIENTATION EVENT 
export const editOrientationEvent = async (orientationId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/orientations/edit/${orientationId}`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to edit orientation event'
        };
    }
};

// FETCH ORIENTATION TOTALS
export const fetchOrientationTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orientations/totals`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch orientation totals'
        };
    }
};
