import express from "express";

import {

    getRecruitmentOverview,
    getHiringTrend,
    getAttritionTrend,
    getHiringVelocity,
    getJobPerformance,
    getCompanyPerformance,
    getDashboardTotals

} from "../controllers/reportsAnalyticsControllers.js";


const reportsAnalyticsRouter = express.Router();



// Dashboard Overview
reportsAnalyticsRouter.get(
    "/overview",
    getRecruitmentOverview
);


// Hiring Trend
reportsAnalyticsRouter.get(
    "/hiring-trend",
    getHiringTrend
);


// Attrition Trend
reportsAnalyticsRouter.get(
    "/attrition-trend",
    getAttritionTrend
);


// Hiring Velocity
reportsAnalyticsRouter.get(
    "/hiring-velocity",
    getHiringVelocity
);


// Job Performance
reportsAnalyticsRouter.get(
    "/job-performance",
    getJobPerformance
);

// Company Hiring Performance
reportsAnalyticsRouter.get(
    "/company-performance",
    getCompanyPerformance
);

reportsAnalyticsRouter.get(
    "/totals",
    getDashboardTotals
);


export default reportsAnalyticsRouter;