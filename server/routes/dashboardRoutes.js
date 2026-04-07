import express from 'express';
import { fetchDashboardTotalController } from '../controllers/dasboardControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const dashboardRouter = express.Router();

// FETCH DASHBOARD TOTALS
dashboardRouter.get('/totals', authenticateAdminJWT, fetchDashboardTotalController);

export default dashboardRouter;