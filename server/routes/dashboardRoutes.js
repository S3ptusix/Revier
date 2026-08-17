import { Router } from "express";
import {
    getPipelineCounts,
    getDashboardSummary,
    getInterviewsToday,
    getUpcomingOrientations
} from "../controllers/dashboardControllers.js";
import { authenticateAdminJWT } from "../middleware/auth.js";

const dashboardRouter = Router();

dashboardRouter.get("/pipeline", authenticateAdminJWT, getPipelineCounts);
dashboardRouter.get("/summary", authenticateAdminJWT, getDashboardSummary);
dashboardRouter.get("/interviews-today", authenticateAdminJWT, getInterviewsToday);
dashboardRouter.get("/upcoming-orientations", authenticateAdminJWT, getUpcomingOrientations);

export default dashboardRouter;