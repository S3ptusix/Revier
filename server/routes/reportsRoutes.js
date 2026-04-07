import express from 'express';
import { attritionRateTrendController, fetchReportsTotalController, fetchStatusDistributionController, hiringTrendsAnalysisController, jobsByIndustryController, topPerformanceCompaniesController } from '../controllers/reportsControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const reportsRouter = express.Router();

// FETCH REPORTS TOTALS
reportsRouter.get('/totals', authenticateAdminJWT, fetchReportsTotalController);

// HIRING TRENDS ANALYSIS 
reportsRouter.get('/hiringTrendsAnalysis', authenticateAdminJWT, hiringTrendsAnalysisController);

// ATTRITION RATE TREND
reportsRouter.get('/attritionRateTrend', authenticateAdminJWT, attritionRateTrendController);

// FETCH STATUS DISTRIBUTION
reportsRouter.get('/statusDistribution', authenticateAdminJWT, fetchStatusDistributionController);

// JOBS BY INDUSTRY
reportsRouter.get('/jobsByIndustry', authenticateAdminJWT, jobsByIndustryController);

// TOP PERFORMANCE COMPANIES
reportsRouter.get('/topPerformanceCompanies', authenticateAdminJWT, topPerformanceCompaniesController);

export default reportsRouter;