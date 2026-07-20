import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const handleRequest = async (request, errorMessage) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: error.response?.data?.message || errorMessage
        };
    }
};


// ======================================================
// RECRUITMENT OVERVIEW
// ======================================================
export const fetchRecruitmentOverview = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/overview`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch recruitment overview"
    );
};


// ======================================================
// HIRING TREND
// ======================================================
export const fetchHiringTrend = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/hiring-trend`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch hiring trend"
    );
};


// ======================================================
// ATTRITION TREND
// ======================================================
export const fetchAttritionTrend = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/attrition-trend`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch attrition trend"
    );
};


// ======================================================
// HIRING VELOCITY
// ======================================================
export const fetchHiringVelocity = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/hiring-velocity`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch hiring velocity"
    );
};


// ======================================================
// JOB PERFORMANCE
// ======================================================
export const fetchJobPerformance = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/job-performance`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch job performance"
    );
};


// ======================================================
// COMPANY PERFORMANCE
// ======================================================
export const fetchCompanyPerformance = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/company-performance`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch company performance"
    );
};


// ======================================================
// DASHBOARD TOTALS
// ======================================================
export const fetchDashboardTotals = async (params = {}) => {
    return handleRequest(
        () =>
            axios.get(
                `${API_URL}/api/reports-analytics/totals`,
                {
                    params,
                    withCredentials: true
                }
            ),
        "Failed to fetch dashboard totals"
    );
};