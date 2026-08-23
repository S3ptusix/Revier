import { Router } from "express";
import {
    getPipelineCounts,
    getDashboardSummary,
    getInterviewsToday,
    getUpcomingOrientations
} from "../controllers/dashboardControllers.js";
import { authenticateAdminJWT } from "../middleware/auth.js";
import { dashboardGeneralLimiter } from "../middleware/rateLimiter/dashboardRateLimiter.js";

const dashboardRouter = Router();

dashboardRouter.get("/pipeline", dashboardGeneralLimiter, authenticateAdminJWT, getPipelineCounts);
dashboardRouter.get("/summary", dashboardGeneralLimiter, authenticateAdminJWT, getDashboardSummary);
dashboardRouter.get("/interviews-today", dashboardGeneralLimiter, authenticateAdminJWT, getInterviewsToday);
dashboardRouter.get("/upcoming-orientations", dashboardGeneralLimiter, authenticateAdminJWT, getUpcomingOrientations);

export default dashboardRouter;
