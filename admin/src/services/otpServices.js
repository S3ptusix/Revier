import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// OTP VERIFY ADMIN
export const otpVerify = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/otp/admin/verify`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to verify email'
        };
    }
};

// SEND OTP ADMIN
export const sendOtp = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/otp/admin/sendOtp`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to send OTP'
        };
    }
};

// SEND OTP ADMIN FORGOT-PASSWORD
export const sendOtpForgotPassword = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/otp/admin/forgot-password/sendOtp`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to send OTP'
        };
    }
};