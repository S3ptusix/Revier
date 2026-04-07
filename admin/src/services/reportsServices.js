import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH REPORTS TOTALS
export const fetchReportsTotals = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/totals`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch reports totals'
        };
    }
};

// HIRING TRENDS ANALYSIS
export const hiringTrendsAnalysis = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/hiringTrendsAnalysis`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch hiring trends analysis'
        };
    }
};

// ATTRITION RATE TREND
export const attritionRateTrend = async (formData) => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/attritionRateTrend`, {
            params: formData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch hiring trends analysis'
        };
    }
};

// FETCH STATUS DISTRIBUTION
export const fetchStatusDistribution = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/statusDistribution`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch status distribution'
        };
    }
};

// JOBS BY INDUSTRY
export const jobsByIndustry = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/jobsByIndustry`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch status jobs by industry'
        };
    }
};

// TOP PERFORMANCE COMPANIES
export const topPerformanceCompanies = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/topPerformanceCompanies`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch top performance companies'
        };
    }
};