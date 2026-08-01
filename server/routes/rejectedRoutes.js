import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllRejectedAndBlacklistedController, fetchRejectedTotalController } from '../controllers/rejectedControllers.js';

const rejectedRouter = express.Router();

// FETCH ALL REJECTED AND BLACKLISTED
rejectedRouter.get('/fetchAll', authenticateAdminJWT, fetchAllRejectedAndBlacklistedController);

// FETCH REJECTED TOTALS
rejectedRouter.get('/totals', authenticateAdminJWT, fetchRejectedTotalController);

export default rejectedRouter;