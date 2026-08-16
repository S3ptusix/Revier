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
