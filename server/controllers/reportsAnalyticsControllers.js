import {
    recruitmentOverviewService,
    hiringTrendService,
    attritionTrendService,
    hiringVelocityService,
    jobPerformanceService,
    companyPerformanceService,
    dashboardTotalsService,
} from "../services/reportsAnalyticsServices.js";


// helper
const parseYear = (year) =>
    year ? Number(year) : new Date().getFullYear();


// ======================================================
// 1. Recruitment Overview
// ======================================================
export const getRecruitmentOverview = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await recruitmentOverviewService(
            companyId,
            parseYear(year)
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// 2. Hiring Trend
// ======================================================
export const getHiringTrend = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await hiringTrendService(
            parseYear(year),
            companyId
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// 3. Attrition Trend
// ======================================================
export const getAttritionTrend = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await attritionTrendService(
            parseYear(year),
            companyId
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// 4. Hiring Velocity
// ======================================================
export const getHiringVelocity = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await hiringVelocityService(
            companyId,
            parseYear(year)
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// 5. Job Performance
// ======================================================
export const getJobPerformance = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await jobPerformanceService({
            companyId,
            year: parseYear(year)
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// 6. Company Performance
// ======================================================
export const getCompanyPerformance = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await companyPerformanceService({
            companyId,
            year: parseYear(year)
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// 7. Dashboard Totals
// ======================================================
export const getDashboardTotals = async (req, res) => {
    try {
        const { companyId, year } = req.query;

        const result = await dashboardTotalsService(
            companyId,
            parseYear(year)
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};