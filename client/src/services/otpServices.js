import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// OTP VERIFY
export const otpVerify = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/otp/verify`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to verify email'
        };
    }
};

// SEND OTP
export const sendOtp = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/api/otp/sendOtp`, email);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to send OTP'
        };
    }
};