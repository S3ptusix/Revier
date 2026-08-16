import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH HOME CONTENT
export const fetchHomeContent = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/systemContent/home/fetch`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch home content'
        };
    }
};

// FETCH HOME SECTION
export const fetchHomeSection = async (section) => {
    try {
        const response = await axios.get(`${API_URL}/api/systemContent/home/fetch/${section}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch section'
        };
    }
};

// UPDATE HERO SECTION
export const updateHeroSection = async (formData) => {
    try {
        
        const response = await axios.put(`${API_URL}/api/systemContent/home/hero/update`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update hero section'
        };
    }
};

// UPDATE HOW IT WORKS SECTION
export const updateHowItWorksSection = async (formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/systemContent/home/howItWorks/update`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update How It Works section'
        };
    }
};

// UPDATE HOW IT WORKS STEPS
export const updateHowItWorksSteps = async (steps) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/systemContent/home/howItWorks/steps/update`,
            { steps },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update How It Works steps'
        };
    }
};

// UPDATE CONTACT SECTION
export const updateContactSection = async (formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/systemContent/home/contact/update`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update contact section'
        };
    }
};

// UPLOAD/REPLACE HOME IMAGE
export const uploadHomeImage = async (field, file) => {
    try {
        const data = new FormData();
        data.append('image', file);

        const response = await axios.post(`${API_URL}/api/systemContent/home/image/${field}/upload`, data, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to upload image'
        };
    }
};
