import { attritionRateTrendService, fetchReportsTotalService, fetchStatusDistributionService, hiringTrendsAnalysisService, jobsByIndustryService, monthlyAttritionRateService, topPerformanceCompaniesService } from "../services/reportsServices.js";

// FETCH REPORTS TOTALS
export const fetchReportsTotalController = async (req, res) => {
    try {

        const { companyId, monthYear } = req.query;

        const result = await fetchReportsTotalService(companyId, monthYear);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// HIRING TRENDS ANALYSIS
export const hiringTrendsAnalysisController = async (req, res) => {
    try {

        const { companyId, year } = req.query;

        const result = await hiringTrendsAnalysisService(companyId, year);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// ATTRITION RATE TREND
export const attritionRateTrendController = async (req, res) => {
    try {

        const { companyId, year } = req.query;

        const result = await attritionRateTrendService(companyId, year);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH STATUS DISTRIBUTIONS
export const fetchStatusDistributionController = async (req, res) => {
    try {

        const result = await fetchStatusDistributionService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// JOBS BY INDUSTRY
export const jobsByIndustryController = async (req, res) => {
    try {

        const result = await jobsByIndustryService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// JOBS BY INDUSTRY
export const topPerformanceCompaniesController = async (req, res) => {
    try {

        const result = await topPerformanceCompaniesService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// MONTHLY ATTRITION RATE
export const monthlyAttritionRateController = async (req, res) => {
    try {

        const { companyId, year } = req.query;

        const result = await monthlyAttritionRateService(companyId, year);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

